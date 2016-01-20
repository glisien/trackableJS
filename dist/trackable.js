(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClass = getClass;
exports.isString = isString;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isTrackable = isTrackable;
exports.isTrackableObject = isTrackableObject;
exports.isTrackableArray = isTrackableArray;
exports.isNullOrUndefined = isNullOrUndefined;
exports.areEqual = areEqual;
exports.find = find;
exports.remove = remove;
exports.stringId = stringId;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function getClass(o) {
  return ({}).toString.call(o);
}

function isString(o) {
  return getClass(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'string';
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

function isNullOrUndefined(o) {
  return o === null || o === undefined;
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

function remove(a, o) {
  var i = a.indexOf(o);
  a.splice(i, 1);
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

},{}],2:[function(require,module,exports){
'use strict';

var _trackableObject = require('./trackable-object');

var _trackableArray = require('./trackable-array');

window.TrackableObject = _trackableObject.TrackableObject;
window.TrackableArray = _trackableArray.TrackableArray;

},{"./trackable-array":3,"./trackable-object":5}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackableArray = undefined;

var _genericHelpers = require('./generic-helpers');

var GenericHelpers = _interopRequireWildcard(_genericHelpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrackableArray = exports.TrackableArray = (function () {
  function TrackableArray(o) {
    _classCallCheck(this, TrackableArray);

    if (GenericHelpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!GenericHelpers.isArray(o)) {
      throw new Error('Only an Array can learn how to track.');
    }
  }

  _createClass(TrackableArray, [{
    key: 'createSnapshot',
    value: function createSnapshot(snapshotId) {
      // TODO
    }
  }, {
    key: 'applySnapshot',
    value: function applySnapshot(snapshotId) {
      // TODO
    }
  }, {
    key: 'hasChanges',
    value: function hasChanges() {
      // TODO
    }
  }, {
    key: 'hasLocalChanges',
    value: function hasLocalChanges() {
      // TODO
    }
  }, {
    key: 'hasChildChanges',
    value: function hasChildChanges() {
      // TODO
    }
  }, {
    key: 'hasChangesAfterSnapshot',
    value: function hasChangesAfterSnapshot(snapshotId) {
      // TODO
    }
  }, {
    key: 'undo',
    value: function undo() {
      // TODO
    }
  }, {
    key: 'undoAll',
    value: function undoAll() {
      // TODO
    }
  }, {
    key: 'redo',
    value: function redo() {
      // TODO
    }
  }, {
    key: 'redoAll',
    value: function redoAll() {
      // TODO
    }
  }, {
    key: 'asNonTrackable',
    value: function asNonTrackable() {}
  }]);

  return TrackableArray;
})();

},{"./generic-helpers":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStructure = createStructure;
exports.createField = createField;
exports.evaluateState = evaluateState;

var _genericHelpers = require('./generic-helpers');

var GenericHelpers = _interopRequireWildcard(_genericHelpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createStructure(o) {
  Object.defineProperty(o, '__trackable__', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__, 'configuration', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  if (GenericHelpers.isObject(o)) {
    Object.defineProperty(o.__trackable__.configuration, 'addStateDefinition', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    });
  }

  Object.defineProperty(o.__trackable__, 'extensions', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__, 'fields', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__, 'state', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__.state, 'current', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: null
  });

  Object.defineProperty(o.__trackable__.state, 'original', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: null
  });

  Object.defineProperty(o.__trackable__, 'audit', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });

  Object.defineProperty(o.__trackable__.audit, 'pointer', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: 0
  });

  Object.defineProperty(o.__trackable__.audit, 'events', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: []
  });

  Object.defineProperty(o.__trackable__.audit, 'snapshots', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  });
}

