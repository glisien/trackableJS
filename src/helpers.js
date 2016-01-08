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

export function stringId(length = 10) {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      result = '';

  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
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

      // if trying to nullify a TrackableObject or TrackableArray
      // treat that as a delete and handle as a special case
      if (value === null || value === undefined) {
        if (isTrackableObject(o._trackable.fields[name])) {
          // if TrackableObject is already in a 'deleted' state; do nothing
          if (o._trackable.fields[name]._trackable.state.current === 'd') {
            return;
          }

          // if TrackableObject is already in an 'added' state
          if (o._trackable.fields[name]._trackable.state.current === 'a') {
            let change = find(o._trackable.workspace[0].changes, { property: name });

            if (change) {
              // TODO: previous change found
            } else {
              // TODO: add new change
            }

            let current = o._trackable.fields[name].asNonTrackable();
            
            o._trackable.workspaces[0].changes.push({
              property:
            })
            return;
          }

          o._trackable.fields[name]._trackable.state.current === 'd';
          return;
        }

        if (isTrackableArray(o._trackable.fields[name])) {
        }
      }

      // if trying to set the value to an existing value; do nothing

      o._trackable.fields[name] = value;
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
  let isUpdated = false;

  let w = o._trackable.workspaces.length;
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
