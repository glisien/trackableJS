import * as GenericHelpers from './generic-helpers'

export function createStructure(o) {
  Object.defineProperty(o, '__trackable__', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__, 'configuration', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  if (GenericHelpers.isObject(o)) {
    Object.defineProperty(o.__trackable__.configuration, 'addStateDefinition', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });
  }

  Object.defineProperty(o.__trackable__, 'extensions', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__, 'fields', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__, 'state', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__.state, 'current', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: null
  });

  Object.defineProperty(o.__trackable__.state, 'original', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: null
  });

  Object.defineProperty(o.__trackable__, 'audit', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__.audit, 'pointer', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: 0
  });

  Object.defineProperty(o.__trackable__.audit, 'events', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: []
  });

  Object.defineProperty(o.__trackable__.audit, 'snapshots', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });
}

export function createField(o, name, value) {
  // create backing field
  if (GenericHelpers.isObject(value)) {
    Object.defineProperty(o.__trackable__.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: new TrackableObject(value)
    });
  } else if (GenericHelpers.isArray(value)) {
    Object.defineProperty(o.__trackable__.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: new TrackableArray(value)
    });
  } else {
    Object.defineProperty(o.__trackable__.fields, name, {
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
      return o.__trackable__.fields[name]
    },
    set: function(value) {
      if (o.__trackable__.state.current === 'd') {
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
        if (GenericHelpers.isNullOrUndefined(o.__trackable__.fields[name])) {
          console.info('ASSIGN: null/undefined TO: null/undefined');
        }

        // 02. ASSIGN: null/undefined TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o.__trackable__.fields[name])) {
          console.info('ASSIGN: null/undefined TO: TrackableObject');
        }

        // 03. ASSIGN: null/undefined TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o.__trackable__.fields[name])) {
          console.info('ASSIGN: null/undefined TO: TrackableArray');
        }

        // 04. ASSIGN: null/undefined TO: primitive type
        console.info('ASSIGN: null/undefined TO: primitive type');
      }

      if (GenericHelpers.isObject(value)) {
        // 05. ASSIGN: Object TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Object TO: null/undefined');
        }

        // 06. ASSIGN: Object TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Object TO: TrackableObject');
        }

        // 07. ASSIGN: Object TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Object TO: TrackableArray');
        }

        // 08. ASSIGN: Object TO: primitive type
        console.info('ASSIGN: Object TO: primitive type');
      }

      if (GenericHelpers.isArray(value)) {
        // 09. ASSIGN: Array TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Array TO: null/undefined');
        }

        // 10. ASSIGN: Array TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Array TO: TrackableObject');
        }

        // 11. ASSIGN: Array TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Array TO: TrackableArray');
        }

        // 12. ASSIGN: Array TO: primitive type
        console.info('ASSIGN: Array TO: primitive type');
      }

      // 13. ASSIGN: primitive type TO: null/undefined
      if (GenericHelpers.isNullOrUndefined(o.__trackable__.fields[name])) {
        console.info('ASSIGN: primitive type TO: null/undefined');
      }

      // 14. ASSIGN: primitive type TO: TrackableObject
      if (GenericHelpers.isTrackableObject(o.__trackable__.fields[name])) {
        console.info('ASSIGN: primitive type TO: TrackableObject');
      }

      // 15. ASSIGN: primitive type TO: TrackableArray
      if (GenericHelpers.isTrackableArray(o.__trackable__.fields[name])) {
        console.info('ASSIGN: primitive type TO: TrackableArray');
      }

      // 16. ASSIGN: primitive type TO: primitive type
      console.info('ASSIGN: primitive type TO: primitive type');

      /*********** TESTING *******************/
      o.__trackable__.audit.events.splice(o.__trackable__.audit.pointer);

      for (let propertyName in o.__trackable__.audit.snapshots) {
        if (o.__trackable__.audit.snapshots.hasOwnProperty(propertyName)) {
          if (o.__trackable__.audit.snapshots[propertyName] >= o.__trackable__.audit.pointer) {
            delete o.__trackable__.audit.snapshots[propertyName];
          }
        }
      }

      let change = {
        property: name,
        oldValue: GenericHelpers.isTrackable(o.__trackable__.fields[name]) ?
                    o.__trackable__.fields[name].asNonTrackable() :
                    o.__trackable__.fields[name],
        newValue: GenericHelpers.isTrackable(value) ?
                    value.asNonTrackable() :
                    value
      }

      o.__trackable__.audit.events.push(change);
      o.__trackable__.audit.pointer += 1;

      if (GenericHelpers.isObject(value)) {
        o.__trackable__.fields[name] = new TrackableObject(value);
      } else if (GenericHelpers.isArray(value)) {
        o.__trackable__.fields[name] = new TrackableArray(value);
      } else {
        o.__trackable__.fields[name] = value;
      }
    }
  });
}

export function evaluateState(o) {
  // check if deleted
  if (o.__trackable__.state.current === 'd') {
    return;
  }

  // check if added
  if (Object.keys(o.__trackable__.configuration.addStateDefinition).length) {
    let isAdded = true;

    for (let propertyName in o.__trackable__.configuration.addStateDefinition) {
      if (o.hasOwnProperty(propertyName)) {
        if (o.__trackable__.configuration.addStateDefinition[propertyName] !== o[propertyName]) {
          isAdded = false;
          break;
        }
      } else {
        isAdded = false;
        break;
      }
    }

    if (isAdded) {
      o.__trackable__.state.current = 'a';
      return;
    }
  }

  // check if updated
  let isUpdated = false,
      w = o.__trackable__.snapshots.length;

  while (w--) {
    if (o.__trackable__.snapshots[w].events.length > 0) {
      isUpdated = true;
      break;
    }
  }

  if (isUpdated) {
    o.__trackable__.state.current = 'u';
    return;
  } else {
    o.__trackable__.state.current = 'p';
    return;
  }
}
