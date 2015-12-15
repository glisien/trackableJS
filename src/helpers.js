export function getClass(o) {
  return ({}).toString.call(o);
}

export function isObject(o) {
  return this.getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'object';
}

export function isArray(o) {
  return this.getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'array';
}

export function isTrackable(o) {
  return (this.isObject(o) || this.isArray(o)) && (o instanceof TrackableObject || o instanceof TrackableArray);
}

export function isTrackableObject(o) {
  return (this.isObject(o) || this.isArray(o)) && o instanceof TrackableObject;
}

export function isTrackableArray(o) {
  return (this.isObject(o) || this.isArray(o)) && o instanceof TrackableArray;
}

export function areEqual(o1, o2) {
  let prop;

  if (o1 === o2) {
    return true;
  }

  if (!(o1 instanceof Object) || !(o2 instanceof Object)) {
    return false;
  }

  if (o1.constructor !== o2.constructor) {
    return false;
  }

  for (prop in o1) {
    if (!o1.hasOwnProperty(prop)) {
      continue;
    }

    if (!o2.hasOwnProperty(prop)) {
      return false;
    }

    if (o1[prop] === o2[prop]) {
      continue;
    }

    if (typeof (o1[prop]) !== 'object') {
      return false;
    }

    if (!this.areEqual(o1[prop], o2[prop])) {
      return false;
    }
  }

  for (prop in o2) {
    if (o2.hasOwnProperty(prop) && !o1.hasOwnProperty(prop)) {
      return false;
    }
  }
}

export function createTrackableContainer(o) {
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

  Object.defineProperty(o._trackable, 'workspaces', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: []
  });
}

export function evaluateState(o) {
}
