(function () {
  'use strict';

  function isObject (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'object';
  }

  function isArray (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'array';
  }

  function isObjectOrArray (obj) {
    return isObject(obj) || isArray(obj);
  }

  function TrackingInfo () {
    this.pointer = 0;
    this.events = [];
    this.snapshots = {};
  }

  function ChangeEvent () {
    this.property = null;
    this.isExistingProperty = null;
    this.oldValue = null;
    this.newValue = null;
  }

  function Tracker () {
    Object.defineProperty(this, 'originalToTrackedMap', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: new WeakMap()
    });
    Object.defineProperty(this, 'trackedToOriginalMap', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: new WeakMap()
    });
    Object.defineProperty(this, 'trackingInfoMap', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: new WeakMap()
    });
    Object.defineProperty(this, 'isTracking', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: true
    });
  }

  function setTrap (target, property, value, receiver) {
    if (this.isTracking) {
      console.debug('setTrap', target, property, value, receiver);
      let trackingInfo = this.trackingInfoMap.get(receiver);
      if (trackingInfo) {
        let changeEvent = new ChangeEvent();
        changeEvent.property = property;
        changeEvent.isExistingProperty = target.hasOwnProperty(property);
        changeEvent.oldValue = target[property];
        changeEvent.newValue = value;
        trackingInfo.events.push(changeEvent);
        trackingInfo.pointer += 1;
      }
    }
    return Reflect.set(target, property, value, receiver);
  };

  function definePropertyTrap (target, property, descriptor) {
    if (this.isTracking) {
      console.debug('definePropertyTrap', target, property, descriptor);
      let trackedObj = this.originalToTrackedMap.get(target);
      if (trackedObj) {
        let trackingInfo = this.trackingInfoMap.get(trackedObj);
        if (trackingInfo) {
          let changeEvent = new ChangeEvent();
          changeEvent.property = property;
          changeEvent.isExistingProperty = target.hasOwnProperty(property);
          changeEvent.oldValue = target[property];
          changeEvent.newValue = descriptor.hasOwnProperty('value') ? descriptor.value : descriptor.get();
          trackingInfo.events.push(changeEvent);
          trackingInfo.pointer += 1;
        }
      }
    }
    return Reflect.defineProperty(target, property, descriptor);
  }

  function deletePropertyTrap (target, property) {
    if (this.isTracking) {
      console.debug('deletePropertyTrap', target, property);
      let trackedObj = this.originalToTrackedMap.get(target);
      if (trackedObj) {
        let trackingInfo = this.trackingInfoMap.get(trackedObj);
        if (trackingInfo) {
          let changeEvent = new ChangeEvent();
          changeEvent.property = property;
          changeEvent.isExistingProperty = target.hasOwnProperty(property);
          changeEvent.oldValue = target[property];
          changeEvent.newValue = undefined;
          trackingInfo.events.push(changeEvent);
          trackingInfo.pointer += 1;
        }
      }
    }
    return Reflect.deleteProperty(target, property);
  }

  Tracker.prototype.asTrackable = function (obj) {
    if (!isObjectOrArray(obj)) {
      throw new TypeError('The only trackable types are Object and Array.');
    }

    // if we are currently tracking 'obj' then return 'obj'
    if (this.trackingInfoMap.has(obj)) {
      console.debug('Object is already being tracked', obj);
      return obj;
    }

    // if 'obj' is the original then return the tracked object if it is still available
    if (this.originalToTrackedMap.has(obj)) {
      console.debug('Object has previously been tracked and...', obj);
      let trackedObj = this.originalToTrackedMap.get(obj);
      if (this.trackingInfoMap.has(trackedObj)) {
        console.debug('...found the tracked object.', trackedObj);
        return trackedObj;
      } else {
        console.debug('...but cannot find the tracked object.')
      }
    }

    // track the current object
    let trackedObj = new Proxy(obj, {
      //set: setTrap.bind(this),
      defineProperty: definePropertyTrap.bind(this),
      deleteProperty: deletePropertyTrap.bind(this)
    });

    this.originalToTrackedMap.set(obj, trackedObj);
    this.trackedToOriginalMap.set(trackedObj, obj);
    this.trackingInfoMap.set(trackedObj, new TrackingInfo());

    // go through the properties and track any available objects
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        let childObj = obj[prop];
        if (isObjectOrArray(childObj)) {
          let trackedChildObj = this.asTrackable(childObj);
          obj[prop] = trackedChildObj;
        }
      }
    }

    return trackedObj;
  }

  Tracker.prototype.asNonTrackable = function (obj) {
  }

  Tracker.prototype.hasChanges = function (obj) {
    if (!isObjectOrArray(obj)) {
      throw new TypeError('Only Objects and Arrays can be checked for changes.');
    }

    if (!this.trackingInfoMap.has(obj)) {
      throw new Error('Object is not being tracked. Only tracked objects can be checked for changes.', obj);
    }

    let trackingInfo = this.trackingInfoMap.get(obj);

    // check local changes
    if (trackingInfo.events.length > 0 && trackingInfo.pointer > 0) {
      return true;
    }

    // check for child changes
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        let childObj = obj[prop];
        if (isObjectOrArray(childObj) && this.trackingInfoMap.has(childObj)) {
          if (this.hasChanges(childObj)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  Tracker.prototype.print = function (obj) {
    if (isObjectOrArray(obj) && this.trackingInfoMap.has(obj)) {
      console.groupCollapsed(obj);
      let trackingInfo = this.trackingInfoMap.get(obj);
      console.log('Pointer: ', trackingInfo.pointer);
      console.log('Snapshots: ', trackingInfo.snapshots);
      console.groupCollapsed('EVENTS: ', trackingInfo.events.length);
      for (let i = 0; i < trackingInfo.events.length; i++) {
        console.groupCollapsed('EVENT: ', i + 1);
        let event = trackingInfo.events[i];
        console.log('Property: ', event.property);
        console.log('Is Existing Property: ', event.isExistingProperty);
        console.log('Old Value: ', event.oldValue);
        console.log('New Value: ', event.newValue);
        console.groupEnd();
      }
      console.groupEnd();
      console.groupEnd();
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          this.print(obj[prop]);
        }
      }
    }
  }

  window.Tracker = Tracker;
})();
