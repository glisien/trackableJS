export function getClass(o) {
  return ({}).toString.call(o);
}

export function isObject(o) {
  return getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'object';
}

export function isArray(o) {
  return getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'array';
}

export function isTrackable(o) {
  return (isObject(o) || isArray(o)) && (o instanceof TrackableObject || o instanceof TrackableArray);
}

export function isTrackableObject(o) {
  return (isObject(o) || isArray(o)) && o instanceof TrackableObject;
}

export function isTrackableArray(o) {
  return (isObject(o) || isArray(o)) && o instanceof TrackableArray;
}

export function areEqual(o1, o2) {
  let propertyName;

  if (o1 === o2) {
    return true;
  }

  if (!(o1 instanceof Object) || !(o2 instanceof Object)) {
    return false;
  }

  if (o1.constructor !== o2.constructor) {
    return false;
  }

  for (propertyName in o1) {
    if (!o1.hasOwnProperty(propertyName)) {
      continue;
    }

    if (!o2.hasOwnProperty(propertyName)) {
      return false;
    }

    if (o1[propertyName] === o2[propertyName]) {
      continue;
    }

    if (typeof (o1[propertyName]) !== 'object') {
      return false;
    }

    if (!areEqual(o1[propertyName], o2[propertyName])) {
      return false;
    }
  }

  for (propertyName in o2) {
    if (o2.hasOwnProperty(propertyName) && !o1.hasOwnProperty(propertyName)) {
      return false;
    }
  }
}

export function find(a, o) {
  let i = a.length;
  while (i--) {
    let found = true;
    for (let propertyName in o) {
      if (a[i].hasOwnProperty(propertyName)) {
        if (a[i][propertyName] === o[propertyName]) {
          continue;
        }
      }
      found = false;
      break;
    }

    if (found) {
      return a[i];
    }
  }
  return null;
}

export function remove(a, o) {
  let i = a.indexOf(o);
  a.splice(i, 1);
}

export function stringId(length = 10) {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      result = '';

  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function isNullOrUndefined(o) {
  return o === null || o === undefined;
}

export function createTrackableStructure(o) {
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

  if (isObject(o)) {
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

  Object.defineProperty(o._trackable, 'workspaces', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: []
  });
}

export function createTrackableObjectField(o, name, value) {
  // create backing field
  if (isObject(value)) {
    Object.defineProperty(o._trackable.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: new TrackableObject(value)
    });
  } else if (isArray(value)) {
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
      // if already deleted; do not allow more changes
      if (o._trackable.state.current === 'd') {
        throw Error('Once deleted always deleted.');
      }

      // currently not supporting assigning a trackable object or array
      if (isTrackable(value)) {
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

      if (isNullOrUndefined(value)) {
        // 01. ASSIGN: null/undefined TO: null/undefined
        if (isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: null/undefined');
          //return;
        }

        // 02. ASSIGN: null/undefined TO: TrackableObject
        if (isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: TrackableObject');
          // TODO
          //return;
        }

        // 03. ASSIGN: null/undefined TO: TrackableArray
        if (isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: TrackableArray');
          // TODO
          //return;
        }

        // 04. ASSIGN: null/undefined TO: primitive type
        console.log('ASSIGN: null/undefined TO: primitive type');
        // TODO
        //return;
      }

      if (isObject(value)) {
        // 05. ASSIGN: Object TO: null/undefined
        if (isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: null/undefined');
          // TODO
          //return;
        }

        // 06. ASSIGN: Object TO: TrackableObject
        if (isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: TrackableObject');
          // TODO
          //return;
        }

        // 07. ASSIGN: Object TO: TrackableArray
        if (isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: TrackableArray');
          // TODO
          //return;
        }

        // 08. ASSIGN: Object TO: primitive type
        console.log('ASSIGN: Object TO: primitive type');
        // TODO
        //return;
      }

      if (isArray(value)) {
        // 09. ASSIGN: Array TO: null/undefined
        if (isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: null/undefined');
          // TODO
          //return;
        }

        // 10. ASSIGN: Array TO: TrackableObject
        if (isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: TrackableObject');
          // TODO
          //return;
        }

        // 11. ASSIGN: Array TO: TrackableArray
        if (isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: TrackableArray');
          // TODO
          //return;
        }

        // 12. ASSIGN: Array TO: primitive type
        console.log('ASSIGN: Array TO: primitive type');
        // TODO
        //return;
      }

      // 13. ASSIGN: primitive type TO: null/undefined
      if (isNullOrUndefined(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: null/undefined');
        // TODO
        //return;
      }

      // 14. ASSIGN: primitive type TO: TrackableObject
      if (isTrackableObject(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: TrackableObject');
        // TODO
        //return;
      }

      // 15. ASSIGN: primitive type TO: TrackableArray
      if (isTrackableArray(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: TrackableArray');
        // TODO
        //return;
      }

      // 16. ASSIGN: primitive type TO: primitive type
      console.log('ASSIGN: primitive type TO: primitive type');
      // TODO
      //return;

      /*********** TESTING *******************/
      let change = find(o._trackable.workspaces[0].changes, { property: name });

      if (change) {
        if (areEqual(change.original, value)) {
          remove(o._trackable.workspaces[0].changes, change);
        }
      } else {
        if (isTrackable(o._trackable.fields[name])) {
          var nonTrackableOriginal = o._trackable.fields[name].asNonTrackable();
          change = {
            property: name,
            original: o._trackable.fields[name]
          };
        } else {
          change = {
            property: name,
            original: o._trackable.fields[name]
          };
        }
        o._trackable.workspaces[0].changes.push(change);
      }

      if (isObject(value)) {
        o._trackable.fields[name] = new TrackableObject(value);
      } else if (isArray(value)) {
        o._trackable.fields[name] = new TrackableArray(value);
      } else {
        o._trackable.fields[name] = value;
      }

      evaluateTrackableObjectState(o);
    }
  });
}

export function evaluateTrackableObjectState(o) {
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
      w = o._trackable.workspaces.length;

  while (w--) {
    if (o._trackable.workspaces[w].changes.length > 0) {
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
