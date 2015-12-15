(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _trackableObject = require('./trackable-object');

var _trackableArray = require('./trackable-array');

window.TrackableObject = _trackableObject.TrackableObject;
window.TrackableArray = _trackableArray.TrackableArray;

},{"./trackable-array":2,"./trackable-object":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackableArray = undefined;

var _trackableHelpers = require('./trackable-helpers');

var Helpers = _interopRequireWildcard(_trackableHelpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrackableArray = exports.TrackableArray = function TrackableArray() {
  _classCallCheck(this, TrackableArray);
};

},{"./trackable-helpers":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClass = getClass;
function getClass(o) {
  throw new Error('Not Implemented.');
}

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackableObject = undefined;

var _trackableHelpers = require('./trackable-helpers');

var Helpers = _interopRequireWildcard(_trackableHelpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrackableObject = exports.TrackableObject = (function () {
  function TrackableObject() {
    _classCallCheck(this, TrackableObject);
  }

  _createClass(TrackableObject, [{
    key: 'saySomething',
    value: function saySomething() {
      console.log('I can speak.');
    }
  }]);

  return TrackableObject;
})();

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

},{"./trackable-helpers":3}]},{},[1]);
