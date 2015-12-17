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
exports.createTrackableObjectField = createTrackableObjectField;
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
  var propertyName = undefined;

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

    if (_typeof(o1[propertyName]) !== 'object') {
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

function createTrackableObjectField(o, name, value) {
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
    get: function get() {
      return o._trackable.fields[name];
    },
    set: function set(value) {
      // if already deleted; do not allow more changes
      if (o._trackable.state.current === 'd') {
        throw Error('Once deleted always deleted');
      }

      // if trying to set the value to an existing value; do nothing

      o._trackable.fields[name] = value;
    }
  });
}

function evaluateTrackableObjectState(o) {
  // check if deleted
  if (o._trackable.state.current === 'd') {
    return;
  }

  // check if added
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

  // check if updated
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

    Helpers.createTrackableStructure(this);

    for (var propertyName in o) {
      if (o.hasOwnProperty(propertyName)) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(o, propertyName);
        if (propertyDescriptor.writable && propertyDescriptor.configurable) {
          Helpers.createTrackableObjectField(this, propertyName, propertyDescriptor.value);
        }
      }
    }

    this.newUnitOfWork();
  }

  _createClass(TrackableArray, [{
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
        if (propertyDescriptor.writable && propertyDescriptor.configurable) {
          Helpers.createTrackableObjectField(this, propertyName, propertyDescriptor.value);
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
    key: 'rejectChanges',
    value: function rejectChanges() {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGhlbHBlcnMuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFx0cmFja2FibGUtYXJyYXkuanMiLCJzcmNcXHRyYWNrYWJsZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixRQUFRLEdBQVIsUUFBUTtRQUlSLFFBQVEsR0FBUixRQUFRO1FBSVIsT0FBTyxHQUFQLE9BQU87UUFJUCxXQUFXLEdBQVgsV0FBVztRQUlYLGlCQUFpQixHQUFqQixpQkFBaUI7UUFJakIsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQUloQixRQUFRLEdBQVIsUUFBUTtRQTRDUixRQUFRLEdBQVIsUUFBUTtRQVdSLHdCQUF3QixHQUF4Qix3QkFBd0I7UUFtRXhCLDBCQUEwQixHQUExQiwwQkFBMEI7UUE4QzFCLDRCQUE0QixHQUE1Qiw0QkFBNEI7Ozs7QUFoTXJDLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUMxQixTQUFPLENBQUMsR0FBRSxDQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDOUI7O0FBRU0sU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQzFCLFNBQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxRQUFRLENBQUM7Q0FDekU7O0FBRU0sU0FBUyxPQUFPLENBQUMsQ0FBQyxFQUFFO0FBQ3pCLFNBQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPLENBQUM7Q0FDeEU7O0FBRU0sU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFO0FBQzdCLFNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENB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Q0Y7S0FDRjs7OzhDQUV5QixFQUN6Qjs7OzhDQUV5QixFQUN6Qjs7O29DQUVlLEVBQ2Y7OztxQ0FFZ0I7QUFDZixVQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRVgsV0FBSyxJQUFJLFlBQVksSUFBSSxJQUFJLEVBQUU7QUFDN0IsWUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ3JDLGNBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRTtBQUMzQyxhQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1dBQ3ZELE1BQU07QUFDTCxhQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1dBQ3JDO1NBQ0Y7T0FDRjs7QUFFRCxhQUFPLENBQUMsQ0FBQztLQUNWOzs7U0FsR1UsZUFBZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3Mobykge1xyXG4gIHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwobyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvKSB7XHJcbiAgcmV0dXJuIGdldENsYXNzKG8pLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCkgPT09ICdvYmplY3QnO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShvKSB7XHJcbiAgcmV0dXJuIGdldENsYXNzKG8pLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCkgPT09ICdhcnJheSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyYWNrYWJsZShvKSB7XHJcbiAgcmV0dXJuIChpc09iamVjdChvKSB8fCBpc0FycmF5KG8pKSAmJiAobyBpbnN0YW5jZW9mIFRyYWNrYWJsZU9iamVjdCB8fCBvIGluc3RhbmNlb2YgVHJhY2thYmxlQXJyYXkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFja2FibGVPYmplY3Qobykge1xyXG4gIHJldHVybiAoaXNPYmplY3QobykgfHwgaXNBcnJheShvKSkgJiYgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZU9iamVjdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJhY2thYmxlQXJyYXkobykge1xyXG4gIHJldHVybiAoaXNPYmplY3QobykgfHwgaXNBcnJheShvKSkgJiYgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXJlRXF1YWwobzEsIG8yKSB7XHJcbiAgbGV0IHByb3BlcnR5TmFtZTtcclxuXHJcbiAgaWYgKG8xID09PSBvMikge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBpZiAoIShvMSBpbnN0YW5jZW9mIE9iamVjdCkgfHwgIShvMiBpbnN0YW5jZW9mIE9iamVjdCkpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGlmIChvMS5jb25zdHJ1Y3RvciAhPT0gbzIuY29uc3RydWN0b3IpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZvciAocHJvcGVydHlOYW1lIGluIG8xKSB7XHJcbiAgICBpZiAoIW8xLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvMi5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobzFbcHJvcGVydHlOYW1lXSA9PT0gbzJbcHJvcGVydHlOYW1lXSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIChvMVtwcm9wZXJ0eU5hbWVdKSAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghYXJlRXF1YWwobzFbcHJvcGVydHlOYW1lXSwgbzJbcHJvcGVydHlOYW1lXSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9yIChwcm9wZXJ0eU5hbWUgaW4gbzIpIHtcclxuICAgIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpICYmICFvMS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdJZChsZW5ndGggPSAxMCkge1xyXG4gIGxldCBjaGFycyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OScsXHJcbiAgICAgIHJlc3VsdCA9ICcnO1xyXG5cclxuICBmb3IgKGxldCBpID0gbGVuZ3RoOyBpID4gMDsgLS1pKSB7XHJcbiAgICByZXN1bHQgKz0gY2hhcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcnMubGVuZ3RoKV07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhY2thYmxlU3RydWN0dXJlKG8pIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgJ190cmFja2FibGUnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnY29uZmlndXJhdGlvbicsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIGlmIChpc09iamVjdChvKSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5jb25maWd1cmF0aW9uLCAnYWRkU3RhdGVEZWZpbml0aW9uJywge1xyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgIHZhbHVlOiB7fVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnZXh0ZW5zaW9ucycsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUsICdmaWVsZHMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnc3RhdGUnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLnN0YXRlLCAnY3VycmVudCcsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IG51bGxcclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5zdGF0ZSwgJ29yaWdpbmFsJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZTogbnVsbFxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnd29ya3NwYWNlcycsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IFtdXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFja2FibGVPYmplY3RGaWVsZChvLCBuYW1lLCB2YWx1ZSkge1xyXG4gIC8vIGNyZWF0ZSBiYWNraW5nIGZpZWxkXHJcbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5maWVsZHMsIG5hbWUsIHtcclxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgdmFsdWU6IG5ldyBUcmFja2FibGVPYmplY3QodmFsdWUpXHJcbiAgICB9KTtcclxuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLmZpZWxkcywgbmFtZSwge1xyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB2YWx1ZTogbmV3IFRyYWNrYWJsZUFycmF5KHZhbHVlKVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuZmllbGRzLCBuYW1lLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBjcmVhdGUgZ2V0dGVyL3NldHRlciBmb3IgYmFja2luZyBmaWVsZFxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBuYW1lLCB7XHJcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV1cclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgIC8vIGlmIGFscmVhZHkgZGVsZXRlZDsgZG8gbm90IGFsbG93IG1vcmUgY2hhbmdlc1xyXG4gICAgICBpZiAoby5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdkJykge1xyXG4gICAgICAgIHRocm93IEVycm9yKCdPbmNlIGRlbGV0ZWQgYWx3YXlzIGRlbGV0ZWQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgdHJ5aW5nIHRvIHNldCB0aGUgdmFsdWUgdG8gYW4gZXhpc3RpbmcgdmFsdWU7IGRvIG5vdGhpbmdcclxuXHJcblxyXG4gICAgICBvLl90cmFja2FibGUuZmllbGRzW25hbWVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBldmFsdWF0ZVRyYWNrYWJsZU9iamVjdFN0YXRlKG8pIHtcclxuICAvLyBjaGVjayBpZiBkZWxldGVkXHJcbiAgaWYgKG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCcpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIGlmIGFkZGVkXHJcbiAgaWYgKE9iamVjdC5rZXlzKG8uX3RyYWNrYWJsZS5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbikubGVuZ3RoKSB7XHJcbiAgICBsZXQgaXNBZGRlZCA9IHRydWU7XHJcblxyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIG8uX3RyYWNrYWJsZS5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbikge1xyXG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgaWYgKG8uX3RyYWNrYWJsZS5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVdICE9PSBvW3Byb3BlcnR5TmFtZV0pIHtcclxuICAgICAgICAgIGlzQWRkZWQgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpc0FkZGVkID0gZmFsc2U7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNBZGRlZCkge1xyXG4gICAgICBvLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9ICdhJztcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgaWYgdXBkYXRlZFxyXG4gIGxldCBpc1VwZGF0ZWQgPSBmYWxzZTtcclxuXHJcbiAgbGV0IHcgPSBvLl90cmFja2FibGUud29ya3NwYWNlcy5sZW5ndGg7XHJcbiAgd2hpbGUgKHctLSkge1xyXG4gICAgaWYgKG8uX3RyYWNrYWJsZS53b3Jrc3BhY2VzW3ddLmNoYW5nZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBpc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChpc1VwZGF0ZWQpIHtcclxuICAgIG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID0gJ3UnO1xyXG4gICAgcmV0dXJuO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9ICdwJztcclxuICAgIHJldHVybjtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtUcmFja2FibGVPYmplY3R9IGZyb20gJy4vdHJhY2thYmxlLW9iamVjdCdcclxuaW1wb3J0IHtUcmFja2FibGVBcnJheX0gZnJvbSAnLi90cmFja2FibGUtYXJyYXknXHJcblxyXG53aW5kb3cuVHJhY2thYmxlT2JqZWN0ID0gVHJhY2thYmxlT2JqZWN0O1xyXG53aW5kb3cuVHJhY2thYmxlQXJyYXkgPSBUcmFja2FibGVBcnJheTtcclxuIiwiaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXHJcblxyXG5leHBvcnQgY2xhc3MgVHJhY2thYmxlQXJyYXkge1xyXG4gIGNvbnN0cnVjdG9yKG8pIHtcclxuICAgIGlmIChIZWxwZXJzLmlzVHJhY2thYmxlKG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJhY2tlcnMgZG8gbm90IGxpa2UgdG8gYmUgdHJhY2tlZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUhlbHBlcnMuaXNBcnJheShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYW4gQXJyYXkgY2FuIGxlYXJuIGhvdyB0byB0cmFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICBIZWxwZXJzLmNyZWF0ZVRyYWNrYWJsZVN0cnVjdHVyZSh0aGlzKTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gbykge1xyXG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgbGV0IHByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICBpZiAocHJvcGVydHlEZXNjcmlwdG9yLndyaXRhYmxlICYmIHByb3BlcnR5RGVzY3JpcHRvci5jb25maWd1cmFibGUpIHtcclxuICAgICAgICAgIEhlbHBlcnMuY3JlYXRlVHJhY2thYmxlT2JqZWN0RmllbGQodGhpcywgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eURlc2NyaXB0b3IudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubmV3VW5pdE9mV29yaygpO1xyXG4gIH1cclxuXHJcbiAgbmV3VW5pdE9mV29yaygpIHtcclxuICAgIGxldCB3b3Jrc3BhY2UgPSB7XHJcbiAgICAgIGNoYW5nZXM6IFtdLFxyXG4gICAgICBpZDogSGVscGVycy5zdHJpbmdJZCgpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuX3RyYWNrYWJsZS53b3Jrc3BhY2VzLnVuc2hpZnQod29ya3NwYWNlKTtcclxuICB9XHJcblxyXG4gIGhhc0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICBoYXNQZW5kaW5nQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIGFjY2VwdFVuaXRPZldvcmtDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgcmVqZWN0VW5pdE9mV29ya0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICB1bmRvQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIGFzTm9uVHJhY2thYmxlKCkge1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFja2FibGVPYmplY3Qge1xyXG4gIGNvbnN0cnVjdG9yKG8sIGFkZFN0YXRlRGVmaW5pdGlvbikge1xyXG4gICAgaWYgKEhlbHBlcnMuaXNUcmFja2FibGUobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VycyBkbyBub3QgbGlrZSB0byBiZSB0cmFja2VkLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghSGVscGVycy5pc09iamVjdChvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYW4gT2JqZWN0IGNhbiBsZWFybiBob3cgdG8gdHJhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgSGVscGVycy5jcmVhdGVUcmFja2FibGVTdHJ1Y3R1cmUodGhpcyk7XHJcblxyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIG8pIHtcclxuICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGxldCBwcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5RGVzY3JpcHRvci53cml0YWJsZSAmJiBwcm9wZXJ0eURlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XHJcbiAgICAgICAgICBIZWxwZXJzLmNyZWF0ZVRyYWNrYWJsZU9iamVjdEZpZWxkKHRoaXMsIHByb3BlcnR5TmFtZSwgcHJvcGVydHlEZXNjcmlwdG9yLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBIZWxwZXJzLmV2YWx1YXRlVHJhY2thYmxlT2JqZWN0U3RhdGUodGhpcyk7XHJcblxyXG4gICAgdGhpcy5fdHJhY2thYmxlLnN0YXRlLm9yaWdpbmFsID0gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQ7XHJcblxyXG4gICAgdGhpcy5uZXdVbml0T2ZXb3JrKCk7XHJcbiAgfVxyXG5cclxuICBzdGF0ZSgpIHtcclxuICAgIHN3aXRjaCAodGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQpIHtcclxuICAgICAgY2FzZSAncCc6IHJldHVybiAncHJpc3RpbmUnO1xyXG4gICAgICBjYXNlICdhJzogcmV0dXJuICdhZGRlZCc7XHJcbiAgICAgIGNhc2UgJ3UnOiByZXR1cm4gJ3VwZGF0ZWQnO1xyXG4gICAgICBjYXNlICdkJzogcmV0dXJuICdkZWxldGVkJztcclxuICAgICAgZGVmYXVsdDogIHRocm93IG5ldyBFcnJvcignVHJhY2thYmxlIE9iamVjdCBoYXMgYW4gdW5rbm93biBzdGF0ZS4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzUHJpc3RpbmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdwJztcclxuICB9XHJcblxyXG4gIGlzQWRkZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdhJztcclxuICB9XHJcblxyXG4gIGlzVXBkYXRlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9PT0gJ3UnO1xyXG4gIH1cclxuXHJcbiAgaXNEZWxldGVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCc7XHJcbiAgfVxyXG5cclxuICBuZXdVbml0T2ZXb3JrKCkge1xyXG4gICAgbGV0IHdvcmtzcGFjZSA9IHtcclxuICAgICAgY2hhbmdlczogW10sXHJcbiAgICAgIGlkOiBIZWxwZXJzLnN0cmluZ0lkKClcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXMudW5zaGlmdCh3b3Jrc3BhY2UpO1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlcygpIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFja2FibGUud29ya3NwYWNlc1swXS5jaGFuZ2VzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhc1BlbmRpbmdDaGFuZ2VzKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLl90cmFja2FibGUud29ya3NwYWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXNbaV0uY2hhbmdlcy5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWNjZXB0VW5pdE9mV29ya0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICByZWplY3RVbml0T2ZXb3JrQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIHJlamVjdENoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICBhc05vblRyYWNrYWJsZSgpIHtcclxuICAgIGxldCBvID0ge307XHJcblxyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIHRoaXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGlmIChIZWxwZXJzLmlzVHJhY2thYmxlKHRoaXNbcHJvcGVydHlOYW1lXSkpIHtcclxuICAgICAgICAgIG9bcHJvcGVydHlOYW1lXSA9IHRoaXNbcHJvcGVydHlOYW1lXS5hc05vblRyYWNrYWJsZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvW3Byb3BlcnR5TmFtZV0gPSB0aGlzW3Byb3BlcnR5TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbztcclxuICB9XHJcbn1cclxuIl19
