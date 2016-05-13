(function () {
  'use strict';

  function getClass (obj) {
    return ({}).toString.call(obj);
  }

  function isString (obj) {
    return getClass(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'string';
  }

  function isObject (obj) {
    return getClass(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'object';
  }

  function isArray (obj) {
    return getClass(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'array';
  }

  function isTrackable (obj) {
    return (isObject(obj) || isArray(obj)) && (obj instanceof Trackable);
  }

  function isTrackableObject (obj) {
    return (isObject(obj) || isArray(obj)) && obj instanceof TrackableObject;
  }

  function isTrackableArray (obj) {
    return (isObject(obj) || isArray(obj)) && obj instanceof TrackableArray;
  }

  function isNullOrUndefined (obj) {
    return obj === null || obj === undefined;
  }

  function areEqual (obj1, obj2) {
    var prop;

    if (obj1 === obj2) {
      return true;
    }

    if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) {
      return false;
    }

    if (obj1.constructor !== obj2.constructor) {
      return false;
    }

    for (prop in obj1) {
      if (!obj1.hasOwnProperty(prop)) {
        continue;
      }

      if (!obj2.hasOwnProperty(prop)) {
        return false;
      }

      if (obj1[prop] === obj2[prop]) {
        continue;
      }

      if (typeof (obj1[prop]) !== 'object') {
        return false;
      }

      if (!areEqual(obj1[prop], obj2[prop])) {
        return false;
      }
    }

    for (prop in obj2) {
      if (obj2.hasOwnProperty(prop) && !obj1.hasOwnProperty(prop)) {
        return false;
      }
    }
  }

  // fn parameters: object, property, value, isRecurring
  function iterate (obj, fn) {
    function isInHistory (obj) {
      var i;
      for (i = 0; i < history.length; i++) {
        if (history[i] === obj) {
          return true;
        }
      }
      return false;
    }

    function traverse (obj) {
      var prop, val;
      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          val = obj[prop];
          if (isObject(val) || isArray(val)) {
            if (isInHistory(val)) {
              fn(obj, prop, val, true)
            } else {
              history.push(val);
              fn(obj, prop, val, false);
              traverse(val, fn);
            }
          } else {
            fn(obj, prop, val, false);
          }
        }
      }
    }

    var history = [];

    history.push(obj);
    fn(null, null, obj, false);
    traverse(obj);
  }

  function clone (obj) {
    var cloneObj, prop, i, l;

    if (isObject(obj)) {
      cloneObj = {};
      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (isObject(obj[prop]) || isArray(obj[prop]) || isTrackable(obj[prop])) {
            cloneObj[prop] = clone(obj[prop]);
            continue;
          }
          cloneObj[prop] = obj[prop];
        }
      }
      return cloneObj;
    }

    if (isArray(obj)) {
      cloneObj = [];
      for (i = 0, l = obj.length; i < l; i++) {
        if (isObject(obj[i]) || isArray(obj[i]) || isTrackable(obj[i])) {
          cloneObj.push(clone(obj[i]));
          continue;
        }
        cloneObj.push(obj[i]);
      }
      return cloneObj;
    }

    if (isTrackable(obj)) {
      if (isTrackableObject(obj)) {
        cloneObj = Object.create(TrackableObject.prototype);
      }
      if (isTrackableArray(obj)) {
        cloneObj = Object.create(TrackableArray.prototype);
      }
      createTrackingStructure(cloneObj);
      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (isObject(obj[prop]) || isArray(obj[prop]) || isTrackable(obj[prop])) {
            createPropertyTrackingStructure(cloneObj, prop, clone(obj[prop]));
            continue;
          }
          createPropertyTrackingStructure(cloneObj, prop, obj[prop]);
        }
      }
      cloneObj._trackable.audit = clone(obj._trackable.audit);
      return cloneObj;
    }
  }

  function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function createTrackingStructure (obj) {
    Object.defineProperty(obj, '_trackable', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: {}
    });

    Object.defineProperty(obj._trackable, 'fields', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: {}
    });

    Object.defineProperty(obj._trackable, 'audit', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: {}
    });

    Object.defineProperty(obj._trackable.audit, 'pointer', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: 0
    });

    Object.defineProperty(obj._trackable.audit, 'events', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: []
    });

    Object.defineProperty(obj._trackable.audit, 'snapshots', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: {}
    });
  }

  function createPropertyTrackingStructure (obj, prop, val) {
    // create backing field
    Object.defineProperty(obj._trackable.fields, prop, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: val
    });

    // create getter and setter for backing field
    Object.defineProperty(obj, prop, {
      enumerable: true,
      configurable: true,
      get: function () {
        return this._trackable.fields[prop];
      },
      set: function (value) {
        var snapshotFieldName,
            changeEvent;

        if ((isObject(value) || isArray(value)) && !isTrackable(value)) {
          throw new Error('Invalid object type. Object and arrays must be trackable before being assigned.', value);
        }

        // 01. ASSIGN: null/undefined   TO: null/undefined
        // 02. ASSIGN: null/undefined   TO: TrackableObject
        // 03. ASSIGN: null/undefined   TO: TrackableArray
        // 04. ASSIGN: null/undefined   TO: primitive_type
        // 05. ASSIGN: TrackableObject  TO: null/undefined
        // 06. ASSIGN: TrackableObject  TO: TrackableObject
        // 07. ASSIGN: TrackableObject  TO: TrackableArray
        // 08. ASSIGN: TrackableObject  TO: primitive_type
        // 09. ASSIGN: TrackableArray   TO: null/undefined
        // 10. ASSIGN: TrackableArray   TO: TrackableObject
        // 11. ASSIGN: TrackableArray   TO: TrackableArray
        // 12. ASSIGN: TrackableArray   TO: primitive_type
        // 13. ASSIGN: primitive_type   TO: null/undefined
        // 14. ASSIGN: primitive_type   TO: TrackableObject
        // 15. ASSIGN: primitive_type   TO: TrackableArray
        // 16. ASSIGN: primitive_type   TO: primitive_type

        if (isNullOrUndefined(value)) {
          // 01. ASSIGN: null/undefined TO: null/undefined
          if (isNullOrUndefined(this._trackable.fields[prop])) {
            console.info('ASSIGN: null/undefined TO: null/undefined');
          }

          // 02. ASSIGN: null/undefined TO: TrackableObject
          if (isTrackableObject(this._trackable.fields[prop])) {
            console.info('ASSIGN: null/undefined TO: TrackableObject');
          }

          // 03. ASSIGN: null/undefined TO: TrackableArray
          if (isTrackableArray(this._trackable.fields[prop])) {
            console.info('ASSIGN: null/undefined TO: TrackableArray');
          }

          // 04. ASSIGN: null/undefined TO: primitive type
          console.info('ASSIGN: null/undefined TO: primitive_type');
        }

        if (isTrackableObject(value)) {
          // 05. ASSIGN: Object TO: null/undefined
          if (isNullOrUndefined(this._trackable.fields[prop])) {
            console.info('ASSIGN: Object TO: null/undefined');
          }

          // 06. ASSIGN: Object TO: TrackableObject
          if (isTrackableObject(this._trackable.fields[prop])) {
            console.info('ASSIGN: Object TO: TrackableObject');
          }

          // 07. ASSIGN: Object TO: TrackableArray
          if (isTrackableArray(this._trackable.fields[prop])) {
            console.info('ASSIGN: Object TO: TrackableArray');
          }

          // 08. ASSIGN: Object TO: primitive type
          console.info('ASSIGN: Object TO: primitive_type');
        }

        if (isTrackableArray(value)) {
          // 09. ASSIGN: Array TO: null/undefined
          if (isNullOrUndefined(this._trackable.fields[prop])) {
            console.info('ASSIGN: Array TO: null/undefined');
          }

          // 10. ASSIGN: Array TO: TrackableObject
          if (isTrackableObject(this._trackable.fields[prop])) {
            console.info('ASSIGN: Array TO: TrackableObject');
          }

          // 11. ASSIGN: Array TO: TrackableArray
          if (isTrackableArray(this._trackable.fields[prop])) {
            console.info('ASSIGN: Array TO: TrackableArray');
          }

          // 12. ASSIGN: Array TO: primitive type
          console.info('ASSIGN: Array TO: primitive_type');
        }

        // 13. ASSIGN: primitive type TO: null/undefined
        if (isNullOrUndefined(this._trackable.fields[prop])) {
          console.info('ASSIGN: primitive_type TO: null/undefined');
        }

        // 14. ASSIGN: primitive type TO: TrackableObject
        if (isTrackableObject(this._trackable.fields[prop])) {
          console.info('ASSIGN: primitive_type TO: TrackableObject');
        }

        // 15. ASSIGN: primitive type TO: TrackableArray
        if (isTrackableArray(this._trackable.fields[prop])) {
          console.info('ASSIGN: primitive_type TO: TrackableArray');
        }

        // 16. ASSIGN: primitive type TO: primitive type
        console.info('ASSIGN: primitive_type TO: primitive_type');

      /* TESTING */
      this._trackable.audit.events.splice(this._trackable.audit.pointer);
      this._trackable.audit.pointer += 1;

      for (snapshotFieldName in this._trackable.audit.snapshots) {
        if (this._trackable.audit.snapshots.hasOwnProperty(snapshotFieldName)) {
          if (this._trackable.audit.snapshots[snapshotFieldName] >= this._trackable.audit.pointer) {
            delete this._trackable.audit.snapshots[snapshotFieldName];
          }
        }
      }

      changeEvent = {
        field: prop,
        oldValue: this._trackable.fields[prop],
        newValue: value
      };

      this._trackable.audit.events.push(changeEvent);

      this._trackable.fields[prop] = value;
    }});
  }

  function Tracker () { }

  Tracker.prototype.asTrackable = function (obj) {
    function createTrackable (obj) {
      var i, prop, trackableObj;

      if(isTrackable(obj)) {
        throw new Error('Invalid object type. Object is already a trackable type', obj);
      }
      if (!isObject(obj) && !isArray(obj)) {
        throw new Error('Invalid object type. Only object and arrays can be made trackable.', obj);
      }

      for (i = 0; i < iterationHistory.length; i++) {
        if (iterationHistory[i].nonTrackableObj === obj) {
          return iterationHistory[i].trackableObj;
        }
      }

      if (isObject(obj)) {
        trackableObj = Object.create(TrackableObject.prototype);
      }
      if (isArray(obj)) {
        trackableObj = Object.create(TrackableArray.prototype);
      }

      iterationHistory.push({
        trackableObj: trackableObj,
        nonTrackableObj: obj
      });

      createTrackingStructure(trackableObj);

      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (isObject(obj[prop]) || isArray(obj[prop])) {
            createPropertyTrackingStructure(trackableObj, prop, createTrackable(obj[prop]));
            continue;
          }
          createPropertyTrackingStructure(trackableObj, prop, obj[prop]);
        }
      }

      return trackableObj;
    }

    var iterationHistory = [];

    return createTrackable(obj);
  }

  Tracker.prototype.asNonTrackable = function (obj) {
    function createNonTrackable (obj) {
      var i, prop, nonTrackableObj;

      if(!isTrackable(obj)) {
        throw new Error('Invalid object type. Object is already a non-trackable type.', obj);
      }

      for (i = 0; i < iterationHistory.length; i++) {
        if (iterationHistory[i].trackableObj === obj) {
          return iterationHistory[i].nonTrackableObj;
        }
      }

      if (isTrackableObject(obj)) {
        nonTrackableObj = Object.create(Object.prototype);
      }
      if (isTrackableArray(obj)) {
        nonTrackableObj = Object.create(Array.prototype);
      }

      iterationHistory.push({
        trackableObj: obj,
        nonTrackableObj: nonTrackableObj
      });

      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (isTrackable(obj[prop])) {
            nonTrackableObj[prop] = createNonTrackable(obj[prop]);
            continue;
          }
          if (isObject(obj[prop]) || isArray(obj[prop])) {
            throw new Error('Invalid object type. Object is already a non-trackable type.', obj[prop]);
          }
          nonTrackableObj[prop] = obj[prop];
        }
      }

      return nonTrackableObj;
    }

    var iterationHistory = [];

    return createNonTrackable(obj);
  }

  function Trackable () { }

  Trackable.prototype.toString = function () {
    return '[object Trackable]';
  }

  Trackable.prototype.createSnapshot = function (id) {
    if (!isString(id)) {
      throw new Error('Invalid snapshot id. A string snapshot identifier is expected.', id);
    }
    this._trackable.audit.snapshots[id] = this._trackable.audit.pointer;
    return this;
  }

  Trackable.prototype.applySnapshot = function (id) {
    var snapshotPointer;
    if (this._trackable.audit.snapshots.hasOwnProperty(id)) {
      snapshotPointer = this._trackable.audit.snapshots[id];
      if (snapshotPointer < this._trackable.audit.pointer) {
        while (this._trackable.audit.pointer > snapshotPointer) {
          this.undo();
        }
      } else if (snapshotPointer > this._trackable.audit.pointer) {
        while (this._trackable.audit.pointer < snapshotPointer) {
          this.redo();
        }
      }
    }
    return this;
  }

  Trackable.prototype.hasChanges = function () {
    return this.hasLocalChanges() || this.hasChildChanges();
  }

  Trackable.prototype.hasLocalChanges = function () {
    return !!(this._trackable.audit.events.length && this._trackable.audit.pointer);
  }

  Trackable.prototype.hasChildChanges = function () {
    var prop;
    for (prop in this) {
      if (this.hasOwnProperty(prop)) {
        if (isTrackable(this._trackable.fields[prop])) {
          if (this._trackable.fields[prop].hasChanges()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  Trackable.prototype.hasChangesAfterSnapshot = function (id) {
    var snapshotPointer;
    if (this._trackable.audit.snapshots.hasOwnProperty(id)) {
      snapshotPointer = this._trackable.audit.snapshots[id];
      if (this._trackable.audit.pointer > snapshotPointer) {
        return true;
      }
    }
    return false;
  }

  Trackable.prototype.undo = function () {
    var changeEvent = this._trackable.audit.events[this._trackable.audit.pointer - 1];
    if (changeEvent) {
      this._trackable.fields[changeEvent.field] = changeEvent.oldValue;
      this._trackable.audit.pointer -= 1;
    }
    return this;
  }

  Trackable.prototype.undoAll = function () {
    while (this._trackable.audit.pointer > 0) {
      this.undo();
    }
    return this;
  }

  Trackable.prototype.redo = function () {
    var changeEvent = this._trackable.audit.events[this._trackable.audit.pointer];
    if (changeEvent) {
      this._trackable.fields[changeEvent.field] = changeEvent.newValue;
      this._trackable.audit.pointer += 1;
    }
    return this;
  }

  Trackable.prototype.redoAll = function () {
    while (this._trackable.audit.pointer < this._trackable.audit.events.length) {
      this.redo();
    }
    return this;
  }

  function TrackableObject () { }

  TrackableObject.prototype = Object.create(Trackable.prototype);

  TrackableObject.prototype.toString = function () {
    return '[object TrackableObject]';
  }

  function TrackableArray () { }

  TrackableArray.prototype = Object.create(Trackable.prototype);

  TrackableArray.prototype.toString = function () {
    return '[object TrackableArray]';
  }

  window.Tracker = Tracker;
})();
