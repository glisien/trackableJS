(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _trackableObject = require('./trackable-object');

var _trackableArray = require('./trackable-array');
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackableObject = undefined;

var _trackableHelpers = require('./trackable-helpers');

var Helpers = _interopRequireWildcard(_trackableHelpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrackableObject = exports.TrackableObject = function TrackableObject() {
  _classCallCheck(this, TrackableObject);
};

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
},{"./trackable-helpers":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2NvbW1vbmpzL2luZGV4LmpzIiwiZGlzdC9jb21tb25qcy90cmFja2FibGUtYXJyYXkuanMiLCJkaXN0L2NvbW1vbmpzL3RyYWNrYWJsZS1oZWxwZXJzLmpzIiwiZGlzdC9jb21tb25qcy90cmFja2FibGUtb2JqZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdHJhY2thYmxlT2JqZWN0ID0gcmVxdWlyZSgnLi90cmFja2FibGUtb2JqZWN0Jyk7XG5cbnZhciBfdHJhY2thYmxlQXJyYXkgPSByZXF1aXJlKCcuL3RyYWNrYWJsZS1hcnJheScpOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuVHJhY2thYmxlQXJyYXkgPSB1bmRlZmluZWQ7XG5cbnZhciBfdHJhY2thYmxlSGVscGVycyA9IHJlcXVpcmUoJy4vdHJhY2thYmxlLWhlbHBlcnMnKTtcblxudmFyIEhlbHBlcnMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdHJhY2thYmxlSGVscGVycyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBUcmFja2FibGVBcnJheSA9IGV4cG9ydHMuVHJhY2thYmxlQXJyYXkgPSBmdW5jdGlvbiBUcmFja2FibGVBcnJheSgpIHtcbiAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRyYWNrYWJsZUFycmF5KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5nZXRDbGFzcyA9IGdldENsYXNzO1xuZnVuY3Rpb24gZ2V0Q2xhc3Mobykge1xuICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZC4nKTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLlRyYWNrYWJsZU9iamVjdCA9IHVuZGVmaW5lZDtcblxudmFyIF90cmFja2FibGVIZWxwZXJzID0gcmVxdWlyZSgnLi90cmFja2FibGUtaGVscGVycycpO1xuXG52YXIgSGVscGVycyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF90cmFja2FibGVIZWxwZXJzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFRyYWNrYWJsZU9iamVjdCA9IGV4cG9ydHMuVHJhY2thYmxlT2JqZWN0ID0gZnVuY3Rpb24gVHJhY2thYmxlT2JqZWN0KCkge1xuICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhY2thYmxlT2JqZWN0KTtcbn07XG5cbi8qXHJcbihmdW5jdGlvbiAod2luZG93LCB1bmRlZmluZWQpIHtcclxuXHJcbiAgZnVuY3Rpb24gX2NsYXNzKG8pIHtcclxuICAgIHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwobyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaXNPYmplY3Qobykge1xyXG4gICAgcmV0dXJuIF9jbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnb2JqZWN0JztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pc0FycmF5KG8pIHtcclxuICAgIHJldHVybiBfY2xhc3MobykubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKSA9PT0gJ2FycmF5JztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pc1RyYWNrYWJsZShvKSB7XHJcbiAgICByZXR1cm4gKF9pc09iamVjdChvKSB8fCBfaXNBcnJheShvKSkgJiYgKG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3QgfHwgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pc1RyYWNrYWJsZU9iamVjdChvKSB7XHJcbiAgICByZXR1cm4gKF9pc09iamVjdChvKSB8fCBfaXNBcnJheShvKSkgJiYgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZU9iamVjdDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pc1RyYWNrYWJsZUFycmF5KG8pIHtcclxuICAgIHJldHVybiAoX2lzT2JqZWN0KG8pIHx8IF9pc0FycmF5KG8pKSAmJiBvIGluc3RhbmNlb2YgVHJhY2thYmxlQXJyYXk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYXJlRXF1YWwobzEsIG8yKSB7XHJcbiAgICB2YXIgcHJvcDtcclxuXHJcbiAgICBpZiAobzEgPT09IG8yKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghKG8xIGluc3RhbmNlIG9mIE9iamVjdCkgfHwgIShvMiBpbnN0YW5jZSBvZiBPYmplY3QpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobzEuY29uc3RydWN0b3IgIT09IG8yLmNvbnN0cnVjdG9yKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHByb3AgaW4gbzEpIHtcclxuICAgICAgaWYgKCFvMS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIW8yLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobzFbcHJvcF0gPT09IG8yW3Byb3BdKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2YgKG8xW3Byb3BdKSAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghX2FyZUVxdWFsKG8xW3Byb3BdLCBvMltwcm9wXSkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHByb3AgaW4gbzIpIHtcclxuICAgICAgaWYgKG8yLmhhc093blByb3BlcnR5KHByb3ApICYmICFvMS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RyYWNrYWJsZV9jcmVhdGUobykge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxyXG4gICAgICBvLFxyXG4gICAgICAnX1RyYWNrYWJsZScsXHJcbiAgICAgIHZhbHVlOiB7fSxcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXHJcbiAgICApO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgICAgb1suX1RyYWNrYWJsZV0sXHJcbiAgICAgICdTdGF0ZScsXHJcbiAgICAgIHZhbHVlOiB7fSxcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXHJcbiAgICApO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgICAgby5fVHJhY2thYmxlLlN0YXRlLFxyXG4gICAgICAnT3JpZ2luYWwnLFxyXG4gICAgICB2YWx1ZTogJ04nLFxyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICk7XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxyXG4gICAgICBvLl9UcmFja2FibGUuU3RhdGUsXHJcbiAgICAgICdDdXJyZW50JyxcclxuICAgICAgdmFsdWU6ICdOJyxcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXHJcbiAgICApO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgICAgby5fVHJhY2thYmxlLFxyXG4gICAgICAnQ2hhbmdlcycsXHJcbiAgICAgIHZhbHVlOiBbXSxcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXHJcbiAgICApO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgICAgby5fVHJhY2thYmxlLFxyXG4gICAgICAnRmllbGRzJyxcclxuICAgICAgdmFsdWU6IHt9fSxcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXHJcbiAgICApO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgICAgby5fVHJhY2thYmxlLFxyXG4gICAgICAnRXh0ZW5zaW9uJyxcclxuICAgICAgdmFsdWU6IHt9LFxyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBUcmFja2FibGVPYmplY3Qobykge1xyXG4gICAgaWYgKF9pc1RyYWNrYWJsZShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXJzIGRvIG5vdCBsaWtlIHRvIGJlIHRyYWNrZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFfaXNPYmplY3QobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9iamVjdHMgY2FuIGxlYXJuIGhvdyB0byB0cmFjay4nKVxyXG4gICAgfVxyXG5cclxuICAgIF90cmFja2FibGVfY3JlYXRlKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVHJhY2thYmxlQXJyYXkobykge1xyXG4gICAgaWYgKF9pc1RyYWNrYWJsZShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXJzIGRvIG5vdCBsaWtlIHRvIGJlIHRyYWNrZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFfaXNBcnJheShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYXJyYXlzIGNhbiBsZWFybiBob3cgdG8gdHJhY2suJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgIE9iamVjdC5wcm90b3R5cGUsXHJcbiAgICAnQXNUcmFja2FibGUnLFxyXG4gICAge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmFja2FibGVPYmplY3QodGhpcyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxyXG4gICAgfVxyXG4gICk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgIEFycmF5LnByb3RvdHlwZSxcclxuICAgICdBc1RyYWNrYWJsZScsXHJcbiAgICB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFRyYWNrYWJsZUFycmF5KHRoaXMpO1xyXG4gICAgICB9LFxyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgIH1cclxuICApO1xyXG5cclxufSkod2luZG93KTtcclxuKi8iXX0=
