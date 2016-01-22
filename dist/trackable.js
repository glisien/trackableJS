(function() {
  'use strict'

  function getClass(o) {
    return ({}).toString.call(o);
  }

  function isString(o) {
    return getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'string';
  }

  function isObject(o) {
    return getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'object';
  }

  function isArray(o) {
    return getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'array';
  }

  function isTrackable(o) {
    return (isObject(o) || isArray(o)) && (o instanceof TrackableObject || o instanceof TrackableArray);
  }

  function isTrackableObject(o) {
    return (isObject(o) || isArray(o)) && o instanceof TrackableObject;
  }

  function isTrackableArray(o) {
    return (isObject(o) || isArray(o)) && o instanceof TrackableArray;
  }

  function isNullOrUndefined(o) {
    return o === null || o === undefined;
  }

  function areEqual(o1, o2) {
    var fieldName;

    if (o1 === o2) {
      return true;
    }

    if (!(o1 instanceof Object) || !(o2 instanceof Object)) {
      return false;
    }

    if (o1.constructor !== o2.constructor) {
      return false;
    }

    for (fieldName in o1) {
      if (!o1.hasOwnProperty(fieldName)) {
        continue;
      }

      if (!o2.hasOwnProperty(fieldName)) {
        return false;
      }

      if (o1[fieldName] === o2[fieldName]) {
        continue;
      }

      if (typeof (o1[fieldName]) !== 'object') {
        return false;
      }

      if (!areEqual(o1[fieldName], o2[fieldName])) {
        return false;
      }
    }

    for (fieldName in o2) {
      if (o2.hasOwnProperty(fieldName) && !o1.hasOwnProperty(fieldName)) {
        return false;
      }
    }
  }

  function createTrackableObjectStructure(o) {
    Object.defineProperty(o, '_trackable', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });

    Object.defineProperty(o._trackable, 'fields', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });

    Object.defineProperty(o._trackable, 'audit', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });

    Object.defineProperty(o._trackable.audit, 'pointer', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: 0
    });

    Object.defineProperty(o._trackable.audit, 'events', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: []
    });

    Object.defineProperty(o._trackable.audit, 'snapshots', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });
  }

  function createTrackableArrayStructure(o) {
    Object.defineProperty(o, '_trackable', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });

    Object.defineProperty(o._trackable, 'fields', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });

    Object.defineProperty(o._trackable, 'extensions', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });

    Object.defineProperty(o._trackable, 'audit', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });

    Object.defineProperty(o._trackable.audit, 'pointer', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: 0
    });

    Object.defineProperty(o._trackable.audit, 'events', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: []
    });

    Object.defineProperty(o._trackable.audit, 'snapshots', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });
  }

  function createTrackableField(o, fieldName, fieldValue) {
    // create backing field
    if (isObject(fieldValue)) {
      Object.defineProperty(o._trackable.fields, fieldName, {
        enumerable: true,
        writable: true,
        configurable: true,
        value: new TrackableObject(fieldValue)
      });
    } else if (isArray(fieldValue)) {
      Object.defineProperty(o._trackable.fields, fieldName, {
        enumerable: true,
        writable: true,
        configurable: true,
        value: new TrackableArray(fieldValue)
      });
    } else {
      Object.defineProperty(o._trackable.fields, fieldName, {
        enumerable: true,
        writable: true,
        configurable: true,
        value: fieldValue
      });
    }

    // create getter and setter for backing field
    Object.defineProperty(o, fieldName, {
      enumerable: true,
      configurable: true,
      get: function() {
        return this._trackable.fields[fieldName];
      },
      set: function(value) {
        var snapshotFieldName,
            changeEvent;

        if (isTrackable(value)) {
          throw new Error('Cannot assign Trackable objects or arrays.');
        }

        // 01. ASSIGN: null/undefined   TO: null/undefined
        // 02. ASSIGN: null/undefined   TO: TrackableObject
        // 03. ASSIGN: null/undefined   TO: TrackableArray
        // 04. ASSIGN: null/undefined   TO: primitive_type
        // 05. ASSIGN: Object           TO: null/undefined
        // 06. ASSIGN: Object           TO: TrackableObject
        // 07. ASSIGN: Object           TO: TrackableArray
        // 08. ASSIGN: Object           TO: primitive_type
        // 09. ASSIGN: Array            TO: null/undefined
        // 10. ASSIGN: Array            TO: TrackableObject
        // 11. ASSIGN: Array            TO: TrackableArray
        // 12. ASSIGN: Array            TO: primitive_type
        // 13. ASSIGN: primitive_type   TO: null/undefined
        // 14. ASSIGN: primitive_type   TO: TrackableObject
        // 15. ASSIGN: primitive_type   TO: TrackableArray
        // 16. ASSIGN: primitive_type   TO: primitive_type

        if (isNullOrUndefined(value)) {
          // 01. ASSIGN: null/undefined TO: null/undefined
          if (isNullOrUndefined(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: null/undefined TO: null/undefined');
          }

          // 02. ASSIGN: null/undefined TO: TrackableObject
          if (isTrackableObject(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: null/undefined TO: TrackableObject');
          }

          // 03. ASSIGN: null/undefined TO: TrackableArray
          if (isTrackableArray(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: null/undefined TO: TrackableArray');
          }

          // 04. ASSIGN: null/undefined TO: primitive type
          console.info('ASSIGN: null/undefined TO: primitive_type');
        }

        if (isObject(value)) {
          // 05. ASSIGN: Object TO: null/undefined
          if (isNullOrUndefined(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: Object TO: null/undefined');
          }

          // 06. ASSIGN: Object TO: TrackableObject
          if (isTrackableObject(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: Object TO: TrackableObject');
          }

          // 07. ASSIGN: Object TO: TrackableArray
          if (isTrackableArray(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: Object TO: TrackableArray');
          }

          // 08. ASSIGN: Object TO: primitive type
          console.info('ASSIGN: Object TO: primitive_type');
        }

        if (isArray(value)) {
          // 09. ASSIGN: Array TO: null/undefined
          if (isNullOrUndefined(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: Array TO: null/undefined');
          }

          // 10. ASSIGN: Array TO: TrackableObject
          if (isTrackableObject(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: Array TO: TrackableObject');
          }

          // 11. ASSIGN: Array TO: TrackableArray
          if (isTrackableArray(this._trackable.fields[fieldName])) {
            console.info('ASSIGN: Array TO: TrackableArray');
          }

          // 12. ASSIGN: Array TO: primitive type
          console.info('ASSIGN: Array TO: primitive_type');
        }

        // 13. ASSIGN: primitive type TO: null/undefined
        if (isNullOrUndefined(this._trackable.fields[fieldName])) {
          console.info('ASSIGN: primitive_type TO: null/undefined');
        }

        // 14. ASSIGN: primitive type TO: TrackableObject
        if (isTrackableObject(this._trackable.fields[fieldName])) {
          console.info('ASSIGN: primitive_type TO: TrackableObject');
        }

        // 15. ASSIGN: primitive type TO: TrackableArray
        if (isTrackableArray(this._trackable.fields[fieldName])) {
          console.info('ASSIGN: primitive_type TO: TrackableArray');
        }

        // 16. ASSIGN: primitive type TO: primitive type
        console.info('ASSIGN: primitive_type TO: primitive_type');

      /* TESTING */
      this._trackable.audit.events.splice(this._trackable.audit.pointer);

      for (snapshotFieldName in this._trackable.audit.snapshots) {
        if (this._trackable.audit.snapshots.hasOwnProperty(snapshotFieldName)) {
          if (this._trackable.audit.snapshots[snapshotFieldName] >= this._trackable.audit.pointer) {
            delete this._trackable.audit.snapshots[snapshotFieldName];
          }
        }
      }

      changeEvent = {
        field: fieldName,
        oldValue: isTrackable(this._trackable.fields[fieldName]) ?
                    this._trackable.fields[fieldName].asNonTrackable() :
                    this._trackable.fields[fieldName],
        newValue: isTrackable(value) ?
                    value.asNonTrackable() :
                    value
      };

      this._trackable.audit.events.push(changeEvent);
      this._trackable.audit.pointer += 1;

      if (isObject(value)) {
        this._trackable.fields[fieldName] = new TrackableObject(value);
      } else if (isArray(value)) {
        this._trackable.fields[fieldName] = new TrackableArray(value);
      } else {
        this._trackable.fields[fieldName] = value;
      }

      return;
    }});
  }

  function TrackableObject(o) {
    var fieldDescriptor,
        fieldName;

    if (isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!isObject(o)) {
      throw new Error('Only an Object or Array can learn how to track.');
    }

    createTrackableObjectStructure(this);

    for (fieldName in o) {
      if (o.hasOwnProperty(fieldName)) {
        fieldDescriptor = Object.getOwnPropertyDescriptor(o, fieldName);
        if (fieldDescriptor.writable && fieldDescriptor.configurable) {
          createTrackableField(this, fieldName, fieldDescriptor.value);
        }
      }
    }

    return this;
  }

  TrackableObject.prototype.createSnapshot = function(id) {
    if (!isString(id)) {
      throw new Error('Trackers only like string snapshot identifiers.')
    }
    this._trackable.audit.snapshots[id] = this._trackable.audit.pointer;
    return this;
  }

  TrackableObject.prototype.applySnapshot = function(id) {
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

  TrackableObject.prototype.hasChanges = function() {
    return this.hasLocalChanges() || this.hasChildChanges();
  }

  TrackableObject.prototype.hasLocalChanges = function() {
    return !!(this._trackable.audit.events.length && this._trackable.audit.pointer);
  }

  TrackableObject.prototype.hasChildChanges = function() {
    var fieldName;
    for (let fieldName in this) {
      if (this.hasOwnProperty(fieldName)) {
        if (isTrackable(this._trackable.fields[fieldName])) {
          if (this._trackable.fields[fieldName].hasChanges()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  TrackableObject.prototype.hasChangesAfterSnapshot = function(id) {
    var snapshotPointer;
    if (this._trackable.audit.snapshots.hasOwnProperty(id)) {
      snapshotPointer = this._trackable.audit.snapshots[id];
      if (this._trackable.audit.events.length > snapshotPointer) {
        return true;
      }
    }
    return false;
  }

  TrackableObject.prototype.undo = function() {
    var changeEvent = this._trackable.audit.events[this._trackable.audit.pointer - 1];
    if (changeEvent) {
      if (isObject(changeEvent.oldValue)) {
        this._trackable.fields[changeEvent.field] = new TrackableObject(changeEvent.oldValue);
      } else if (isArray(changeEvent.oldValue)) {
        this._trackable.fields[changeEvent.field] = new TrackableArray(changeEvent.oldValue);
      } else {
        this._trackable.fields[changeEvent.field] = changeEvent.oldValue;
      }
      this._trackable.audit.pointer -= 1;
    }
    return this;
  }

  TrackableObject.prototype.undoAll = function() {
    while (this._trackable.audit.pointer > 0) {
      this.undo();
    }
    return this;
  }

  TrackableObject.prototype.redo = function() {
    let changeEvent = this._trackable.audit.events[this._trackable.audit.pointer];
    if (changeEvent) {
      if (isObject(changeEvent.newValue)) {
        this._trackable.fields[changeEvent.field] = new TrackableObject(changeEvent.newValue);
      } else if (isArray(changeEvent.newValue)) {
        this._trackable.fields[changeEvent.field] = new TrackableArray(changeEvent.newValue);
      } else {
        this._trackable.fields[changeEvent.field] = changeEvent.newValue;
      }
      this._trackable.audit.pointer += 1;
    }
    return this;
  }

  TrackableObject.prototype.redoAll = function() {
    while (this._trackable.audit.pointer < this._trackable.audit.events.length) {
      this.redo();
    }
    return this;
  }

  TrackableObject.prototype.asNonTrackable = function() {
    var o = {},
        fieldName;

    for (fieldName in this) {
      if (this.hasOwnProperty(fieldName)) {
        if (isTrackable(this[fieldName])) {
          o[fieldName] = this[fieldName].asNonTrackable();
        } else {
          o[fieldName] = this[fieldName]
        }
      }
    }

    return o;
  }

  window.TrackableObject = TrackableObject;

  function TrackableArray(o) {
    var fieldDescriptor,
        fieldName;

    if (isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!isArray(o)) {
      throw new Error('Only an Object or Array can learn how to track.');
    }

    createTrackableArrayStructure(this);

    for (fieldName in o) {
      if (o.hasOwnProperty(fieldName)) {
        fieldDescriptor = Object.getOwnPropertyDescriptor(o, fieldName);
        if (fieldDescriptor.writable && fieldDescriptor.configurable) {
          createTrackableField(this, fieldName, fieldDescriptor.value);
        }
      }
    }

    return this;
  }

  TrackableArray.prototype.createSnapshot = function(id) {
    // TODO
  }

  TrackableArray.prototype.applySnapshot = function(id) {
    // TODO
  }

  TrackableArray.prototype.hasChanges = function() {
    // TODO
  }

  TrackableArray.prototype.hasLocalChanges = function() {
    // TODO
  }

  TrackableArray.prototype.hasChildChanges = function() {
    // TODO
  }

  TrackableArray.prototype.hasChangesAfterSnapshot = function(id) {
    // TODO
  }

  TrackableArray.prototype.undo = function() {
    // TODO
  }

  TrackableArray.prototype.undoAll = function() {
    // TODO
  }

  TrackableArray.prototype.redo = function() {
    // TODO
  }

  TrackableArray.prototype.redoAll = function() {
    // TODO
  }

  TrackableArray.prototype.asNonTrackable = function() {
    // TODO
  }

  window.TrackableArray = TrackableArray;
})();
