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
exports.find = find;
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

function find(a, o) {
  var i = a.length;

  while (i--) {
    var found = true;

    for (var propertyName in o) {
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
            var change = find(o._trackable.workspace[0].changes, { property: name });

            if (change) {
              // TODO: previous change found
            } else {
                // TODO: add new change
              }

            var current = o._trackable.fields[name].asNonTrackable();

            o._trackable.workspaces[0].changes.push({
              property: name
            });

            return;
          }

          o._trackable.fields[name]._trackable.state.current === 'd';
          return;
        }

        if (isTrackableArray(o._trackable.fields[name])) {}
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
  var isUpdated = false,
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
    key: 'acceptChanges',
    value: function acceptChanges() {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGhlbHBlcnMuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFx0cmFja2FibGUtYXJyYXkuanMiLCJzcmNcXHRyYWNrYWJsZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixRQUFRLEdBQVIsUUFBUTtRQUlSLFFBQVEsR0FBUixRQUFRO1FBSVIsT0FBTyxHQUFQLE9BQU87UUFJUCxXQUFXLEdBQVgsV0FBVztRQUlYLGlCQUFpQixHQUFqQixpQkFBaUI7UUFJakIsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQUloQixRQUFRLEdBQVIsUUFBUTtRQTRDUixJQUFJLEdBQUosSUFBSTtRQXlCSixRQUFRLEdBQVIsUUFBUTtRQVdSLHdCQUF3QixHQUF4Qix3QkFBd0I7UUFtRXhCLDBCQUEwQixHQUExQiwwQkFBMEI7UUFpRjFCLDRCQUE0QixHQUE1Qiw0QkFBNEI7Ozs7QUE1UHJDLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUMxQixTQUFPLENBQUMsR0FBRSxDQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDOUI7O0FBRU0sU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQzFCLFNBQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxRQUFRLENBQUM7Q0FDekU7O0FBRU0sU0FBUyxPQUFPLENBQUMsQ0FBQyxFQUFFO0FBQ3pCLFNBQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPLENBQUM7Q0FDeEU7O0FBRU0sU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFO0FBQzdCLFNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBLEtBQU0sQ0FBQyxZQUFZLGVBQWUsSUFBSSxDQUFDLFlBQVksY0FBYyxDQUFBLEFBQUMsQ0FBQztDQUNyRzs7QUFFTSxTQUFTLGlCQUFpQixDQUFDLENBQUMsRUFBRTtBQUNuQyxTQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQSxJQUFLLENBQUMsWUFBWSxlQUFlLENBQUM7Q0FDcEU7O0FBRU0sU0FBUyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7QUFDbEMsU0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUEsSUFBSyxDQUFDLFlBQVksY0FBYyxDQUFDO0NBQ25FOztBQUVNLFNBQVMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDL0IsTUFBSSxZQUFZLFlBQUEsQ0FBQzs7QUFFakIsTUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ2IsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxNQUFJLEVBQUUsRUFBRSxZQUFZLE1BQU0sQ0FBQSxBQUFDLElBQUksRUFBRSxFQUFFLFlBQVksTUFBTSxDQUFBLEFBQUMsRUFBRTtBQUN0RCxXQUFPLEtBQUssQ0FBQztHQUNkOztBQUVELE1BQUksRUFBRSxDQUFDLFdBQVcsS0FBSyxFQUFFLENBQUMsV0FBVyxFQUFFO0FBQ3JDLFdBQU8sS0FBSyxDQUFDO0dBQ2Q7O0FBRUQsT0FBSyxZQUFZLElBQUksRUFBRSxFQUFFO0FBQ3ZCLFFBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ3BDLGVBQVM7S0FDVjs7QUFFRCxRQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNwQyxhQUFPLEtBQUssQ0FBQztLQUNkOztBQUVELFFBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUN6QyxlQUFTO0tBQ1Y7O0FBRUQsUUFBSSxRQUFRLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxRQUFRLEVBQUU7QUFDMUMsYUFBTyxLQUFLLENBQUM7S0FDZDs7QUFFRCxRQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRTtBQUNqRCxhQUFPLEtBQUssQ0FBQztLQUNkO0dBQ0Y7O0FBRUQsT0FBSyxZQUFZLElBQUksRUFBRSxFQUFFO0FBQ3ZCLFFBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDdkUsYUFBTyxLQUFLLENBQUM7S0FDZDtHQUNGO0NBQ0Y7O0FBRU0sU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN6QixNQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztBQUVqQixTQUFPLENBQUMsRUFBRSxFQUFFO0FBQ1YsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixTQUFLLElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTtBQUMxQixVQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDckMsWUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQzFDLG1CQUFTO1NBQ1Y7T0FDRjs7QUFFRCxXQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2QsWUFBTTtLQUNQOztBQUVELFFBQUksS0FBSyxFQUFFO0FBQ1QsYUFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDYjtHQUNGOztBQUVELFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRU0sU0FBUyxRQUFRLEdBQWM7TUFBYixNQUFNLHlEQUFHLEVBQUU7O0FBQ2xDLE1BQUksS0FBSyxHQUFHLGdFQUFnRTtNQUN4RSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVoQixPQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQy9CLFVBQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7R0FDM0Q7O0FBRUQsU0FBTyxNQUFNLENBQUM7Q0FDZjs7QUFFTSxTQUFTLHdCQUF3QixDQUFDLENBQUMsRUFBRTtBQUMxQyxRQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxZQUFZLEVBQUU7QUFDckMsY0FBVSxFQUFFLEtBQUs7QUFDakIsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEtBQUs7QUFDbkIsU0FBSyxFQUFFLEVBQUU7R0FDVixDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRTtBQUNuRCxjQUFVLEVBQUUsS0FBSztBQUNqQixZQUFRLEVBQUUsSUFBSTtBQUNkLGdCQUFZLEVBQUUsS0FBSztBQUNuQixTQUFLLEVBQUUsRUFBRTtHQUNWLENBQUMsQ0FBQzs7QUFFSCxNQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNmLFVBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLEVBQUU7QUFDdEUsZ0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGNBQVEsRUFBRSxJQUFJO0FBQ2Qsa0JBQVksRUFBRSxLQUFLO0FBQ25CLFdBQUssRUFBRSxFQUFFO0tBQ1YsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQsUUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRTtBQUNoRCxjQUFVLEVBQUUsS0FBSztBQUNqQixZQUFRLEVBQUUsSUFBSTtBQUNkLGdCQUFZLEVBQUUsS0FBSztBQUNuQixTQUFLLEVBQUUsRUFBRTtHQUNWLENBQUMsQ0FBQzs7QUFFSCxRQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzVDLGNBQVUsRUFBRSxLQUFLO0FBQ2pCLFlBQVEsRUFBRSxJQUFJO0FBQ2QsZ0JBQVksRUFBRSxLQUFLO0FBQ25CLFNBQUssRUFBRSxFQUFFO0dBQ1YsQ0FBQyxDQUFDOztBQUVILFFBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDM0MsY0FBVSxFQUFFLEtBQUs7QUFDakIsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEtBQUs7QUFDbkIsU0FBSyxFQUFFLEVBQUU7R0FDVixDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7QUFDbkQsY0FBVSxFQUFFLEtBQUs7QUFDakIsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEtBQUs7QUFDbkIsU0FBSyxFQUFFLElBQUk7R0FDWixDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7QUFDcEQsY0FBVSxFQUFFLEtBQUs7QUFDakIsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEtBQUs7QUFDbkIsU0FBSyxFQUFFLElBQUk7R0FDWixDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRTtBQUNoRCxjQUFVLEVBQUUsS0FBSztBQUNqQixZQUFRLEVBQUUsSUFBSTtBQUNkLGdCQUFZLEVBQUUsS0FBSztBQUNuQixTQUFLLEVBQUUsRUFBRTtHQUNWLENBQUMsQ0FBQztDQUNKOztBQUVNLFNBQVMsMEJBQTBCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7O0FBRXpELE1BQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ25CLFVBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQy9DLGdCQUFVLEVBQUUsSUFBSTtBQUNoQixjQUFRLEVBQUUsSUFBSTtBQUNkLGtCQUFZLEVBQUUsSUFBSTtBQUNsQixXQUFLLEVBQUUsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDO0tBQ2xDLENBQUMsQ0FBQztHQUNKLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDekIsVUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDL0MsZ0JBQVUsRUFBRSxJQUFJO0FBQ2hCLGNBQVEsRUFBRSxJQUFJO0FBQ2Qsa0JBQVksRUFBRSxJQUFJO0FBQ2xCLFdBQUssRUFBRSxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUM7S0FDakMsQ0FBQyxDQUFDO0dBQ0osTUFBTTtBQUNMLFVBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQy9DLGdCQUFVLEVBQUUsSUFBSTtBQUNoQixjQUFRLEVBQUUsSUFBSTtBQUNkLGtCQUFZLEVBQUUsSUFBSTtBQUNsQixXQUFLLEVBQUUsS0FBSztLQUNiLENBQUMsQ0FBQztHQUNKOzs7QUFBQSxBQUdELFFBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRTtBQUM3QixjQUFVLEVBQUUsSUFBSTtBQUNoQixnQkFBWSxFQUFFLElBQUk7QUFDbEIsT0FBRyxFQUFFLGVBQVc7QUFDZCxhQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2pDO0FBQ0QsT0FBRyxFQUFFLGFBQVMsS0FBSyxFQUFFOztBQUVuQixVQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxHQUFHLEVBQUU7QUFDdEMsY0FBTSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztPQUM3Qzs7OztBQUFBLEFBSUQsVUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDekMsWUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFOztBQUVoRCxjQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLEdBQUcsRUFBRTtBQUM5RCxtQkFBTztXQUNSOzs7QUFBQSxBQUdELGNBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssR0FBRyxFQUFFO0FBQzlELGdCQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7O0FBRXpFLGdCQUFJLE1BQU0sRUFBRTs7YUFFWCxNQUFNOztlQUVOOztBQUVELGdCQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFekQsYUFBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN0QyxzQkFBUSxFQUFFLElBQUk7YUFDZixDQUFDLENBQUE7O0FBRUYsbUJBQU87V0FDUjs7QUFFRCxXQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxHQUFHLENBQUM7QUFDM0QsaUJBQU87U0FDUjs7QUFFRCxZQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFDaEQ7T0FDRjs7OztBQUFBLEFBSUQsT0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ25DO0dBQ0YsQ0FBQyxDQUFDO0NBQ0o7O0FBRU0sU0FBUyw0QkFBNEIsQ0FBQyxDQUFDLEVBQUU7O0FBRTlDLE1BQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLEdBQUcsRUFBRTtBQUN0QyxXQUFPO0dBQ1I7OztBQUFBLEFBR0QsTUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3JFLFFBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsU0FBSyxJQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRTtBQUN0RSxVQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDbEMsWUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDbkYsaUJBQU8sR0FBRyxLQUFLLENBQUM7QUFDaEIsZ0JBQU07U0FDUDtPQUNGLE1BQU07QUFDTCxlQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLGNBQU07T0FDUDtLQUNGOztBQUVELFFBQUksT0FBTyxFQUFFO0FBQ1gsT0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNqQyxhQUFPO0tBQ1I7R0FDRjs7O0FBQUEsQUFHRCxNQUFJLFNBQVMsR0FBRyxLQUFLO01BQ2pCLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFNBQU8sQ0FBQyxFQUFFLEVBQUU7QUFDVixRQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2pELGVBQVMsR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBTTtLQUNQO0dBQ0Y7O0FBRUQsTUFBSSxTQUFTLEVBQUU7QUFDYixLQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ2pDLFdBQU87R0FDUixNQUFNO0FBQ0wsS0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNqQyxXQUFPO0dBQ1I7Q0FDRjs7Ozs7Ozs7O0FDdlNELE1BQU0sQ0FBQyxlQUFlLG9CQUhkLGVBQWUsQUFHaUIsQ0FBQztBQUN6QyxNQUFNLENBQUMsY0FBYyxtQkFIYixjQUFjLEFBR2dCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lDSjNCLE9BQU87Ozs7OztJQUVOLGNBQWMsV0FBZCxjQUFjO0FBQ3pCLFdBRFcsY0FBYyxDQUNiLENBQUMsRUFBRTswQkFESixjQUFjOztBQUV2QixRQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsWUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQ3hEOztBQUVELFFBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3ZCLFlBQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztLQUMxRDs7QUFFRCxXQUFPLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZDLFNBQUssSUFBSSxZQUFZLElBQUksQ0FBQyxFQUFFO0FBQzFCLFVBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNsQyxZQUFJLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDMUUsWUFBSSxrQkFBa0IsQ0FBQyxRQUFRLElBQUksa0JBQWtCLENBQUMsWUFBWSxFQUFFO0FBQ2xFLGlCQUFPLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNsRjtPQUNGO0tBQ0Y7O0FBRUQsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0dBQ3RCOztlQXRCVSxjQUFjOztvQ0F3QlQ7QUFDZCxVQUFJLFNBQVMsR0FBRztBQUNkLGVBQU8sRUFBRSxFQUFFO0FBQ1gsVUFBRSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7T0FDdkIsQ0FBQzs7QUFFRixVQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDL0M7OztpQ0FFWSxFQUNaOzs7d0NBRW1CLEVBQ25COzs7OENBRXlCLEVBQ3pCOzs7OENBRXlCLEVBQ3pCOzs7a0NBRWEsRUFDYjs7O3FDQUVnQixFQUNoQjs7O1NBakRVLGNBQWM7Ozs7Ozs7Ozs7Ozs7OztJQ0ZmLE9BQU87Ozs7OztJQUVOLGVBQWUsV0FBZixlQUFlO0FBQzFCLFdBRFcsZUFBZSxDQUNkLENBQUMsRUFBRSxrQkFBa0IsRUFBRTswQkFEeEIsZUFBZTs7QUFFeEIsUUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzFCLFlBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUN4RDs7QUFFRCxRQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN4QixZQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7S0FDM0Q7O0FBRUQsV0FBTyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV2QyxTQUFLLElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTtBQUMxQixVQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDbEMsWUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUUxRSxZQUFJLGtCQUFrQixDQUFDLFFBQVEsSUFBSSxrQkFBa0IsQ0FBQyxZQUFZLEVBQUU7QUFDbEUsaUJBQU8sQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xGO09BQ0Y7S0FDRjs7QUFFRCxXQUFPLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNDLFFBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7O0FBRS9ELFFBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztHQUN0Qjs7ZUEzQlUsZUFBZTs7NEJBNkJsQjtBQUNOLGNBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTztBQUNuQyxhQUFLLEdBQUc7QUFBRSxpQkFBTyxVQUFVLENBQUM7QUFBQSxBQUM1QixhQUFLLEdBQUc7QUFBRSxpQkFBTyxPQUFPLENBQUM7QUFBQSxBQUN6QixhQUFLLEdBQUc7QUFBRSxpQkFBTyxTQUFTLENBQUM7QUFBQSxBQUMzQixhQUFLLEdBQUc7QUFBRSxpQkFBTyxTQUFTLENBQUM7QUFBQSxBQUMzQjtBQUFVLGdCQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7QUFBQSxPQUNyRTtLQUNGOzs7aUNBRVk7QUFDWCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxHQUFHLENBQUM7S0FDOUM7Ozs4QkFFUztBQUNSLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLEdBQUcsQ0FBQztLQUM5Qzs7O2dDQUVXO0FBQ1YsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssR0FBRyxDQUFDO0tBQzlDOzs7Z0NBRVc7QUFDVixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxHQUFHLENBQUM7S0FDOUM7OztvQ0FFZTtBQUNkLFVBQUksU0FBUyxHQUFHO0FBQ2QsZUFBTyxFQUFFLEVBQUU7QUFDWCxVQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRTtPQUN2QixDQUFDOztBQUVGLFVBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMvQzs7O2lDQUVZO0FBQ1gsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0tBQ3JEOzs7d0NBRW1CO0FBQ2xCLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUQsWUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ2hELGlCQUFPLElBQUksQ0FBQztTQUNiO09BQ0Y7S0FDRjs7OzhDQUV5QixFQUN6Qjs7OzhDQUV5QixFQUN6Qjs7O29DQUVlLEVBQ2Y7OztvQ0FFZSxFQUNmOzs7cUNBRWdCO0FBQ2YsVUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVYLFdBQUssSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFO0FBQzdCLFlBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNyQyxjQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUU7QUFDM0MsYUFBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztXQUN2RCxNQUFNO0FBQ0wsYUFBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtXQUNyQztTQUNGO09BQ0Y7O0FBRUQsYUFBTyxDQUFDLENBQUM7S0FDVjs7O1NBdEdVLGVBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzKG8pIHtcclxuICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKG8pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qobykge1xyXG4gIHJldHVybiBnZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnb2JqZWN0JztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkobykge1xyXG4gIHJldHVybiBnZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnYXJyYXknO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFja2FibGUobykge1xyXG4gIHJldHVybiAoaXNPYmplY3QobykgfHwgaXNBcnJheShvKSkgJiYgKG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3QgfHwgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJhY2thYmxlT2JqZWN0KG8pIHtcclxuICByZXR1cm4gKGlzT2JqZWN0KG8pIHx8IGlzQXJyYXkobykpICYmIG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyYWNrYWJsZUFycmF5KG8pIHtcclxuICByZXR1cm4gKGlzT2JqZWN0KG8pIHx8IGlzQXJyYXkobykpICYmIG8gaW5zdGFuY2VvZiBUcmFja2FibGVBcnJheTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUVxdWFsKG8xLCBvMikge1xyXG4gIGxldCBwcm9wZXJ0eU5hbWU7XHJcblxyXG4gIGlmIChvMSA9PT0gbzIpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCEobzEgaW5zdGFuY2VvZiBPYmplY3QpIHx8ICEobzIgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAobzEuY29uc3RydWN0b3IgIT09IG8yLmNvbnN0cnVjdG9yKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmb3IgKHByb3BlcnR5TmFtZSBpbiBvMSkge1xyXG4gICAgaWYgKCFvMS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghbzIuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG8xW3Byb3BlcnR5TmFtZV0gPT09IG8yW3Byb3BlcnR5TmFtZV0pIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiAobzFbcHJvcGVydHlOYW1lXSkgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWFyZUVxdWFsKG8xW3Byb3BlcnR5TmFtZV0sIG8yW3Byb3BlcnR5TmFtZV0pKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvciAocHJvcGVydHlOYW1lIGluIG8yKSB7XHJcbiAgICBpZiAobzIuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSAmJiAhbzEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZChhLCBvKSB7XHJcbiAgbGV0IGkgPSBhLmxlbmd0aDtcclxuXHJcbiAgd2hpbGUgKGktLSkge1xyXG4gICAgbGV0IGZvdW5kID0gdHJ1ZTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gbykge1xyXG4gICAgICBpZiAoYVtpXS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgaWYgKGFbaV1bcHJvcGVydHlOYW1lXSA9PT0gb1twcm9wZXJ0eU5hbWVdKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICByZXR1cm4gYVtpXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nSWQobGVuZ3RoID0gMTApIHtcclxuICBsZXQgY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODknLFxyXG4gICAgICByZXN1bHQgPSAnJztcclxuXHJcbiAgZm9yIChsZXQgaSA9IGxlbmd0aDsgaSA+IDA7IC0taSkge1xyXG4gICAgcmVzdWx0ICs9IGNoYXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJzLmxlbmd0aCldO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYWNrYWJsZVN0cnVjdHVyZShvKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sICdfdHJhY2thYmxlJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2NvbmZpZ3VyYXRpb24nLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBpZiAoaXNPYmplY3QobykpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuY29uZmlndXJhdGlvbiwgJ2FkZFN0YXRlRGVmaW5pdGlvbicsIHtcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICB2YWx1ZToge31cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2V4dGVuc2lvbnMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnZmllbGRzJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ3N0YXRlJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5zdGF0ZSwgJ2N1cnJlbnQnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBudWxsXHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuc3RhdGUsICdvcmlnaW5hbCcsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IG51bGxcclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ3dvcmtzcGFjZXMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBbXVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhY2thYmxlT2JqZWN0RmllbGQobywgbmFtZSwgdmFsdWUpIHtcclxuICAvLyBjcmVhdGUgYmFja2luZyBmaWVsZFxyXG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuZmllbGRzLCBuYW1lLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHZhbHVlOiBuZXcgVHJhY2thYmxlT2JqZWN0KHZhbHVlKVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5maWVsZHMsIG5hbWUsIHtcclxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgdmFsdWU6IG5ldyBUcmFja2FibGVBcnJheSh2YWx1ZSlcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLmZpZWxkcywgbmFtZSwge1xyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB2YWx1ZTogdmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gY3JlYXRlIGdldHRlci9zZXR0ZXIgZm9yIGJhY2tpbmcgZmllbGRcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgbmFtZSwge1xyXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBvLl90cmFja2FibGUuZmllbGRzW25hbWVdXHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAvLyBpZiBhbHJlYWR5IGRlbGV0ZWQ7IGRvIG5vdCBhbGxvdyBtb3JlIGNoYW5nZXNcclxuICAgICAgaWYgKG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCcpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcignT25jZSBkZWxldGVkIGFsd2F5cyBkZWxldGVkLicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBpZiB0cnlpbmcgdG8gbnVsbGlmeSBhIFRyYWNrYWJsZU9iamVjdCBvciBUcmFja2FibGVBcnJheVxyXG4gICAgICAvLyB0cmVhdCB0aGF0IGFzIGEgZGVsZXRlIGFuZCBoYW5kbGUgYXMgYSBzcGVjaWFsIGNhc2VcclxuICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoaXNUcmFja2FibGVPYmplY3Qoby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIC8vIGlmIFRyYWNrYWJsZU9iamVjdCBpcyBhbHJlYWR5IGluIGEgJ2RlbGV0ZWQnIHN0YXRlOyBkbyBub3RoaW5nXHJcbiAgICAgICAgICBpZiAoby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXS5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdkJykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gaWYgVHJhY2thYmxlT2JqZWN0IGlzIGFscmVhZHkgaW4gYW4gJ2FkZGVkJyBzdGF0ZVxyXG4gICAgICAgICAgaWYgKG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnYScpIHtcclxuICAgICAgICAgICAgbGV0IGNoYW5nZSA9IGZpbmQoby5fdHJhY2thYmxlLndvcmtzcGFjZVswXS5jaGFuZ2VzLCB7IHByb3BlcnR5OiBuYW1lIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoYW5nZSkge1xyXG4gICAgICAgICAgICAgIC8vIFRPRE86IHByZXZpb3VzIGNoYW5nZSBmb3VuZFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIFRPRE86IGFkZCBuZXcgY2hhbmdlXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXS5hc05vblRyYWNrYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgby5fdHJhY2thYmxlLndvcmtzcGFjZXNbMF0uY2hhbmdlcy5wdXNoKHtcclxuICAgICAgICAgICAgICBwcm9wZXJ0eTogbmFtZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCc7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNUcmFja2FibGVBcnJheShvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgdHJ5aW5nIHRvIHNldCB0aGUgdmFsdWUgdG8gYW4gZXhpc3RpbmcgdmFsdWU7IGRvIG5vdGhpbmdcclxuXHJcbiAgICAgIG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV2YWx1YXRlVHJhY2thYmxlT2JqZWN0U3RhdGUobykge1xyXG4gIC8vIGNoZWNrIGlmIGRlbGV0ZWRcclxuICBpZiAoby5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdkJykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgaWYgYWRkZWRcclxuICBpZiAoT2JqZWN0LmtleXMoby5fdHJhY2thYmxlLmNvbmZpZ3VyYXRpb24uYWRkU3RhdGVEZWZpbml0aW9uKS5sZW5ndGgpIHtcclxuICAgIGxldCBpc0FkZGVkID0gdHJ1ZTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gby5fdHJhY2thYmxlLmNvbmZpZ3VyYXRpb24uYWRkU3RhdGVEZWZpbml0aW9uKSB7XHJcbiAgICAgIGlmIChvLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICBpZiAoby5fdHJhY2thYmxlLmNvbmZpZ3VyYXRpb24uYWRkU3RhdGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZV0gIT09IG9bcHJvcGVydHlOYW1lXSkge1xyXG4gICAgICAgICAgaXNBZGRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlzQWRkZWQgPSBmYWxzZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0FkZGVkKSB7XHJcbiAgICAgIG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID0gJ2EnO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBpZiB1cGRhdGVkXHJcbiAgbGV0IGlzVXBkYXRlZCA9IGZhbHNlLFxyXG4gICAgICB3ID0gby5fdHJhY2thYmxlLndvcmtzcGFjZXMubGVuZ3RoO1xyXG5cclxuICB3aGlsZSAody0tKSB7XHJcbiAgICBpZiAoby5fdHJhY2thYmxlLndvcmtzcGFjZXNbd10uY2hhbmdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGlzVXBkYXRlZCA9IHRydWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGlzVXBkYXRlZCkge1xyXG4gICAgby5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPSAndSc7XHJcbiAgICByZXR1cm47XHJcbiAgfSBlbHNlIHtcclxuICAgIG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID0gJ3AnO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1RyYWNrYWJsZU9iamVjdH0gZnJvbSAnLi90cmFja2FibGUtb2JqZWN0J1xyXG5pbXBvcnQge1RyYWNrYWJsZUFycmF5fSBmcm9tICcuL3RyYWNrYWJsZS1hcnJheSdcclxuXHJcbndpbmRvdy5UcmFja2FibGVPYmplY3QgPSBUcmFja2FibGVPYmplY3Q7XHJcbndpbmRvdy5UcmFja2FibGVBcnJheSA9IFRyYWNrYWJsZUFycmF5O1xyXG4iLCJpbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFja2FibGVBcnJheSB7XHJcbiAgY29uc3RydWN0b3Iobykge1xyXG4gICAgaWYgKEhlbHBlcnMuaXNUcmFja2FibGUobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VycyBkbyBub3QgbGlrZSB0byBiZSB0cmFja2VkLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghSGVscGVycy5pc0FycmF5KG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBhbiBBcnJheSBjYW4gbGVhcm4gaG93IHRvIHRyYWNrLicpO1xyXG4gICAgfVxyXG5cclxuICAgIEhlbHBlcnMuY3JlYXRlVHJhY2thYmxlU3RydWN0dXJlKHRoaXMpO1xyXG5cclxuICAgIGZvciAobGV0IHByb3BlcnR5TmFtZSBpbiBvKSB7XHJcbiAgICAgIGlmIChvLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICBsZXQgcHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eURlc2NyaXB0b3Iud3JpdGFibGUgJiYgcHJvcGVydHlEZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkge1xyXG4gICAgICAgICAgSGVscGVycy5jcmVhdGVUcmFja2FibGVPYmplY3RGaWVsZCh0aGlzLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5RGVzY3JpcHRvci52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5uZXdVbml0T2ZXb3JrKCk7XHJcbiAgfVxyXG5cclxuICBuZXdVbml0T2ZXb3JrKCkge1xyXG4gICAgbGV0IHdvcmtzcGFjZSA9IHtcclxuICAgICAgY2hhbmdlczogW10sXHJcbiAgICAgIGlkOiBIZWxwZXJzLnN0cmluZ0lkKClcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXMudW5zaGlmdCh3b3Jrc3BhY2UpO1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIGhhc1BlbmRpbmdDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYWNjZXB0VW5pdE9mV29ya0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICByZWplY3RVbml0T2ZXb3JrQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIHVuZG9DaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYWNrYWJsZU9iamVjdCB7XHJcbiAgY29uc3RydWN0b3IobywgYWRkU3RhdGVEZWZpbml0aW9uKSB7XHJcbiAgICBpZiAoSGVscGVycy5pc1RyYWNrYWJsZShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXJzIGRvIG5vdCBsaWtlIHRvIGJlIHRyYWNrZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFIZWxwZXJzLmlzT2JqZWN0KG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBhbiBPYmplY3QgY2FuIGxlYXJuIGhvdyB0byB0cmFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICBIZWxwZXJzLmNyZWF0ZVRyYWNrYWJsZVN0cnVjdHVyZSh0aGlzKTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gbykge1xyXG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgbGV0IHByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcGVydHlOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHByb3BlcnR5RGVzY3JpcHRvci53cml0YWJsZSAmJiBwcm9wZXJ0eURlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XHJcbiAgICAgICAgICBIZWxwZXJzLmNyZWF0ZVRyYWNrYWJsZU9iamVjdEZpZWxkKHRoaXMsIHByb3BlcnR5TmFtZSwgcHJvcGVydHlEZXNjcmlwdG9yLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBIZWxwZXJzLmV2YWx1YXRlVHJhY2thYmxlT2JqZWN0U3RhdGUodGhpcyk7XHJcblxyXG4gICAgdGhpcy5fdHJhY2thYmxlLnN0YXRlLm9yaWdpbmFsID0gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQ7XHJcblxyXG4gICAgdGhpcy5uZXdVbml0T2ZXb3JrKCk7XHJcbiAgfVxyXG5cclxuICBzdGF0ZSgpIHtcclxuICAgIHN3aXRjaCAodGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQpIHtcclxuICAgICAgY2FzZSAncCc6IHJldHVybiAncHJpc3RpbmUnO1xyXG4gICAgICBjYXNlICdhJzogcmV0dXJuICdhZGRlZCc7XHJcbiAgICAgIGNhc2UgJ3UnOiByZXR1cm4gJ3VwZGF0ZWQnO1xyXG4gICAgICBjYXNlICdkJzogcmV0dXJuICdkZWxldGVkJztcclxuICAgICAgZGVmYXVsdDogIHRocm93IG5ldyBFcnJvcignVHJhY2thYmxlIE9iamVjdCBoYXMgYW4gdW5rbm93biBzdGF0ZS4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzUHJpc3RpbmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdwJztcclxuICB9XHJcblxyXG4gIGlzQWRkZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdhJztcclxuICB9XHJcblxyXG4gIGlzVXBkYXRlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9PT0gJ3UnO1xyXG4gIH1cclxuXHJcbiAgaXNEZWxldGVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCc7XHJcbiAgfVxyXG5cclxuICBuZXdVbml0T2ZXb3JrKCkge1xyXG4gICAgbGV0IHdvcmtzcGFjZSA9IHtcclxuICAgICAgY2hhbmdlczogW10sXHJcbiAgICAgIGlkOiBIZWxwZXJzLnN0cmluZ0lkKClcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXMudW5zaGlmdCh3b3Jrc3BhY2UpO1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlcygpIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFja2FibGUud29ya3NwYWNlc1swXS5jaGFuZ2VzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhc1BlbmRpbmdDaGFuZ2VzKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLl90cmFja2FibGUud29ya3NwYWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXNbaV0uY2hhbmdlcy5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWNjZXB0VW5pdE9mV29ya0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICByZWplY3RVbml0T2ZXb3JrQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIGFjY2VwdENoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICByZWplY3RDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgICBsZXQgbyA9IHt9O1xyXG5cclxuICAgIGZvciAobGV0IHByb3BlcnR5TmFtZSBpbiB0aGlzKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICBpZiAoSGVscGVycy5pc1RyYWNrYWJsZSh0aGlzW3Byb3BlcnR5TmFtZV0pKSB7XHJcbiAgICAgICAgICBvW3Byb3BlcnR5TmFtZV0gPSB0aGlzW3Byb3BlcnR5TmFtZV0uYXNOb25UcmFja2FibGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb1twcm9wZXJ0eU5hbWVdID0gdGhpc1twcm9wZXJ0eU5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG87XHJcbiAgfVxyXG59XHJcbiJdfQ==
