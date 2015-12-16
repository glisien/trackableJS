(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClass = getClass;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isTrackable = isTrackable;
exports.isTrackableObject = isTrackableObject;
exports.isTrackableArray = isTrackableArray;
exports.areEqual = areEqual;
exports.stringId = stringId;
exports.createTrackableStructure = createTrackableStructure;
exports.evaluateTrackableObjectState = evaluateTrackableObjectState;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function getClass(o) {
  return ({}).toString.call(o);
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

function areEqual(o1, o2) {
  var prop = undefined;

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

    if (_typeof(o1[prop]) !== 'object') {
      return false;
    }

    if (!areEqual(o1[prop], o2[prop])) {
      return false;
    }
  }

  for (prop in o2) {
    if (o2.hasOwnProperty(prop) && !o1.hasOwnProperty(prop)) {
      return false;
    }
  }
}

function stringId() {
  var length = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      result = '';

  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

function createTrackableStructure(o) {
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

function evaluateTrackableObjectState(o) {
  // check deleted
  if (o._trackable.state.current === 'd') {
    return;
  }

  // check added
  if (Object.keys(o._trackable.configuration.addStateDefinition).length) {
    var isAdded = true;

    for (var propertyName in o._trackable.configuration.addStateDefinition) {
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

  // check updated
  var isUpdated = false;

  var w = o._trackable.workspaces.length;
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

},{}],2:[function(require,module,exports){
'use strict';

var _trackableObject = require('./trackable-object');

var _trackableArray = require('./trackable-array');

window.TrackableObject = _trackableObject.TrackableObject;
window.TrackableArray = _trackableArray.TrackableArray;

},{"./trackable-array":3,"./trackable-object":4}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackableArray = undefined;

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrackableArray = exports.TrackableArray = (function () {
  function TrackableArray(o) {
    _classCallCheck(this, TrackableArray);

    if (Helpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!Helpers.isArray(o)) {
      throw new Error('Only an Array can learn how to track.');
    }
  }

  _createClass(TrackableArray, [{
    key: 'newUnitOfWork',
    value: function newUnitOfWork() {}
  }, {
    key: 'hasChanges',
    value: function hasChanges() {}
  }, {
    key: 'hasPendingChanges',
    value: function hasPendingChanges() {}
  }, {
    key: 'acceptUnitOfWorkChanges',
    value: function acceptUnitOfWorkChanges() {}
  }, {
    key: 'rejectUnitOfWorkChanges',
    value: function rejectUnitOfWorkChanges() {}
  }, {
    key: 'undoChanges',
    value: function undoChanges() {}
  }, {
    key: 'asNonTrackable',
    value: function asNonTrackable() {}
  }]);

  return TrackableArray;
})();

},{"./helpers":1}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackableObject = undefined;

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrackableObject = exports.TrackableObject = (function () {
  function TrackableObject(o, addStateDefinition) {
    _classCallCheck(this, TrackableObject);

    if (Helpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!Helpers.isObject(o)) {
      throw new Error('Only an Object can learn how to track.');
    }

    Helpers.createTrackableStructure(this);

    for (var propertyName in o) {
      if (o.hasOwnProperty(propertyName)) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(o, propertyName);
        if (propertyDescriptor && propertyDescriptor.writable && propertyDescriptor.configurable) {
          // TODO: Create Field
        }
      }
    }

    Helpers.evaluateTrackableObjectState(this);

    this._trackable.state.original = this._trackable.state.current;

    this.newUnitOfWork();
  }

  _createClass(TrackableObject, [{
    key: 'state',
    value: function state() {
      switch (this._trackable.state.current) {
        case 'p':
          return 'pristine';
        case 'a':
          return 'added';
        case 'u':
          return 'updated';
        case 'd':
          return 'deleted';
        default:
          throw new Error('Trackable Object has an unknown state.');
      }
    }
  }, {
    key: 'isPristine',
    value: function isPristine() {
      return this._trackable.state.current === 'p';
    }
  }, {
    key: 'isAdded',
    value: function isAdded() {
      return this._trackable.state.current === 'a';
    }
  }, {
    key: 'isUpdated',
    value: function isUpdated() {
      return this._trackable.state.current === 'u';
    }
  }, {
    key: 'isDeleted',
    value: function isDeleted() {
      return this._trackable.state.current === 'd';
    }
  }, {
    key: 'newUnitOfWork',
    value: function newUnitOfWork() {
      var workspace = {
        changes: [],
        id: Helpers.stringId()
      };

      this._trackable.workspaces.unshift(workspace);
    }
  }, {
    key: 'hasChanges',
    value: function hasChanges() {
      return this._trackable.workspaces[0].changes.length;
    }
  }, {
    key: 'hasPendingChanges',
    value: function hasPendingChanges() {
      for (var i = 1; i < this._trackable.workspaces.length; i++) {
        if (this._trackable.workspaces[i].changes.length) {
          return true;
        }
      }
    }
  }, {
    key: 'acceptUnitOfWorkChanges',
    value: function acceptUnitOfWorkChanges() {}
  }, {
    key: 'rejectUnitOfWorkChanges',
    value: function rejectUnitOfWorkChanges() {}
  }, {
    key: 'undoChanges',
    value: function undoChanges() {}
  }, {
    key: 'asNonTrackable',
    value: function asNonTrackable() {
      var o = {};

      for (var propertyName in this) {
        if (this.hasOwnProperty(propertyName)) {
          if (Helpers.isTrackable(this[propertyName])) {
            o[propertyName] = this[propertyName].asNonTrackable();
          } else {
            o[propertyName] = this[propertyName];
          }
        }
      }

      return o;
    }
  }]);

  return TrackableObject;
})();

},{"./helpers":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGhlbHBlcnMuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFx0cmFja2FibGUtYXJyYXkuanMiLCJzcmNcXHRyYWNrYWJsZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixRQUFRLEdBQVIsUUFBUTtRQUlSLFFBQVEsR0FBUixRQUFRO1FBSVIsT0FBTyxHQUFQLE9BQU87UUFJUCxXQUFXLEdBQVgsV0FBVztRQUlYLGlCQUFpQixHQUFqQixpQkFBaUI7UUFJakIsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQUloQixRQUFRLEdBQVIsUUFBUTtRQTRDUixRQUFRLEdBQVIsUUFBUTtRQVdSLHdCQUF3QixHQUF4Qix3QkFBd0I7UUFtRXhCLDRCQUE0QixHQUE1Qiw0QkFBNEI7Ozs7QUFsSnJDLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUMxQixTQUFPLENBQUMsR0FBRSxDQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDOUI7O0FBRU0sU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQzFCLFNBQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxRQUFRLENBQUM7Q0FDekU7O0FBRU0sU0FBUyxPQUFPLENBQUMsQ0FBQyxFQUFFO0FBQ3pCLFNBQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPLENBQUM7Q0FDeEU7O0FBRU0sU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFO0FBQzdCLFNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBLEtBQU0sQ0FBQyxZQUFZ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SSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNoRCxpQkFBTyxJQUFJLENBQUM7U0FDYjtPQUNGO0tBQ0Y7Ozs4Q0FFeUIsRUFDekI7Ozs4Q0FFeUIsRUFDekI7OztrQ0FFYSxFQUNiOzs7cUNBRWdCO0FBQ2YsVUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVYLFdBQUssSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFO0FBQzdCLFlBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNyQyxjQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUU7QUFDM0MsYUFBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztXQUN2RCxNQUFNO0FBQ0wsYUFBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtXQUNyQztTQUNGO09BQ0Y7O0FBRUQsYUFBTyxDQUFDLENBQUM7S0FDVjs7O1NBbEdVLGVBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzKG8pIHtcclxuICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKG8pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qobykge1xyXG4gIHJldHVybiBnZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnb2JqZWN0JztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkobykge1xyXG4gIHJldHVybiBnZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnYXJyYXknO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFja2FibGUobykge1xyXG4gIHJldHVybiAoaXNPYmplY3QobykgfHwgaXNBcnJheShvKSkgJiYgKG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3QgfHwgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJhY2thYmxlT2JqZWN0KG8pIHtcclxuICByZXR1cm4gKGlzT2JqZWN0KG8pIHx8IGlzQXJyYXkobykpICYmIG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyYWNrYWJsZUFycmF5KG8pIHtcclxuICByZXR1cm4gKGlzT2JqZWN0KG8pIHx8IGlzQXJyYXkobykpICYmIG8gaW5zdGFuY2VvZiBUcmFja2FibGVBcnJheTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUVxdWFsKG8xLCBvMikge1xyXG4gIGxldCBwcm9wO1xyXG5cclxuICBpZiAobzEgPT09IG8yKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGlmICghKG8xIGluc3RhbmNlb2YgT2JqZWN0KSB8fCAhKG8yIGluc3RhbmNlb2YgT2JqZWN0KSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaWYgKG8xLmNvbnN0cnVjdG9yICE9PSBvMi5jb25zdHJ1Y3Rvcikge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZm9yIChwcm9wIGluIG8xKSB7XHJcbiAgICBpZiAoIW8xLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghbzIuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvMVtwcm9wXSA9PT0gbzJbcHJvcF0pIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiAobzFbcHJvcF0pICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFhcmVFcXVhbChvMVtwcm9wXSwgbzJbcHJvcF0pKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvciAocHJvcCBpbiBvMikge1xyXG4gICAgaWYgKG8yLmhhc093blByb3BlcnR5KHByb3ApICYmICFvMS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nSWQobGVuZ3RoID0gMTApIHtcclxuICBsZXQgY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODknLFxyXG4gICAgICByZXN1bHQgPSAnJztcclxuXHJcbiAgZm9yIChsZXQgaSA9IGxlbmd0aDsgaSA+IDA7IC0taSkge1xyXG4gICAgcmVzdWx0ICs9IGNoYXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJzLmxlbmd0aCldO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYWNrYWJsZVN0cnVjdHVyZShvKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sICdfdHJhY2thYmxlJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2NvbmZpZ3VyYXRpb24nLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBpZiAoaXNPYmplY3QobykpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuY29uZmlndXJhdGlvbiwgJ2FkZFN0YXRlRGVmaW5pdGlvbicsIHtcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICB2YWx1ZToge31cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2V4dGVuc2lvbnMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnZmllbGRzJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ3N0YXRlJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5zdGF0ZSwgJ2N1cnJlbnQnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBudWxsXHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuc3RhdGUsICdvcmlnaW5hbCcsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IG51bGxcclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ3dvcmtzcGFjZXMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBbXVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXZhbHVhdGVUcmFja2FibGVPYmplY3RTdGF0ZShvKSB7XHJcbiAgLy8gY2hlY2sgZGVsZXRlZFxyXG4gIGlmIChvLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9PT0gJ2QnKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBhZGRlZFxyXG4gIGlmIChPYmplY3Qua2V5cyhvLl90cmFja2FibGUuY29uZmlndXJhdGlvbi5hZGRTdGF0ZURlZmluaXRpb24pLmxlbmd0aCkge1xyXG4gICAgbGV0IGlzQWRkZWQgPSB0cnVlO1xyXG5cclxuICAgIGZvciAobGV0IHByb3BlcnR5TmFtZSBpbiBvLl90cmFja2FibGUuY29uZmlndXJhdGlvbi5hZGRTdGF0ZURlZmluaXRpb24pIHtcclxuICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGlmIChvLl90cmFja2FibGUuY29uZmlndXJhdGlvbi5hZGRTdGF0ZURlZmluaXRpb25bcHJvcGVydHlOYW1lXSAhPT0gb1twcm9wZXJ0eU5hbWVdKSB7XHJcbiAgICAgICAgICBpc0FkZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXNBZGRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzQWRkZWQpIHtcclxuICAgICAgby5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPSAnYSc7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIHVwZGF0ZWRcclxuICBsZXQgaXNVcGRhdGVkID0gZmFsc2U7XHJcblxyXG4gIGxldCB3ID0gby5fdHJhY2thYmxlLndvcmtzcGFjZXMubGVuZ3RoO1xyXG4gIHdoaWxlICh3LS0pIHtcclxuICAgIGlmIChvLl90cmFja2FibGUud29ya3NwYWNlc1t3XS5jaGFuZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgaXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoaXNVcGRhdGVkKSB7XHJcbiAgICBvLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9ICd1JztcclxuICAgIHJldHVybjtcclxuICB9IGVsc2Uge1xyXG4gICAgby5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPSAncCc7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7VHJhY2thYmxlT2JqZWN0fSBmcm9tICcuL3RyYWNrYWJsZS1vYmplY3QnXHJcbmltcG9ydCB7VHJhY2thYmxlQXJyYXl9IGZyb20gJy4vdHJhY2thYmxlLWFycmF5J1xyXG5cclxud2luZG93LlRyYWNrYWJsZU9iamVjdCA9IFRyYWNrYWJsZU9iamVjdDtcclxud2luZG93LlRyYWNrYWJsZUFycmF5ID0gVHJhY2thYmxlQXJyYXk7XHJcbiIsImltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYWNrYWJsZUFycmF5IHtcclxuICBjb25zdHJ1Y3RvcihvKSB7XHJcbiAgICBpZiAoSGVscGVycy5pc1RyYWNrYWJsZShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXJzIGRvIG5vdCBsaWtlIHRvIGJlIHRyYWNrZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFIZWxwZXJzLmlzQXJyYXkobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IGFuIEFycmF5IGNhbiBsZWFybiBob3cgdG8gdHJhY2suJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZXdVbml0T2ZXb3JrKCkge1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIGhhc1BlbmRpbmdDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYWNjZXB0VW5pdE9mV29ya0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICByZWplY3RVbml0T2ZXb3JrQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIHVuZG9DaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYWNrYWJsZU9iamVjdCB7XHJcbiAgY29uc3RydWN0b3IobywgYWRkU3RhdGVEZWZpbml0aW9uKSB7XHJcbiAgICBpZiAoSGVscGVycy5pc1RyYWNrYWJsZShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXJzIGRvIG5vdCBsaWtlIHRvIGJlIHRyYWNrZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFIZWxwZXJzLmlzT2JqZWN0KG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBhbiBPYmplY3QgY2FuIGxlYXJuIGhvdyB0byB0cmFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICBIZWxwZXJzLmNyZWF0ZVRyYWNrYWJsZVN0cnVjdHVyZSh0aGlzKTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gbykge1xyXG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgbGV0IHByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICBpZiAocHJvcGVydHlEZXNjcmlwdG9yICYmIHByb3BlcnR5RGVzY3JpcHRvci53cml0YWJsZSAmJiBwcm9wZXJ0eURlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XHJcbiAgICAgICAgICAvLyBUT0RPOiBDcmVhdGUgRmllbGRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBIZWxwZXJzLmV2YWx1YXRlVHJhY2thYmxlT2JqZWN0U3RhdGUodGhpcyk7XHJcblxyXG4gICAgdGhpcy5fdHJhY2thYmxlLnN0YXRlLm9yaWdpbmFsID0gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQ7XHJcblxyXG4gICAgdGhpcy5uZXdVbml0T2ZXb3JrKCk7XHJcbiAgfVxyXG5cclxuICBzdGF0ZSgpIHtcclxuICAgIHN3aXRjaCAodGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQpIHtcclxuICAgICAgY2FzZSAncCc6IHJldHVybiAncHJpc3RpbmUnO1xyXG4gICAgICBjYXNlICdhJzogcmV0dXJuICdhZGRlZCc7XHJcbiAgICAgIGNhc2UgJ3UnOiByZXR1cm4gJ3VwZGF0ZWQnO1xyXG4gICAgICBjYXNlICdkJzogcmV0dXJuICdkZWxldGVkJztcclxuICAgICAgZGVmYXVsdDogIHRocm93IG5ldyBFcnJvcignVHJhY2thYmxlIE9iamVjdCBoYXMgYW4gdW5rbm93biBzdGF0ZS4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzUHJpc3RpbmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdwJztcclxuICB9XHJcblxyXG4gIGlzQWRkZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdhJztcclxuICB9XHJcblxyXG4gIGlzVXBkYXRlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9PT0gJ3UnO1xyXG4gIH1cclxuXHJcbiAgaXNEZWxldGVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCc7XHJcbiAgfVxyXG5cclxuICBuZXdVbml0T2ZXb3JrKCkge1xyXG4gICAgbGV0IHdvcmtzcGFjZSA9IHtcclxuICAgICAgY2hhbmdlczogW10sXHJcbiAgICAgIGlkOiBIZWxwZXJzLnN0cmluZ0lkKClcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXMudW5zaGlmdCh3b3Jrc3BhY2UpO1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlcygpIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFja2FibGUud29ya3NwYWNlc1swXS5jaGFuZ2VzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhc1BlbmRpbmdDaGFuZ2VzKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLl90cmFja2FibGUud29ya3NwYWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXNbaV0uY2hhbmdlcy5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWNjZXB0VW5pdE9mV29ya0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICByZWplY3RVbml0T2ZXb3JrQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIHVuZG9DaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgICBsZXQgbyA9IHt9O1xyXG5cclxuICAgIGZvciAobGV0IHByb3BlcnR5TmFtZSBpbiB0aGlzKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICBpZiAoSGVscGVycy5pc1RyYWNrYWJsZSh0aGlzW3Byb3BlcnR5TmFtZV0pKSB7XHJcbiAgICAgICAgICBvW3Byb3BlcnR5TmFtZV0gPSB0aGlzW3Byb3BlcnR5TmFtZV0uYXNOb25UcmFja2FibGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb1twcm9wZXJ0eU5hbWVdID0gdGhpc1twcm9wZXJ0eU5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG87XHJcbiAgfVxyXG59XHJcbiJdfQ==
