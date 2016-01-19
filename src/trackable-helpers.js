import * as GenericHelpers from './generic-helpers'

export function createStructure(o) {
  Object.defineProperty(o, '_trackable', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o._trackable, 'configuration', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  if (GenericHelpers.isObject(o)) {
    Object.defineProperty(o._trackable.configuration, 'addStateDefinition', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });
  }

  Object.defineProperty(o._trackable, 'extensions', {
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

  Object.defineProperty(o._trackable, 'state', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o._trackable.state, 'current', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: null
  });

  Object.defineProperty(o._trackable.state, 'original', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: null
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
    value: []
  });
}

export function createField(o, name, value) {
  // create backing field
  if (GenericHelpers.isObject(value)) {
    Object.defineProperty(o._trackable.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: new TrackableObject(value)
    });
  } else if (GenericHelpers.isArray(value)) {
    Object.defineProperty(o._trackable.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: new TrackableArray(value)
    });
  } else {
    Object.defineProperty(o._trackable.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: value
    });
  }

  // create getter/setter for backing field
  Object.defineProperty(o, name, {
    enumerable: true,
    configurable: true,
    get: function() {
      return o._trackable.fields[name]
    },
    set: function(value) {
      if (o._trackable.state.current === 'd') {
        throw Error('Once deleted always deleted.');
      }

      // currently not supporting assigning a trackable object or array
      if (GenericHelpers.isTrackable(value)) {
        throw Error('Cannot assing Trackable objects or arrays.');
      }

      // 01. ASSIGN: null/undefined   TO: null/undefined
      // 02. ASSIGN: null/undefined   TO: TrackableObject
      // 03. ASSIGN: null/undefined   TO: TrackableArray
      // 04. ASSIGN: null/undefined   TO: primitive type
      // 05. ASSIGN: Object           TO: null/undefined
      // 06. ASSIGN: Object           TO: TrackableObject
      // 07. ASSIGN: Object           TO: TrackableArray
      // 08. ASSIGN: Object           TO: primitive type
      // 09. ASSIGN: Array            TO: null/undefined
      // 10. ASSIGN: Array            TO: TrackableObject
      // 11. ASSIGN: Array            TO: TrackableArray
      // 12. ASSIGN: Array            TO: primitive type
      // 13. ASSIGN: primitive type   TO: null/undefined
      // 14. ASSIGN: primitive type   TO: TrackableObject
      // 15. ASSIGN: primitive type   TO: TrackableArray
      // 16. ASSIGN: primitive type   TO: primitive type

      if (GenericHelpers.isNullOrUndefined(value)) {
        // 01. ASSIGN: null/undefined TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: null/undefined');
        }

        // 02. ASSIGN: null/undefined TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: TrackableObject');
        }

        // 03. ASSIGN: null/undefined TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: TrackableArray');
        }

        // 04. ASSIGN: null/undefined TO: primitive type
        console.log('ASSIGN: null/undefined TO: primitive type');
      }

      if (GenericHelpers.isObject(value)) {
        // 05. ASSIGN: Object TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: null/undefined');
        }

        // 06. ASSIGN: Object TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: TrackableObject');
        }

        // 07. ASSIGN: Object TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: TrackableArray');
        }

        // 08. ASSIGN: Object TO: primitive type
        console.log('ASSIGN: Object TO: primitive type');
      }

      if (GenericHelpers.isArray(value)) {
        // 09. ASSIGN: Array TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: null/undefined');
        }

        // 10. ASSIGN: Array TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: TrackableObject');
        }

        // 11. ASSIGN: Array TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: TrackableArray');
        }

        // 12. ASSIGN: Array TO: primitive type
        console.log('ASSIGN: Array TO: primitive type');
      }

      // 13. ASSIGN: primitive type TO: null/undefined
      if (GenericHelpers.isNullOrUndefined(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: null/undefined');
      }

      // 14. ASSIGN: primitive type TO: TrackableObject
      if (GenericHelpers.isTrackableObject(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: TrackableObject');
      }

      // 15. ASSIGN: primitive type TO: TrackableArray
      if (GenericHelpers.isTrackableArray(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: TrackableArray');
      }

      // 16. ASSIGN: primitive type TO: primitive type
      console.log('ASSIGN: primitive type TO: primitive type');

      /*********** TESTING *******************/
      let changeEvent = GenericHelpers.find(o._trackable.snapshots[0].events, { property: name });

      if (changeEvent) {
        if (GenericHelpers.areEqual(changeEvent.original, value)) {
          GenericHelpers.remove(o._trackable.snapshots[0].events, changeEvent);
        }
      } else {
        if (GenericHelpers.isTrackable(o._trackable.fields[name])) {
          var nonTrackableOriginal = o._trackable.fields[name].asNonTrackable();
          changeEvent = {
            property: name,
            original: o._trackable.fields[name]
          };
        } else {
          changeEvent = {
            property: name,
            original: o._trackable.fields[name]
          };
        }
        o._trackable.snapshots[0].events.push(changeEvent);
      }

      if (GenericHelpers.isObject(value)) {
        o._trackable.fields[name] = new TrackableObject(value);
      } else if (GenericHelpers.isArray(value)) {
        o._trackable.fields[name] = new TrackableArray(value);
      } else {
        o._trackable.fields[name] = value;
      }

      evaluateTrackableObjectState(o);
    }
  });
}

export function evaluateState(o) {
  // check if deleted
  if (o._trackable.state.current === 'd') {
    return;
  }

  // check if added
  if (Object.keys(o._trackable.configuration.addStateDefinition).length) {
    let isAdded = true;

    for (let propertyName in o._trackable.configuration.addStateDefinition) {
      if (o.hasOwnProperty(propertyName)) {
        if (o._trackable.configuration.addStateDefinition[propertyName] !== o[propertyName]) {
          isAdded = false;
          break;
        }
      } else {
        isAdded = false;
        break;
      }
    }

    if (isAdded) {
      o._trackable.state.current = 'a';
      return;
    }
  }

  // check if updated
  let isUpdated = false,
      w = o._trackable.snapshots.length;

  while (w--) {
    if (o._trackable.snapshots[w].events.length > 0) {
      isUpdated = true;
      break;
    }
  }

  if (isUpdated) {
    o._trackable.state.current = 'u';
    return;
  } else {
    o._trackable.state.current = 'p';
    return;
  }
}
