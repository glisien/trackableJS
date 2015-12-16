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
exports.createTrackableContainer = createTrackableContainer;
exports.evaluateState = evaluateState;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function getClass(o) {
  return ({}).toString.call(o);
}

function isObject(o) {
  return this.getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'object';
}

function isArray(o) {
  return this.getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'array';
}

function isTrackable(o) {
  return (this.isObject(o) || this.isArray(o)) && (o instanceof TrackableObject || o instanceof TrackableArray);
}

function isTrackableObject(o) {
  return (this.isObject(o) || this.isArray(o)) && o instanceof TrackableObject;
}

function isTrackableArray(o) {
  return (this.isObject(o) || this.isArray(o)) && o instanceof TrackableArray;
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

function createTrackableContainer(o) {
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

function evaluateState(o) {}

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

    Helpers.createTrackableContainer(this);
  }

  _createClass(TrackableArray, [{
    key: 'state',
    value: function state() {}
  }, {
    key: 'hasChanges',
    value: function hasChanges() {}
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
  function TrackableObject(o, isAddedDefinition) {
    _classCallCheck(this, TrackableObject);

    if (Helpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!Helpers.isObject(o)) {
      throw new Error('Only an Object can learn how to track.');
    }

    Helpers.createTrackableContainer(this);

    Object.defineProperty(this._trackable.configuration, 'isAddedDefinition', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: { 'Version': null }
    });

    if (isAddedDefinition) {
      this._trackable.configuration.isAddedDefinition = isAddedDefinition;
    }

    this.newTrackingWorkspace();
  }

  _createClass(TrackableObject, [{
    key: 'state',
    value: function state() {
      var workspace = this._trackable.workspaces[0];

      switch (workspace.currentState) {
        case 'a':
          return 'added';
        case 'u':
          return 'updated';
        case 'd':
          return 'deleted';
        case 'n':
          return 'none';
        default:
          throw new Error('Trackable object has an unknown state.');
      }
    }
  }, {
    key: 'newTrackingWorkspace',
    value: function newTrackingWorkspace() {
      var workspace = {
        changes: [],
        state: {
          current: undefined,
          original: undefined
        }
      };

      this._trackable.workspaces.unshift(workspace);
    }
  }, {
    key: 'hasChanges',
    value: function hasChanges() {
      var workspace = this._trackable.workspaces[0];
      return workspace.changes.length > 0 || workspace.state.current !== workspace.state.original;
    }
  }, {
    key: 'hasChangesAcrossWorkspaces',
    value: function hasChangesAcrossWorkspaces() {
      var w = this._trackable.workspaces.length;
      while (w--) {
        var workspace = this._trackable.workspaces[w];
        if (workspace.changes.length > 0 || workspace.state.current !== workspace.state.original) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'undoChanges',
    value: function undoChanges() {}
  }, {
    key: 'undoChangesAcrossWorkspaces',
    value: function undoChangesAcrossWorkspaces() {}
  }, {
    key: 'asNonTrackable',
    value: function asNonTrackable() {}
  }]);

  return TrackableObject;
})();

},{"./helpers":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGhlbHBlcnMuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFx0cmFja2FibGUtYXJyYXkuanMiLCJzcmNcXHRyYWNrYWJsZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixRQUFRLEdBQVIsUUFBUTtRQUlSLFFBQVEsR0FBUixRQUFRO1FBSVIsT0FBTyxHQUFQLE9BQU87UUFJUCxXQUFXLEdBQVgsV0FBVztRQUlYLGlCQUFpQixHQUFqQixpQkFBaUI7UUFJakIsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQUloQixRQUFRLEdBQVIsUUFBUTtRQTRDUix3QkFBd0IsR0FBeEIsd0JBQXdCO1FBcUN4QixhQUFhLEdBQWIsYUFBYTs7OztBQXpHdEIsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQzFCLFNBQU8sQ0FBQyxHQUFFLENBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUM5Qjs7QUFFTSxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsU0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxRQUFRLENBQUM7Q0FDOUU7O0FBRU0sU0FBUyxPQUFPLENBQUMsQ0FBQyxFQUFFO0FBQ3pCLFNBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDO0NBQzdFOztBQUVNLFNBQVMsV0FBVyxDQUFDLENBQUMsRUFBRTtBQUM3QixTQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFB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Q0FBQyxDQUFDO0FBQUEsT0FDckU7S0FDRjs7OzJDQUVzQjtBQUNyQixVQUFJLFNBQVMsR0FBRztBQUNkLGVBQU8sRUFBRSxFQUFFO0FBQ1gsYUFBSyxFQUFFO0FBQ0wsaUJBQU8sRUFBRSxTQUFTO0FBQ2xCLGtCQUFRLEVBQUUsU0FBUztTQUNwQjtPQUNGLENBQUM7O0FBRUYsVUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQy9DOzs7aUNBRVk7QUFDWCxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxhQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztLQUM3Rjs7O2lEQUU0QjtBQUMzQixVQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7QUFDMUMsYUFBTyxDQUFDLEVBQUUsRUFBRTtBQUNWLFlBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFlBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ3hGLGlCQUFPLElBQUksQ0FBQztTQUNiO09BQ0Y7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O2tDQUVhLEVBQ2I7OztrREFFNkIsRUFDN0I7OztxQ0FFZ0IsRUFDaEI7OztTQTFFVSxlQUFlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzcyhvKSB7XHJcbiAgcmV0dXJuICh7fSkudG9TdHJpbmcuY2FsbChvKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcclxuICByZXR1cm4gdGhpcy5nZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnb2JqZWN0JztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkobykge1xyXG4gIHJldHVybiB0aGlzLmdldENsYXNzKG8pLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCkgPT09ICdhcnJheSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyYWNrYWJsZShvKSB7XHJcbiAgcmV0dXJuICh0aGlzLmlzT2JqZWN0KG8pIHx8IHRoaXMuaXNBcnJheShvKSkgJiYgKG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3QgfHwgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJhY2thYmxlT2JqZWN0KG8pIHtcclxuICByZXR1cm4gKHRoaXMuaXNPYmplY3QobykgfHwgdGhpcy5pc0FycmF5KG8pKSAmJiBvIGluc3RhbmNlb2YgVHJhY2thYmxlT2JqZWN0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFja2FibGVBcnJheShvKSB7XHJcbiAgcmV0dXJuICh0aGlzLmlzT2JqZWN0KG8pIHx8IHRoaXMuaXNBcnJheShvKSkgJiYgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXJlRXF1YWwobzEsIG8yKSB7XHJcbiAgbGV0IHByb3A7XHJcblxyXG4gIGlmIChvMSA9PT0gbzIpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCEobzEgaW5zdGFuY2VvZiBPYmplY3QpIHx8ICEobzIgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAobzEuY29uc3RydWN0b3IgIT09IG8yLmNvbnN0cnVjdG9yKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmb3IgKHByb3AgaW4gbzEpIHtcclxuICAgIGlmICghbzEuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvMi5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG8xW3Byb3BdID09PSBvMltwcm9wXSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIChvMVtwcm9wXSkgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuYXJlRXF1YWwobzFbcHJvcF0sIG8yW3Byb3BdKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3IgKHByb3AgaW4gbzIpIHtcclxuICAgIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiAhbzEuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYWNrYWJsZUNvbnRhaW5lcihvKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sICdfdHJhY2thYmxlJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2NvbmZpZ3VyYXRpb24nLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnZXh0ZW5zaW9ucycsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUsICdmaWVsZHMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnd29ya3NwYWNlcycsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IFtdXHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBldmFsdWF0ZVN0YXRlKG8pIHtcclxufVxyXG4iLCJpbXBvcnQge1RyYWNrYWJsZU9iamVjdH0gZnJvbSAnLi90cmFja2FibGUtb2JqZWN0J1xyXG5pbXBvcnQge1RyYWNrYWJsZUFycmF5fSBmcm9tICcuL3RyYWNrYWJsZS1hcnJheSdcclxuXHJcbndpbmRvdy5UcmFja2FibGVPYmplY3QgPSBUcmFja2FibGVPYmplY3Q7XHJcbndpbmRvdy5UcmFja2FibGVBcnJheSA9IFRyYWNrYWJsZUFycmF5O1xyXG4iLCJpbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFja2FibGVBcnJheSB7XHJcbiAgY29uc3RydWN0b3Iobykge1xyXG4gICAgaWYgKEhlbHBlcnMuaXNUcmFja2FibGUobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VycyBkbyBub3QgbGlrZSB0byBiZSB0cmFja2VkLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghSGVscGVycy5pc0FycmF5KG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBhbiBBcnJheSBjYW4gbGVhcm4gaG93IHRvIHRyYWNrLicpO1xyXG4gICAgfVxyXG5cclxuICAgIEhlbHBlcnMuY3JlYXRlVHJhY2thYmxlQ29udGFpbmVyKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGUoKSB7XHJcbiAgfVxyXG5cclxuICBoYXNDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgdW5kb0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICBhc05vblRyYWNrYWJsZSgpIHtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXHJcblxyXG5leHBvcnQgY2xhc3MgVHJhY2thYmxlT2JqZWN0IHtcclxuICBjb25zdHJ1Y3RvcihvLCBpc0FkZGVkRGVmaW5pdGlvbikge1xyXG4gICAgaWYgKEhlbHBlcnMuaXNUcmFja2FibGUobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VycyBkbyBub3QgbGlrZSB0byBiZSB0cmFja2VkLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghSGVscGVycy5pc09iamVjdChvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYW4gT2JqZWN0IGNhbiBsZWFybiBob3cgdG8gdHJhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgSGVscGVycy5jcmVhdGVUcmFja2FibGVDb250YWluZXIodGhpcyk7XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuX3RyYWNrYWJsZS5jb25maWd1cmF0aW9uLCAnaXNBZGRlZERlZmluaXRpb24nLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IHsgJ1ZlcnNpb24nOiBudWxsIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChpc0FkZGVkRGVmaW5pdGlvbikge1xyXG4gICAgICB0aGlzLl90cmFja2FibGUuY29uZmlndXJhdGlvbi5pc0FkZGVkRGVmaW5pdGlvbiA9IGlzQWRkZWREZWZpbml0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubmV3VHJhY2tpbmdXb3Jrc3BhY2UoKTtcclxuICB9XHJcblxyXG4gIHN0YXRlKCkge1xyXG4gICAgbGV0IHdvcmtzcGFjZSA9IHRoaXMuX3RyYWNrYWJsZS53b3Jrc3BhY2VzWzBdO1xyXG5cclxuICAgIHN3aXRjaCAod29ya3NwYWNlLmN1cnJlbnRTdGF0ZSkge1xyXG4gICAgICBjYXNlICdhJzogcmV0dXJuICdhZGRlZCc7XHJcbiAgICAgIGNhc2UgJ3UnOiByZXR1cm4gJ3VwZGF0ZWQnO1xyXG4gICAgICBjYXNlICdkJzogcmV0dXJuICdkZWxldGVkJztcclxuICAgICAgY2FzZSAnbic6IHJldHVybiAnbm9uZSc7XHJcbiAgICAgIGRlZmF1bHQ6ICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrYWJsZSBvYmplY3QgaGFzIGFuIHVua25vd24gc3RhdGUuJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZXdUcmFja2luZ1dvcmtzcGFjZSgpIHtcclxuICAgIGxldCB3b3Jrc3BhY2UgPSB7XHJcbiAgICAgIGNoYW5nZXM6IFtdLFxyXG4gICAgICBzdGF0ZToge1xyXG4gICAgICAgIGN1cnJlbnQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBvcmlnaW5hbDogdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXMudW5zaGlmdCh3b3Jrc3BhY2UpO1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlcygpIHtcclxuICAgIGxldCB3b3Jrc3BhY2UgPSB0aGlzLl90cmFja2FibGUud29ya3NwYWNlc1swXTtcclxuICAgIHJldHVybiB3b3Jrc3BhY2UuY2hhbmdlcy5sZW5ndGggPiAwIHx8IHdvcmtzcGFjZS5zdGF0ZS5jdXJyZW50ICE9PSB3b3Jrc3BhY2Uuc3RhdGUub3JpZ2luYWw7XHJcbiAgfVxyXG5cclxuICBoYXNDaGFuZ2VzQWNyb3NzV29ya3NwYWNlcygpIHtcclxuICAgIGxldCB3ID0gdGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXMubGVuZ3RoO1xyXG4gICAgd2hpbGUgKHctLSkge1xyXG4gICAgICBsZXQgd29ya3NwYWNlID0gdGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXNbd107XHJcbiAgICAgIGlmICh3b3Jrc3BhY2UuY2hhbmdlcy5sZW5ndGggPiAwIHx8IHdvcmtzcGFjZS5zdGF0ZS5jdXJyZW50ICE9PSB3b3Jrc3BhY2Uuc3RhdGUub3JpZ2luYWwpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHVuZG9DaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgdW5kb0NoYW5nZXNBY3Jvc3NXb3Jrc3BhY2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgfVxyXG59XHJcbiJdfQ==
