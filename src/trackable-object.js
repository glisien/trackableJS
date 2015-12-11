import * as Helpers from './trackable-helpers'

export class TrackableObject {
  constructor() {
  }
}

/*
(function (window, undefined) {

  function _class(o) {
    return ({}).toString.call(o);
  }

  function _isObject(o) {
    return _class(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'object';
  }

  function _isArray(o) {
    return _class(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'array';
  }

  function _isTrackable(o) {
    return (_isObject(o) || _isArray(o)) && (o instanceof TrackableObject || o instanceof TrackableArray);
  }

  function _isTrackableObject(o) {
    return (_isObject(o) || _isArray(o)) && o instanceof TrackableObject;
  }

  function _isTrackableArray(o) {
    return (_isObject(o) || _isArray(o)) && o instanceof TrackableArray;
  }

  function _areEqual(o1, o2) {
    var prop;

    if (o1 === o2) {
      return true;
    }

    if (!(o1 instance of Object) || !(o2 instance of Object)) {
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

      if (!_areEqual(o1[prop], o2[prop])) {
        return false;
      }
    }

    for (prop in o2) {
      if (o2.hasOwnProperty(prop) && !o1.hasOwnProperty(prop)) {
        return false;
      }
    }
  }

  function _trackable_create(o) {
    Object.defineProperty(
      o,
      '_Trackable',
      value: {},
      enumerable: false,
      writable: true,
      configurable: false
    );

    Object.defineProperty(
      o[._Trackable],
      'State',
      value: {},
      enumerable: false,
      writable: true,
      configurable: false
    );

    Object.defineProperty(
      o._Trackable.State,
      'Original',
      value: 'N',
      enumerable: false,
      writable: true,
      configurable: false
    );

    Object.defineProperty(
      o._Trackable.State,
      'Current',
      value: 'N',
      enumerable: false,
      writable: true,
      configurable: false
    );

    Object.defineProperty(
      o._Trackable,
      'Changes',
      value: [],
      enumerable: false,
      writable: true,
      configurable: false
    );

    Object.defineProperty(
      o._Trackable,
      'Fields',
      value: {}},
      enumerable: false,
      writable: true,
      configurable: false
    );

    Object.defineProperty(
      o._Trackable,
      'Extension',
      value: {},
      enumerable: false,
      writable: true,
      configurable: false
    );
  }

  function TrackableObject(o) {
    if (_isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!_isObject(o)) {
      throw new Error('Only objects can learn how to track.')
    }

    _trackable_create(this);
  }

  function TrackableArray(o) {
    if (_isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!_isArray(o)) {
      throw new Error('Only arrays can learn how to track.')
    }
  }

  Object.defineProperty(
    Object.prototype,
    'AsTrackable',
    {
      value: function() {
        return new TrackableObject(this);
      },
      enumerable: false,
      writable: true,
      configurable: false
    }
  );

  Object.defineProperty(
    Array.prototype,
    'AsTrackable',
    {
      value: function() {
        return new TrackableArray(this);
      },
      enumerable: false,
      writable: true,
      configurable: false
    }
  );

})(window);
*/
