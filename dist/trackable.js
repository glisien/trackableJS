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

  Object.defineProperty(o._trackable, 'workspaces', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: []
  });

  Object.defineProperty(o._trackable, 'fields', {
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

  Object.defineProperty(o._trackable, 'configuration', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });
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
        currentState: undefined,
        originalState: undefined
      };

      this._trackable.workspaces.unshift(workspace);
    }
  }, {
    key: 'hasLocalChanges',
    value: function hasLocalChanges() {}
  }, {
    key: 'hasGlobalChanges',
    value: function hasGlobalChanges() {}
  }, {
    key: 'undoLocalChanges',
    value: function undoLocalChanges() {}
  }, {
    key: 'undoGlobalChanges',
    value: function undoGlobalChanges() {}
  }, {
    key: 'asNonTrackable',
    value: function asNonTrackable() {}
  }]);

  return TrackableObject;
})();

},{"./helpers":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGhlbHBlcnMuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFx0cmFja2FibGUtYXJyYXkuanMiLCJzcmNcXHRyYWNrYWJsZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixRQUFRLEdBQVIsUUFBUTtRQUlSLFFBQVEsR0FBUixRQUFRO1FBSVIsT0FBTyxHQUFQLE9BQU87UUFJUCxXQUFXLEdBQVgsV0FBVztRQUlYLGlCQUFpQixHQUFqQixpQkFBaUI7UUFJakIsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQUloQixRQUFRLEdBQVIsUUFBUTtRQTRDUix3QkFBd0IsR0FBeEIsd0JBQXdCOzs7O0FBcEVqQyxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsU0FBTyxDQUFDLEdBQUUsQ0FBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzlCOztBQUVNLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUMxQixTQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQztDQUM5RTs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxDQUFDLEVBQUU7QUFDekIsU0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPLENBQUM7Q0FDN0U7O0FBRU0sU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFO0FBQzdCLFNBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUEsS0FBTSxDQUFDLFlBQVksZUFBZSxJ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ZCxlQUFPLEVBQUUsRUFBRTtBQUNYLG9CQUFZLEVBQUUsU0FBUztBQUN2QixxQkFBYSxFQUFFLFNBQVM7T0FDekIsQ0FBQzs7QUFFRixVQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDL0M7OztzQ0FFaUIsRUFDakI7Ozt1Q0FFa0IsRUFDbEI7Ozt1Q0FFa0IsRUFDbEI7Ozt3Q0FFbUIsRUFDbkI7OztxQ0FFZ0IsRUFDaEI7OztTQTdEVSxlQUFlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzcyhvKSB7XHJcbiAgcmV0dXJuICh7fSkudG9TdHJpbmcuY2FsbChvKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcclxuICByZXR1cm4gdGhpcy5nZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnb2JqZWN0JztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkobykge1xyXG4gIHJldHVybiB0aGlzLmdldENsYXNzKG8pLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCkgPT09ICdhcnJheSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyYWNrYWJsZShvKSB7XHJcbiAgcmV0dXJuICh0aGlzLmlzT2JqZWN0KG8pIHx8IHRoaXMuaXNBcnJheShvKSkgJiYgKG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3QgfHwgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJhY2thYmxlT2JqZWN0KG8pIHtcclxuICByZXR1cm4gKHRoaXMuaXNPYmplY3QobykgfHwgdGhpcy5pc0FycmF5KG8pKSAmJiBvIGluc3RhbmNlb2YgVHJhY2thYmxlT2JqZWN0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFja2FibGVBcnJheShvKSB7XHJcbiAgcmV0dXJuICh0aGlzLmlzT2JqZWN0KG8pIHx8IHRoaXMuaXNBcnJheShvKSkgJiYgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXJlRXF1YWwobzEsIG8yKSB7XHJcbiAgbGV0IHByb3A7XHJcblxyXG4gIGlmIChvMSA9PT0gbzIpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCEobzEgaW5zdGFuY2VvZiBPYmplY3QpIHx8ICEobzIgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAobzEuY29uc3RydWN0b3IgIT09IG8yLmNvbnN0cnVjdG9yKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmb3IgKHByb3AgaW4gbzEpIHtcclxuICAgIGlmICghbzEuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvMi5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG8xW3Byb3BdID09PSBvMltwcm9wXSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIChvMVtwcm9wXSkgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuYXJlRXF1YWwobzFbcHJvcF0sIG8yW3Byb3BdKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3IgKHByb3AgaW4gbzIpIHtcclxuICAgIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiAhbzEuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYWNrYWJsZUNvbnRhaW5lcihvKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sICdfdHJhY2thYmxlJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ3dvcmtzcGFjZXMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBbXVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnZmllbGRzJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2V4dGVuc2lvbnMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnY29uZmlndXJhdGlvbicsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHtUcmFja2FibGVPYmplY3R9IGZyb20gJy4vdHJhY2thYmxlLW9iamVjdCdcclxuaW1wb3J0IHtUcmFja2FibGVBcnJheX0gZnJvbSAnLi90cmFja2FibGUtYXJyYXknXHJcblxyXG53aW5kb3cuVHJhY2thYmxlT2JqZWN0ID0gVHJhY2thYmxlT2JqZWN0O1xyXG53aW5kb3cuVHJhY2thYmxlQXJyYXkgPSBUcmFja2FibGVBcnJheTtcclxuIiwiaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXHJcblxyXG5leHBvcnQgY2xhc3MgVHJhY2thYmxlQXJyYXkge1xyXG4gIGNvbnN0cnVjdG9yKG8pIHtcclxuICAgIGlmIChIZWxwZXJzLmlzVHJhY2thYmxlKG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJhY2tlcnMgZG8gbm90IGxpa2UgdG8gYmUgdHJhY2tlZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUhlbHBlcnMuaXNBcnJheShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYW4gQXJyYXkgY2FuIGxlYXJuIGhvdyB0byB0cmFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICBIZWxwZXJzLmNyZWF0ZVRyYWNrYWJsZUNvbnRhaW5lcih0aGlzKTtcclxuICB9XHJcblxyXG4gIHN0YXRlKCkge1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIHVuZG9DaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYWNrYWJsZU9iamVjdCB7XHJcbiAgY29uc3RydWN0b3IobywgaXNBZGRlZERlZmluaXRpb24pIHtcclxuICAgIGlmIChIZWxwZXJzLmlzVHJhY2thYmxlKG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJhY2tlcnMgZG8gbm90IGxpa2UgdG8gYmUgdHJhY2tlZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUhlbHBlcnMuaXNPYmplY3QobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IGFuIE9iamVjdCBjYW4gbGVhcm4gaG93IHRvIHRyYWNrLicpO1xyXG4gICAgfVxyXG5cclxuICAgIEhlbHBlcnMuY3JlYXRlVHJhY2thYmxlQ29udGFpbmVyKHRoaXMpO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLl90cmFja2FibGUuY29uZmlndXJhdGlvbiwgJ2lzQWRkZWREZWZpbml0aW9uJywge1xyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgIHZhbHVlOiB7ICdWZXJzaW9uJzogbnVsbCB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoaXNBZGRlZERlZmluaXRpb24pIHtcclxuICAgICAgdGhpcy5fdHJhY2thYmxlLmNvbmZpZ3VyYXRpb24uaXNBZGRlZERlZmluaXRpb24gPSBpc0FkZGVkRGVmaW5pdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5ld1RyYWNraW5nV29ya3NwYWNlKCk7XHJcbiAgfVxyXG5cclxuICBzdGF0ZSgpIHtcclxuICAgIGxldCB3b3Jrc3BhY2UgPSB0aGlzLl90cmFja2FibGUud29ya3NwYWNlc1swXTtcclxuXHJcbiAgICBzd2l0Y2ggKHdvcmtzcGFjZS5jdXJyZW50U3RhdGUpIHtcclxuICAgICAgY2FzZSAnYSc6IHJldHVybiAnYWRkZWQnO1xyXG4gICAgICBjYXNlICd1JzogcmV0dXJuICd1cGRhdGVkJztcclxuICAgICAgY2FzZSAnZCc6IHJldHVybiAnZGVsZXRlZCc7XHJcbiAgICAgIGNhc2UgJ24nOiByZXR1cm4gJ25vbmUnO1xyXG4gICAgICBkZWZhdWx0OiAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2FibGUgb2JqZWN0IGhhcyBhbiB1bmtub3duIHN0YXRlLicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmV3VHJhY2tpbmdXb3Jrc3BhY2UoKSB7XHJcbiAgICBsZXQgd29ya3NwYWNlID0ge1xyXG4gICAgICBjaGFuZ2VzOiBbXSxcclxuICAgICAgY3VycmVudFN0YXRlOiB1bmRlZmluZWQsXHJcbiAgICAgIG9yaWdpbmFsU3RhdGU6IHVuZGVmaW5lZFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl90cmFja2FibGUud29ya3NwYWNlcy51bnNoaWZ0KHdvcmtzcGFjZSk7XHJcbiAgfVxyXG5cclxuICBoYXNMb2NhbENoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICBoYXNHbG9iYWxDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgdW5kb0xvY2FsQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIHVuZG9HbG9iYWxDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgfVxyXG59XHJcbiJdfQ==