function createField(o, name, value) {
  // create backing field
  if (GenericHelpers.isObject(value)) {
    Object.defineProperty(o.__trackable__.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: new TrackableObject(value)
    });
  } else if (GenericHelpers.isArray(value)) {
    Object.defineProperty(o.__trackable__.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: new TrackableArray(value)
    });
  } else {
    Object.defineProperty(o.__trackable__.fields, name, {
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
      return o.__trackable__.fields[name];
    },
    set: function set(value) {
      if (o.__trackable__.state.current === 'd') {
        throw Error('Once deleted always deleted.');
      }

      // currently not supporting assigning a trackable object or array
      if (GenericHelpers.isTrackable(value)) {
        throw Error('Cannot assing Trackable objects or arrays.');
      }

      // 01. ASSIGN: null/undefined   TO: null/undefined
      // 02. ASSIGN: null/undefined   TO: TrackableObject
      // 03. ASSIGN: null/undefined   TO: TrackableArray
      // 04. ASSIGN: null/undefined   TO: primitive type
      // 05. ASSIGN: Object           TO: null/undefined
      // 06. ASSIGN: Object           TO: TrackableObject
      // 07. ASSIGN: Object           TO: TrackableArray
      // 08. ASSIGN: Object           TO: primitive type
      // 09. ASSIGN: Array            TO: null/undefined
      // 10. ASSIGN: Array            TO: TrackableObject
      // 11. ASSIGN: Array            TO: TrackableArray
      // 12. ASSIGN: Array            TO: primitive type
      // 13. ASSIGN: primitive type   TO: null/undefined
      // 14. ASSIGN: primitive type   TO: TrackableObject
      // 15. ASSIGN: primitive type   TO: TrackableArray
      // 16. ASSIGN: primitive type   TO: primitive type

      if (GenericHelpers.isNullOrUndefined(value)) {
        // 01. ASSIGN: null/undefined TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o.__trackable__.fields[name])) {
          console.info('ASSIGN: null/undefined TO: null/undefined');
        }

        // 02. ASSIGN: null/undefined TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o.__trackable__.fields[name])) {
          console.info('ASSIGN: null/undefined TO: TrackableObject');
        }

        // 03. ASSIGN: null/undefined TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o.__trackable__.fields[name])) {
          console.info('ASSIGN: null/undefined TO: TrackableArray');
        }

        // 04. ASSIGN: null/undefined TO: primitive type
        console.info('ASSIGN: null/undefined TO: primitive type');
      }

      if (GenericHelpers.isObject(value)) {
        // 05. ASSIGN: Object TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Object TO: null/undefined');
        }

        // 06. ASSIGN: Object TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Object TO: TrackableObject');
        }

        // 07. ASSIGN: Object TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Object TO: TrackableArray');
        }

        // 08. ASSIGN: Object TO: primitive type
        console.info('ASSIGN: Object TO: primitive type');
      }

      if (GenericHelpers.isArray(value)) {
        // 09. ASSIGN: Array TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Array TO: null/undefined');
        }

        // 10. ASSIGN: Array TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Array TO: TrackableObject');
        }

        // 11. ASSIGN: Array TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o.__trackable__.fields[name])) {
          console.info('ASSIGN: Array TO: TrackableArray');
        }

        // 12. ASSIGN: Array TO: primitive type
        console.info('ASSIGN: Array TO: primitive type');
      }

      // 13. ASSIGN: primitive type TO: null/undefined
      if (GenericHelpers.isNullOrUndefined(o.__trackable__.fields[name])) {
        console.info('ASSIGN: primitive type TO: null/undefined');
      }

      // 14. ASSIGN: primitive type TO: TrackableObject
      if (GenericHelpers.isTrackableObject(o.__trackable__.fields[name])) {
        console.info('ASSIGN: primitive type TO: TrackableObject');
      }

      // 15. ASSIGN: primitive type TO: TrackableArray
      if (GenericHelpers.isTrackableArray(o.__trackable__.fields[name])) {
        console.info('ASSIGN: primitive type TO: TrackableArray');
      }

      // 16. ASSIGN: primitive type TO: primitive type
      console.info('ASSIGN: primitive type TO: primitive type');

      /*********** TESTING *******************/
      o.__trackable__.audit.events.splice(o.__trackable__.audit.pointer);

      for (var propertyName in o.__trackable__.audit.snapshots) {
        if (o.__trackable__.audit.snapshots.hasOwnProperty(propertyName)) {
          if (o.__trackable__.audit.snapshots[propertyName] >= o.__trackable__.audit.pointer) {
            delete o.__trackable__.audit.snapshots[propertyName];
          }
        }
      }

      var change = {
        property: name,
        oldValue: GenericHelpers.isTrackable(o.__trackable__.fields[name]) ? o.__trackable__.fields[name].asNonTrackable() : o.__trackable__.fields[name],
        newValue: GenericHelpers.isTrackable(value) ? value.asNonTrackable() : value
      };

      o.__trackable__.audit.events.push(change);
      o.__trackable__.audit.pointer += 1;

      if (GenericHelpers.isObject(value)) {
        o.__trackable__.fields[name] = new TrackableObject(value);
      } else if (GenericHelpers.isArray(value)) {
        o.__trackable__.fields[name] = new TrackableArray(value);
      } else {
        o.__trackable__.fields[name] = value;
      }
    }
  });
}

function evaluateState(o) {
  // check if deleted
  if (o.__trackable__.state.current === 'd') {
    return;
  }

  // check if added
  if (Object.keys(o.__trackable__.configuration.addStateDefinition).length) {
    var isAdded = true;

    for (var propertyName in o.__trackable__.configuration.addStateDefinition) {
      if (o.hasOwnProperty(propertyName)) {
        if (o.__trackable__.configuration.addStateDefinition[propertyName] !== o[propertyName]) {
          isAdded = false;
          break;
        }
      } else {
        isAdded = false;
        break;
      }
    }

    if (isAdded) {
      o.__trackable__.state.current = 'a';
      return;
    }
  }

  // check if updated
  var isUpdated = false,
      w = o.__trackable__.snapshots.length;

  while (w--) {
    if (o.__trackable__.snapshots[w].events.length > 0) {
      isUpdated = true;
      break;
    }
  }

  if (isUpdated) {
    o.__trackable__.state.current = 'u';
    return;
  } else {
    o.__trackable__.state.current = 'p';
    return;
  }
}

},{"./generic-helpers":1}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackableObject = undefined;

var _genericHelpers = require('./generic-helpers');

var GenericHelpers = _interopRequireWildcard(_genericHelpers);

var _trackableHelpers = require('./trackable-helpers');

