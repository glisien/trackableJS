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

  function onSet (target, property, value, receiver) {
    if (this.isTracking) {
      console.debug('onSet', target, property, value, receiver);

      var trackingInfo = this.trackingInfoMap.get(receiver);
      if (trackingInfo) {
        var changeEvent = new ChangeEvent();
        changeEvent.property = property;
        changeEvent.oldValue = target[property];
        changeEvent.newValue = value;

        trackingInfo.events.push(changeEvent);

        trackingInfo.pointer += 1;
      }
    }

    return Reflect.set(target, property, value, receiver);
  };

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
      set: onSet.bind(this)
    });

    this.originalToTrackedMap.set(obj, trackedObj);
    this.trackedToOriginalMap.set(trackedObj, obj);
    this.trackingInfoMap.set(trackedObj, new TrackingInfo());

    // go through the properties and track them as well
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var childObj = obj[prop];
        if (isObjectOrArray(childObj)) {
          var trackedChildObj = this.asTrackable(obj[prop]);
          this.isTracking = false;
          trackedObj[prop] = trackedChildObj;
          this.isTracking = true;
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

    var trackingInfo = this.trackingInfoMap.get(obj);

    // check local changes
    if (trackingInfo.events.length > 0 && trackingInfo.pointer > 0) {
      return true;
    }

    // check for child changes
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var childObj = obj[prop];
        if (isObjectOrArray(childObj) && this.trackingInfoMap.has(childObj)) {
          if (this.hasChanges(childObj)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  Tracker.prototype.printChanges = function (obj) {
    // LG
    // Helper method to print all the change stored by the tracker
    // for the given object.
  }

  window.Tracker = Tracker;
})();