var TrackableHelpers = _interopRequireWildcard(_trackableHelpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrackableObject = exports.TrackableObject = (function () {
  function TrackableObject(o) {
    var addStateDefinition = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, TrackableObject);

    if (GenericHelpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!GenericHelpers.isObject(o)) {
      throw new Error('Only an Object can learn how to track.');
    }

    TrackableHelpers.createStructure(this);

    for (var propertyName in o) {
      if (o.hasOwnProperty(propertyName)) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(o, propertyName);
        if (propertyDescriptor.writable && propertyDescriptor.configurable) {
          TrackableHelpers.createField(this, propertyName, propertyDescriptor.value);
        }
      }
    }
  }

  _createClass(TrackableObject, [{
    key: 'createSnapshot',
    value: function createSnapshot(snapshotId) {
      if (!GenericHelpers.isString(snapshotId)) {
        throw new Error('I only like strings as snapshot identifiers.');
      }
      this.__trackable__.audit.snapshots[snapshotId] = this.__trackable__.audit.pointer;
      return this;
    }
  }, {
    key: 'applySnapshot',
    value: function applySnapshot(snapshotId) {
      if (this.__trackable__.audit.snapshots.hasOwnProperty(snapshotId)) {
        var snapshotPointer = this.__trackable__.audit.snapshots[snapshotId];
        if (snapshotPointer < this.__trackable__.audit.pointer) {
          while (this.__trackable__.audit.pointer > snapshotPointer) {
            this.undo();
          }
        } else if (snapshotPointer > this.__trackable__.audit.pointer) {
          while (this.__trackable__.audit.pointer < snapshotPointer) {
            this.redo();
          }
        }
      }
      return this;
    }
  }, {
    key: 'hasChanges',
    value: function hasChanges() {
      return this.hasLocalChanges() || this.hasChildChanges();
    }
  }, {
    key: 'hasLocalChanges',
    value: function hasLocalChanges() {
      return !!this.__trackable__.audit.events.length;
    }
  }, {
    key: 'hasChildChanges',
    value: function hasChildChanges() {
      for (var propertyName in this) {
        if (this.hasOwnProperty(propertyName)) {
          if (GenericHelpers.isTrackable(this.__trackable__.fields[propertyName])) {
            if (this.__trackable__.fields[propertyName].hasChanges()) {
              return true;
            }
          }
        }
      }
      return false;
    }
  }, {
    key: 'hasChangesAfterSnapshot',
    value: function hasChangesAfterSnapshot(snapshotId) {
      if (this.__trackable__.audit.snapshots.hasOwnProperty(snapshotId)) {
        var snapshotPointer = this.__trackable__.audit.snapshots[snapshotId];
        if (this.__trackable__.audit.events.length > snapshotPointer) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'undo',
    value: function undo() {
      var change = this.__trackable__.audit.events[this.__trackable__.audit.pointer - 1];
      if (change) {
        if (GenericHelpers.isObject(change.oldValue)) {
          this.__trackable__.fields[change.property] = new TrackableObject(change.oldValue);
        } else if (GenericHelpers.isArray(change.oldValue)) {
          this.__trackable__.fields[change.property] = new TrackableArray(change.oldValue);
        } else {
          this.__trackable__.fields[change.property] = change.oldValue;
        }
        this.__trackable__.audit.pointer -= 1;
      }
      return this;
    }
  }, {
    key: 'undoAll',
    value: function undoAll() {
      while (this.__trackable__.audit.pointer > 0) {
        this.undo();
      }
      return this;
    }
  }, {
    key: 'redo',
    value: function redo() {
      var change = this.__trackable__.audit.events[this.__trackable__.audit.pointer];
      if (change) {
        if (GenericHelpers.isObject(change.newValue)) {
          this.__trackable__.fields[change.property] = new TrackableObject(change.newValue);
        } else if (GenericHelpers.isArray(change.newValue)) {
          this.__trackable__.fields[change.property] = new TrackableArray(change.newValue);
        } else {
          this.__trackable__.fields[change.property] = change.newValue;
        }
        this.__trackable__.audit.pointer += 1;
      }
      return this;
    }
  }, {
    key: 'redoAll',
    value: function redoAll() {
      while (this.__trackable__.audit.pointer < this.__trackable__.audit.events.length) {
        this.redo();
      }
      return this;
    }

    /*
      state() {
      switch (this.__trackable__.state.current) {
        case 'p': return 'pristine';
        case 'a': return 'added';
        case 'u': return 'updated';
        case 'd': return 'deleted';
        default:  throw new Error('Trackable Object has an unknown state.');
      }
    }
      isPristine() {
      return this.__trackable__.state.current === 'p';
    }
      isAdded() {
      return this.__trackable__.state.current === 'a';
    }
      isUpdated() {
      return this.__trackable__.state.current === 'u';
    }
      isDeleted() {
      return this.__trackable__.state.current === 'd';
    }
      */

  }, {
    key: 'asNonTrackable',
    value: function asNonTrackable() {
      var o = {};
      for (var propertyName in this) {
        if (this.hasOwnProperty(propertyName)) {
          if (GenericHelpers.isTrackable(this[propertyName])) {
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

},{"./generic-helpers":1,"./trackable-helpers":4}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGdlbmVyaWMtaGVscGVycy5qcyIsInNyY1xcaW5kZXguanMiLCJzcmNcXHRyYWNrYWJsZS1hcnJheS5qcyIsInNyY1xcdHJhY2thYmxlLWhlbHBlcnMuanMiLCJzcmNcXHRyYWNrYWJsZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixRQUFRLEdBQVIsUUFBUTtRQUlSLFFBQVEsR0FBUixRQUFRO1FBSVIsUUFBUSxHQUFSLFFBQVE7UUFJUixPQUFPLEdBQVAsT0FBTztRQUlQLFdBQVcsR0FBWCxXQUFXO1FBSVgsaUJBQWlCLEdBQWpCLGlCQUFpQjtRQUlqQixnQkFBZ0IsR0FBaEIsZ0JBQWdCO1FBSWhCLGlCQUFpQixHQUFqQixpQkFBaUI7UUFJakIsUUFBUSxHQUFSLFFBQVE7UUE0Q1IsSUFBSSxHQUFKLElBQUk7UUFxQkosTUFBTSxHQUFOLE1BQU07UUFLTixRQUFRLEdBQVIsUUFBUTs7OztBQXRHakIsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQzFCLFNBQU8sQ0FBQyxHQUFFLENBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUM5Qjs7QUFFTSxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsU0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQztDQUN6RTs7QUFFTSxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsU0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQztDQUN6RTs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxDQUFDLEVBQUU7QUFDekIsU0FB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QWdDZ0I7QUFDZixVQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxXQUFLLElBQUksWUFBWSxJQUFJLElBQUksRUFBRTtBQUM3QixZQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDckMsY0FBSSxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFO0FBQ2xELGFBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7V0FDdkQsTUFBTTtBQUNMLGFBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7V0FDckM7U0FDRjtPQUNGO0FBQ0QsYUFBTyxDQUFDLENBQUM7S0FDVjs7O1NBbktVLGVBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzKG8pIHtcclxuICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKG8pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmcobykge1xyXG4gIHJldHVybiBnZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnc3RyaW5nJztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcclxuICByZXR1cm4gZ2V0Q2xhc3MobykubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKSA9PT0gJ29iamVjdCc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KG8pIHtcclxuICByZXR1cm4gZ2V0Q2xhc3MobykubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKSA9PT0gJ2FycmF5JztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJhY2thYmxlKG8pIHtcclxuICByZXR1cm4gKGlzT2JqZWN0KG8pIHx8IGlzQXJyYXkobykpICYmIChvIGluc3RhbmNlb2YgVHJhY2thYmxlT2JqZWN0IHx8IG8gaW5zdGFuY2VvZiBUcmFja2FibGVBcnJheSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyYWNrYWJsZU9iamVjdChvKSB7XHJcbiAgcmV0dXJuIChpc09iamVjdChvKSB8fCBpc0FycmF5KG8pKSAmJiBvIGluc3RhbmNlb2YgVHJhY2thYmxlT2JqZWN0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFja2FibGVBcnJheShvKSB7XHJcbiAgcmV0dXJuIChpc09iamVjdChvKSB8fCBpc0FycmF5KG8pKSAmJiBvIGluc3RhbmNlb2YgVHJhY2thYmxlQXJyYXk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChvKSB7XHJcbiAgcmV0dXJuIG8gPT09IG51bGwgfHwgbyA9PT0gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXJlRXF1YWwobzEsIG8yKSB7XHJcbiAgbGV0IHByb3BlcnR5TmFtZTtcclxuXHJcbiAgaWYgKG8xID09PSBvMikge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBpZiAoIShvMSBpbnN0YW5jZW9mIE9iamVjdCkgfHwgIShvMiBpbnN0YW5jZW9mIE9iamVjdCkpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGlmIChvMS5jb25zdHJ1Y3RvciAhPT0gbzIuY29uc3RydWN0b3IpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZvciAocHJvcGVydHlOYW1lIGluIG8xKSB7XHJcbiAgICBpZiAoIW8xLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvMi5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobzFbcHJvcGVydHlOYW1lXSA9PT0gbzJbcHJvcGVydHlOYW1lXSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIChvMVtwcm9wZXJ0eU5hbWVdKSAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghYXJlRXF1YWwobzFbcHJvcGVydHlOYW1lXSwgbzJbcHJvcGVydHlOYW1lXSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9yIChwcm9wZXJ0eU5hbWUgaW4gbzIpIHtcclxuICAgIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpICYmICFvMS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kKGEsIG8pIHtcclxuICBsZXQgaSA9IGEubGVuZ3RoO1xyXG4gIHdoaWxlIChpLS0pIHtcclxuICAgIGxldCBmb3VuZCA9IHRydWU7XHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gbykge1xyXG4gICAgICBpZiAoYVtpXS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgaWYgKGFbaV1bcHJvcGVydHlOYW1lXSA9PT0gb1twcm9wZXJ0eU5hbWVdKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm91bmQgPSBmYWxzZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgIHJldHVybiBhW2ldO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZShhLCBvKSB7XHJcbiAgbGV0IGkgPSBhLmluZGV4T2Yobyk7XHJcbiAgYS5zcGxpY2UoaSwgMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdJZChsZW5ndGggPSAxMCkge1xyXG4gIGxldCBjaGFycyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OScsXHJcbiAgICAgIHJlc3VsdCA9ICcnO1xyXG5cclxuICBmb3IgKGxldCBpID0gbGVuZ3RoOyBpID4gMDsgLS1pKSB7XHJcbiAgICByZXN1bHQgKz0gY2hhcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcnMubGVuZ3RoKV07XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIiwiaW1wb3J0IHtUcmFja2FibGVPYmplY3R9IGZyb20gJy4vdHJhY2thYmxlLW9iamVjdCdcclxuaW1wb3J0IHtUcmFja2FibGVBcnJheX0gZnJvbSAnLi90cmFja2FibGUtYXJyYXknXHJcblxyXG53aW5kb3cuVHJhY2thYmxlT2JqZWN0ID0gVHJhY2thYmxlT2JqZWN0O1xyXG53aW5kb3cuVHJhY2thYmxlQXJyYXkgPSBUcmFja2FibGVBcnJheTtcclxuIiwiaW1wb3J0ICogYXMgR2VuZXJpY0hlbHBlcnMgZnJvbSAnLi9nZW5lcmljLWhlbHBlcnMnXHJcblxyXG5leHBvcnQgY2xhc3MgVHJhY2thYmxlQXJyYXkge1xyXG4gIGNvbnN0cnVjdG9yKG8pIHtcclxuICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXJzIGRvIG5vdCBsaWtlIHRvIGJlIHRyYWNrZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFHZW5lcmljSGVscGVycy5pc0FycmF5KG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBhbiBBcnJheSBjYW4gbGVhcm4gaG93IHRvIHRyYWNrLicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlU25hcHNob3Qoc25hcHNob3RJZCkge1xyXG4gICAgLy8gVE9ET1xyXG4gIH1cclxuXHJcbiAgYXBwbHlTbmFwc2hvdChzbmFwc2hvdElkKSB7XHJcbiAgICAvLyBUT0RPXHJcbiAgfVxyXG5cclxuICBoYXNDaGFuZ2VzKCkge1xyXG4gICAgLy8gVE9ET1xyXG4gIH1cclxuXHJcbiAgaGFzTG9jYWxDaGFuZ2VzKCkge1xyXG4gICAgLy8gVE9ET1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hpbGRDaGFuZ2VzKCkge1xyXG4gICAgLy8gVE9ET1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlc0FmdGVyU25hcHNob3Qoc25hcHNob3RJZCkge1xyXG4gICAgLy8gVE9ET1xyXG4gIH1cclxuXHJcbiAgdW5kbygpIHtcclxuICAgIC8vIFRPRE9cclxuICB9XHJcblxyXG4gIHVuZG9BbGwoKSB7XHJcbiAgICAvLyBUT0RPXHJcbiAgfVxyXG5cclxuICByZWRvKCkge1xyXG4gICAgLy8gVE9ET1xyXG4gIH1cclxuXHJcbiAgcmVkb0FsbCgpIHtcclxuICAgIC8vIFRPRE9cclxuICB9XHJcblxyXG4gIGFzTm9uVHJhY2thYmxlKCkge1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBHZW5lcmljSGVscGVycyBmcm9tICcuL2dlbmVyaWMtaGVscGVycydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdHJ1Y3R1cmUobykge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCAnX190cmFja2FibGVfXycsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl9fdHJhY2thYmxlX18sICdjb25maWd1cmF0aW9uJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzT2JqZWN0KG8pKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fX3RyYWNrYWJsZV9fLmNvbmZpZ3VyYXRpb24sICdhZGRTdGF0ZURlZmluaXRpb24nLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IHt9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl9fdHJhY2thYmxlX18sICdleHRlbnNpb25zJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX190cmFja2FibGVfXywgJ2ZpZWxkcycsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl9fdHJhY2thYmxlX18sICdzdGF0ZScsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl9fdHJhY2thYmxlX18uc3RhdGUsICdjdXJyZW50Jywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZTogbnVsbFxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fX3RyYWNrYWJsZV9fLnN0YXRlLCAnb3JpZ2luYWwnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBudWxsXHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl9fdHJhY2thYmxlX18sICdhdWRpdCcsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl9fdHJhY2thYmxlX18uYXVkaXQsICdwb2ludGVyJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZTogMFxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fX3RyYWNrYWJsZV9fLmF1ZGl0LCAnZXZlbnRzJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZTogW11cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX190cmFja2FibGVfXy5hdWRpdCwgJ3NuYXBzaG90cycsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGaWVsZChvLCBuYW1lLCB2YWx1ZSkge1xyXG4gIC8vIGNyZWF0ZSBiYWNraW5nIGZpZWxkXHJcbiAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX190cmFja2FibGVfXy5maWVsZHMsIG5hbWUsIHtcclxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgdmFsdWU6IG5ldyBUcmFja2FibGVPYmplY3QodmFsdWUpXHJcbiAgICB9KTtcclxuICB9IGVsc2UgaWYgKEdlbmVyaWNIZWxwZXJzLmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fX3RyYWNrYWJsZV9fLmZpZWxkcywgbmFtZSwge1xyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB2YWx1ZTogbmV3IFRyYWNrYWJsZUFycmF5KHZhbHVlKVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl9fdHJhY2thYmxlX18uZmllbGRzLCBuYW1lLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBjcmVhdGUgZ2V0dGVyL3NldHRlciBmb3IgYmFja2luZyBmaWVsZFxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBuYW1lLCB7XHJcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIG8uX190cmFja2FibGVfXy5maWVsZHNbbmFtZV1cclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgIGlmIChvLl9fdHJhY2thYmxlX18uc3RhdGUuY3VycmVudCA9PT0gJ2QnKSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ09uY2UgZGVsZXRlZCBhbHdheXMgZGVsZXRlZC4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gY3VycmVudGx5IG5vdCBzdXBwb3J0aW5nIGFzc2lnbmluZyBhIHRyYWNrYWJsZSBvYmplY3Qgb3IgYXJyYXlcclxuICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlKHZhbHVlKSkge1xyXG4gICAgICAgIHRocm93IEVycm9yKCdDYW5ub3QgYXNzaW5nIFRyYWNrYWJsZSBvYmplY3RzIG9yIGFycmF5cy4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gMDEuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgICBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgLy8gMDIuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgICBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgIC8vIDAzLiBBU1NJR046IG51bGwvdW5kZWZpbmVkICAgVE86IFRyYWNrYWJsZUFycmF5XHJcbiAgICAgIC8vIDA0LiBBU1NJR046IG51bGwvdW5kZWZpbmVkICAgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgIC8vIDA1LiBBU1NJR046IE9iamVjdCAgICAgICAgICAgVE86IG51bGwvdW5kZWZpbmVkXHJcbiAgICAgIC8vIDA2LiBBU1NJR046IE9iamVjdCAgICAgICAgICAgVE86IFRyYWNrYWJsZU9iamVjdFxyXG4gICAgICAvLyAwNy4gQVNTSUdOOiBPYmplY3QgICAgICAgICAgIFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAvLyAwOC4gQVNTSUdOOiBPYmplY3QgICAgICAgICAgIFRPOiBwcmltaXRpdmUgdHlwZVxyXG4gICAgICAvLyAwOS4gQVNTSUdOOiBBcnJheSAgICAgICAgICAgIFRPOiBudWxsL3VuZGVmaW5lZFxyXG4gICAgICAvLyAxMC4gQVNTSUdOOiBBcnJheSAgICAgICAgICAgIFRPOiBUcmFja2FibGVPYmplY3RcclxuICAgICAgLy8gMTEuIEFTU0lHTjogQXJyYXkgICAgICAgICAgICBUTzogVHJhY2thYmxlQXJyYXlcclxuICAgICAgLy8gMTIuIEFTU0lHTjogQXJyYXkgICAgICAgICAgICBUTzogcHJpbWl0aXZlIHR5cGVcclxuICAgICAgLy8gMTMuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgICBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgLy8gMTQuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgICBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgIC8vIDE1LiBBU1NJR046IHByaW1pdGl2ZSB0eXBlICAgVE86IFRyYWNrYWJsZUFycmF5XHJcbiAgICAgIC8vIDE2LiBBU1NJR046IHByaW1pdGl2ZSB0eXBlICAgVE86IHByaW1pdGl2ZSB0eXBlXHJcblxyXG4gICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgLy8gMDEuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgVE86IG51bGwvdW5kZWZpbmVkXHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzTnVsbE9yVW5kZWZpbmVkKG8uX190cmFja2FibGVfXy5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ0FTU0lHTjogbnVsbC91bmRlZmluZWQgVE86IG51bGwvdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAwMi4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlT2JqZWN0KG8uX190cmFja2FibGVfXy5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ0FTU0lHTjogbnVsbC91bmRlZmluZWQgVE86IFRyYWNrYWJsZU9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMDMuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgVE86IFRyYWNrYWJsZUFycmF5XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlQXJyYXkoby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogVHJhY2thYmxlQXJyYXknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDA0LiBBU1NJR046IG51bGwvdW5kZWZpbmVkIFRPOiBwcmltaXRpdmUgdHlwZVxyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogcHJpbWl0aXZlIHR5cGUnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICAgIC8vIDA1LiBBU1NJR046IE9iamVjdCBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNOdWxsT3JVbmRlZmluZWQoby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnQVNTSUdOOiBPYmplY3QgVE86IG51bGwvdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAwNi4gQVNTSUdOOiBPYmplY3QgVE86IFRyYWNrYWJsZU9iamVjdFxyXG4gICAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZU9iamVjdChvLl9fdHJhY2thYmxlX18uZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgICAgY29uc29sZS5pbmZvKCdBU1NJR046IE9iamVjdCBUTzogVHJhY2thYmxlT2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAwNy4gQVNTSUdOOiBPYmplY3QgVE86IFRyYWNrYWJsZUFycmF5XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlQXJyYXkoby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnQVNTSUdOOiBPYmplY3QgVE86IFRyYWNrYWJsZUFycmF5Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAwOC4gQVNTSUdOOiBPYmplY3QgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdBU1NJR046IE9iamVjdCBUTzogcHJpbWl0aXZlIHR5cGUnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgLy8gMDkuIEFTU0lHTjogQXJyYXkgVE86IG51bGwvdW5kZWZpbmVkXHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzTnVsbE9yVW5kZWZpbmVkKG8uX190cmFja2FibGVfXy5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ0FTU0lHTjogQXJyYXkgVE86IG51bGwvdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAxMC4gQVNTSUdOOiBBcnJheSBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlT2JqZWN0KG8uX190cmFja2FibGVfXy5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ0FTU0lHTjogQXJyYXkgVE86IFRyYWNrYWJsZU9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMTEuIEFTU0lHTjogQXJyYXkgVE86IFRyYWNrYWJsZUFycmF5XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlQXJyYXkoby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnQVNTSUdOOiBBcnJheSBUTzogVHJhY2thYmxlQXJyYXknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDEyLiBBU1NJR046IEFycmF5IFRPOiBwcmltaXRpdmUgdHlwZVxyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnQVNTSUdOOiBBcnJheSBUTzogcHJpbWl0aXZlIHR5cGUnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gMTMuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IG51bGwvdW5kZWZpbmVkXHJcbiAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc051bGxPclVuZGVmaW5lZChvLl9fdHJhY2thYmxlX18uZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnQVNTSUdOOiBwcmltaXRpdmUgdHlwZSBUTzogbnVsbC91bmRlZmluZWQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gMTQuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IFRyYWNrYWJsZU9iamVjdFxyXG4gICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNUcmFja2FibGVPYmplY3Qoby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ0FTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IFRyYWNrYWJsZU9iamVjdCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAxNS4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSBUTzogVHJhY2thYmxlQXJyYXlcclxuICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlQXJyYXkoby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ0FTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IFRyYWNrYWJsZUFycmF5Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIDE2LiBBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBwcmltaXRpdmUgdHlwZVxyXG4gICAgICBjb25zb2xlLmluZm8oJ0FTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IHByaW1pdGl2ZSB0eXBlJyk7XHJcblxyXG4gICAgICAvKioqKioqKioqKiogVEVTVElORyAqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgICBvLl9fdHJhY2thYmxlX18uYXVkaXQuZXZlbnRzLnNwbGljZShvLl9fdHJhY2thYmxlX18uYXVkaXQucG9pbnRlcik7XHJcblxyXG4gICAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gby5fX3RyYWNrYWJsZV9fLmF1ZGl0LnNuYXBzaG90cykge1xyXG4gICAgICAgIGlmIChvLl9fdHJhY2thYmxlX18uYXVkaXQuc25hcHNob3RzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICAgIGlmIChvLl9fdHJhY2thYmxlX18uYXVkaXQuc25hcHNob3RzW3Byb3BlcnR5TmFtZV0gPj0gby5fX3RyYWNrYWJsZV9fLmF1ZGl0LnBvaW50ZXIpIHtcclxuICAgICAgICAgICAgZGVsZXRlIG8uX190cmFja2FibGVfXy5hdWRpdC5zbmFwc2hvdHNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBjaGFuZ2UgPSB7XHJcbiAgICAgICAgcHJvcGVydHk6IG5hbWUsXHJcbiAgICAgICAgb2xkVmFsdWU6IEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlKG8uX190cmFja2FibGVfXy5maWVsZHNbbmFtZV0pID9cclxuICAgICAgICAgICAgICAgICAgICBvLl9fdHJhY2thYmxlX18uZmllbGRzW25hbWVdLmFzTm9uVHJhY2thYmxlKCkgOlxyXG4gICAgICAgICAgICAgICAgICAgIG8uX190cmFja2FibGVfXy5maWVsZHNbbmFtZV0sXHJcbiAgICAgICAgbmV3VmFsdWU6IEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlKHZhbHVlKSA/XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuYXNOb25UcmFja2FibGUoKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVcclxuICAgICAgfVxyXG5cclxuICAgICAgby5fX3RyYWNrYWJsZV9fLmF1ZGl0LmV2ZW50cy5wdXNoKGNoYW5nZSk7XHJcbiAgICAgIG8uX190cmFja2FibGVfXy5hdWRpdC5wb2ludGVyICs9IDE7XHJcblxyXG4gICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNPYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSA9IG5ldyBUcmFja2FibGVPYmplY3QodmFsdWUpO1xyXG4gICAgICB9IGVsc2UgaWYgKEdlbmVyaWNIZWxwZXJzLmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSA9IG5ldyBUcmFja2FibGVBcnJheSh2YWx1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgby5fX3RyYWNrYWJsZV9fLmZpZWxkc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBldmFsdWF0ZVN0YXRlKG8pIHtcclxuICAvLyBjaGVjayBpZiBkZWxldGVkXHJcbiAgaWYgKG8uX190cmFja2FibGVfXy5zdGF0ZS5jdXJyZW50ID09PSAnZCcpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIGlmIGFkZGVkXHJcbiAgaWYgKE9iamVjdC5rZXlzKG8uX190cmFja2FibGVfXy5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbikubGVuZ3RoKSB7XHJcbiAgICBsZXQgaXNBZGRlZCA9IHRydWU7XHJcblxyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIG8uX190cmFja2FibGVfXy5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbikge1xyXG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgaWYgKG8uX190cmFja2FibGVfXy5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVdICE9PSBvW3Byb3BlcnR5TmFtZV0pIHtcclxuICAgICAgICAgIGlzQWRkZWQgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpc0FkZGVkID0gZmFsc2U7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNBZGRlZCkge1xyXG4gICAgICBvLl9fdHJhY2thYmxlX18uc3RhdGUuY3VycmVudCA9ICdhJztcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgaWYgdXBkYXRlZFxyXG4gIGxldCBpc1VwZGF0ZWQgPSBmYWxzZSxcclxuICAgICAgdyA9IG8uX190cmFja2FibGVfXy5zbmFwc2hvdHMubGVuZ3RoO1xyXG5cclxuICB3aGlsZSAody0tKSB7XHJcbiAgICBpZiAoby5fX3RyYWNrYWJsZV9fLnNuYXBzaG90c1t3XS5ldmVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBpc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChpc1VwZGF0ZWQpIHtcclxuICAgIG8uX190cmFja2FibGVfXy5zdGF0ZS5jdXJyZW50ID0gJ3UnO1xyXG4gICAgcmV0dXJuO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvLl9fdHJhY2thYmxlX18uc3RhdGUuY3VycmVudCA9ICdwJztcclxuICAgIHJldHVybjtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgR2VuZXJpY0hlbHBlcnMgZnJvbSAnLi9nZW5lcmljLWhlbHBlcnMnXHJcbmltcG9ydCAqIGFzIFRyYWNrYWJsZUhlbHBlcnMgZnJvbSAnLi90cmFja2FibGUtaGVscGVycydcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFja2FibGVPYmplY3Qge1xyXG4gIGNvbnN0cnVjdG9yKG8sIGFkZFN0YXRlRGVmaW5pdGlvbiA9IG51bGwpIHtcclxuICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrZXJzIGRvIG5vdCBsaWtlIHRvIGJlIHRyYWNrZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFHZW5lcmljSGVscGVycy5pc09iamVjdChvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYW4gT2JqZWN0IGNhbiBsZWFybiBob3cgdG8gdHJhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgVHJhY2thYmxlSGVscGVycy5jcmVhdGVTdHJ1Y3R1cmUodGhpcyk7XHJcblxyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIG8pIHtcclxuICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGxldCBwcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5RGVzY3JpcHRvci53cml0YWJsZSAmJiBwcm9wZXJ0eURlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XHJcbiAgICAgICAgICBUcmFja2FibGVIZWxwZXJzLmNyZWF0ZUZpZWxkKHRoaXMsIHByb3BlcnR5TmFtZSwgcHJvcGVydHlEZXNjcmlwdG9yLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNyZWF0ZVNuYXBzaG90KHNuYXBzaG90SWQpIHtcclxuICAgIGlmICghR2VuZXJpY0hlbHBlcnMuaXNTdHJpbmcoc25hcHNob3RJZCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJIG9ubHkgbGlrZSBzdHJpbmdzIGFzIHNuYXBzaG90IGlkZW50aWZpZXJzLicpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fX3RyYWNrYWJsZV9fLmF1ZGl0LnNuYXBzaG90c1tzbmFwc2hvdElkXSA9IHRoaXMuX190cmFja2FibGVfXy5hdWRpdC5wb2ludGVyO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBhcHBseVNuYXBzaG90KHNuYXBzaG90SWQpIHtcclxuICAgIGlmICh0aGlzLl9fdHJhY2thYmxlX18uYXVkaXQuc25hcHNob3RzLmhhc093blByb3BlcnR5KHNuYXBzaG90SWQpKSB7XHJcbiAgICAgIGxldCBzbmFwc2hvdFBvaW50ZXIgPSB0aGlzLl9fdHJhY2thYmxlX18uYXVkaXQuc25hcHNob3RzW3NuYXBzaG90SWRdO1xyXG4gICAgICBpZiAoc25hcHNob3RQb2ludGVyIDwgdGhpcy5fX3RyYWNrYWJsZV9fLmF1ZGl0LnBvaW50ZXIpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5fX3RyYWNrYWJsZV9fLmF1ZGl0LnBvaW50ZXIgPiBzbmFwc2hvdFBvaW50ZXIpIHtcclxuICAgICAgICAgIHRoaXMudW5kbygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChzbmFwc2hvdFBvaW50ZXIgPiB0aGlzLl9fdHJhY2thYmxlX18uYXVkaXQucG9pbnRlcikge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLl9fdHJhY2thYmxlX18uYXVkaXQucG9pbnRlciA8IHNuYXBzaG90UG9pbnRlcikge1xyXG4gICAgICAgICAgdGhpcy5yZWRvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGhhc0NoYW5nZXMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5oYXNMb2NhbENoYW5nZXMoKSB8fCB0aGlzLmhhc0NoaWxkQ2hhbmdlcygpO1xyXG4gIH1cclxuXHJcbiAgaGFzTG9jYWxDaGFuZ2VzKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5fX3RyYWNrYWJsZV9fLmF1ZGl0LmV2ZW50cy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBoYXNDaGlsZENoYW5nZXMoKSB7XHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gdGhpcykge1xyXG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlKHRoaXMuX190cmFja2FibGVfXy5maWVsZHNbcHJvcGVydHlOYW1lXSkpIHtcclxuICAgICAgICAgIGlmICh0aGlzLl9fdHJhY2thYmxlX18uZmllbGRzW3Byb3BlcnR5TmFtZV0uaGFzQ2hhbmdlcygpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hhbmdlc0FmdGVyU25hcHNob3Qoc25hcHNob3RJZCkge1xyXG4gICAgaWYgKHRoaXMuX190cmFja2FibGVfXy5hdWRpdC5zbmFwc2hvdHMuaGFzT3duUHJvcGVydHkoc25hcHNob3RJZCkpIHtcclxuICAgICAgbGV0IHNuYXBzaG90UG9pbnRlciA9IHRoaXMuX190cmFja2FibGVfXy5hdWRpdC5zbmFwc2hvdHNbc25hcHNob3RJZF07XHJcbiAgICAgIGlmICh0aGlzLl9fdHJhY2thYmxlX18uYXVkaXQuZXZlbnRzLmxlbmd0aCA+IHNuYXBzaG90UG9pbnRlcikge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICB1bmRvKCkge1xyXG4gICAgbGV0IGNoYW5nZSA9IHRoaXMuX190cmFja2FibGVfXy5hdWRpdC5ldmVudHNbdGhpcy5fX3RyYWNrYWJsZV9fLmF1ZGl0LnBvaW50ZXIgLSAxXTtcclxuICAgIGlmIChjaGFuZ2UpIHtcclxuICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzT2JqZWN0KGNoYW5nZS5vbGRWYWx1ZSkpIHtcclxuICAgICAgICB0aGlzLl9fdHJhY2thYmxlX18uZmllbGRzW2NoYW5nZS5wcm9wZXJ0eV0gPSBuZXcgVHJhY2thYmxlT2JqZWN0KGNoYW5nZS5vbGRWYWx1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoR2VuZXJpY0hlbHBlcnMuaXNBcnJheShjaGFuZ2Uub2xkVmFsdWUpKSB7XHJcbiAgICAgICAgdGhpcy5fX3RyYWNrYWJsZV9fLmZpZWxkc1tjaGFuZ2UucHJvcGVydHldID0gbmV3IFRyYWNrYWJsZUFycmF5KGNoYW5nZS5vbGRWYWx1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fX3RyYWNrYWJsZV9fLmZpZWxkc1tjaGFuZ2UucHJvcGVydHldID0gY2hhbmdlLm9sZFZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX190cmFja2FibGVfXy5hdWRpdC5wb2ludGVyIC09IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHVuZG9BbGwoKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fX3RyYWNrYWJsZV9fLmF1ZGl0LnBvaW50ZXIgPiAwKSB7XHJcbiAgICAgIHRoaXMudW5kbygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByZWRvKCkge1xyXG4gICAgbGV0IGNoYW5nZSA9IHRoaXMuX190cmFja2FibGVfXy5hdWRpdC5ldmVudHNbdGhpcy5fX3RyYWNrYWJsZV9fLmF1ZGl0LnBvaW50ZXJdO1xyXG4gICAgaWYgKGNoYW5nZSkge1xyXG4gICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNPYmplY3QoY2hhbmdlLm5ld1ZhbHVlKSkge1xyXG4gICAgICAgIHRoaXMuX190cmFja2FibGVfXy5maWVsZHNbY2hhbmdlLnByb3BlcnR5XSA9IG5ldyBUcmFja2FibGVPYmplY3QoY2hhbmdlLm5ld1ZhbHVlKTtcclxuICAgICAgfSBlbHNlIGlmIChHZW5lcmljSGVscGVycy5pc0FycmF5KGNoYW5nZS5uZXdWYWx1ZSkpIHtcclxuICAgICAgICB0aGlzLl9fdHJhY2thYmxlX18uZmllbGRzW2NoYW5nZS5wcm9wZXJ0eV0gPSBuZXcgVHJhY2thYmxlQXJyYXkoY2hhbmdlLm5ld1ZhbHVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl9fdHJhY2thYmxlX18uZmllbGRzW2NoYW5nZS5wcm9wZXJ0eV0gPSBjaGFuZ2UubmV3VmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fX3RyYWNrYWJsZV9fLmF1ZGl0LnBvaW50ZXIgKz0gMTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcmVkb0FsbCgpIHtcclxuICAgIHdoaWxlICh0aGlzLl9fdHJhY2thYmxlX18uYXVkaXQucG9pbnRlciA8IHRoaXMuX190cmFja2FibGVfXy5hdWRpdC5ldmVudHMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMucmVkbygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKlxyXG5cclxuICBzdGF0ZSgpIHtcclxuICAgIHN3aXRjaCAodGhpcy5fX3RyYWNrYWJsZV9fLnN0YXRlLmN1cnJlbnQpIHtcclxuICAgICAgY2FzZSAncCc6IHJldHVybiAncHJpc3RpbmUnO1xyXG4gICAgICBjYXNlICdhJzogcmV0dXJuICdhZGRlZCc7XHJcbiAgICAgIGNhc2UgJ3UnOiByZXR1cm4gJ3VwZGF0ZWQnO1xyXG4gICAgICBjYXNlICdkJzogcmV0dXJuICdkZWxldGVkJztcclxuICAgICAgZGVmYXVsdDogIHRocm93IG5ldyBFcnJvcignVHJhY2thYmxlIE9iamVjdCBoYXMgYW4gdW5rbm93biBzdGF0ZS4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzUHJpc3RpbmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fX3RyYWNrYWJsZV9fLnN0YXRlLmN1cnJlbnQgPT09ICdwJztcclxuICB9XHJcblxyXG4gIGlzQWRkZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fX3RyYWNrYWJsZV9fLnN0YXRlLmN1cnJlbnQgPT09ICdhJztcclxuICB9XHJcblxyXG4gIGlzVXBkYXRlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9fdHJhY2thYmxlX18uc3RhdGUuY3VycmVudCA9PT0gJ3UnO1xyXG4gIH1cclxuXHJcbiAgaXNEZWxldGVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX190cmFja2FibGVfXy5zdGF0ZS5jdXJyZW50ID09PSAnZCc7XHJcbiAgfVxyXG5cclxuICAqL1xyXG5cclxuICBhc05vblRyYWNrYWJsZSgpIHtcclxuICAgIGxldCBvID0ge307XHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gdGhpcykge1xyXG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlKHRoaXNbcHJvcGVydHlOYW1lXSkpIHtcclxuICAgICAgICAgIG9bcHJvcGVydHlOYW1lXSA9IHRoaXNbcHJvcGVydHlOYW1lXS5hc05vblRyYWNrYWJsZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvW3Byb3BlcnR5TmFtZV0gPSB0aGlzW3Byb3BlcnR5TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvO1xyXG4gIH1cclxufVxyXG4iXX0=
