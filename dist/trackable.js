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
exports.remove = remove;
exports.stringId = stringId;
exports.isNullOrUndefined = isNullOrUndefined;
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

function isNullOrUndefined(o) {
  return o === null || o === undefined;
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

      // currently not supporting assigning a trackable object or array
      if (isTrackable(value)) {
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

      if (isNullOrUndefined(value)) {
        // 01. ASSIGN: null/undefined TO: null/undefined
        if (isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: null/undefined');
          //return;
        }

        // 02. ASSIGN: null/undefined TO: TrackableObject
        if (isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: TrackableObject');
          // TODO
          //return;
        }

        // 03. ASSIGN: null/undefined TO: TrackableArray
        if (isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: TrackableArray');
          // TODO
          //return;
        }

        // 04. ASSIGN: null/undefined TO: primitive type
        console.log('ASSIGN: null/undefined TO: primitive type');
        // TODO
        //return;
      }

      if (isObject(value)) {
        // 05. ASSIGN: Object TO: null/undefined
        if (isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: null/undefined');
          // TODO
          //return;
        }

        // 06. ASSIGN: Object TO: TrackableObject
        if (isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: TrackableObject');
          // TODO
          //return;
        }

        // 07. ASSIGN: Object TO: TrackableArray
        if (isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: TrackableArray');
          // TODO
          //return;
        }

        // 08. ASSIGN: Object TO: primitive type
        console.log('ASSIGN: Object TO: primitive type');
        // TODO
        //return;
      }

      if (isArray(value)) {
        // 09. ASSIGN: Array TO: null/undefined
        if (isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: null/undefined');
          // TODO
          //return;
        }

        // 10. ASSIGN: Array TO: TrackableObject
        if (isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: TrackableObject');
          // TODO
          //return;
        }

        // 11. ASSIGN: Array TO: TrackableArray
        if (isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: TrackableArray');
          // TODO
          //return;
        }

        // 12. ASSIGN: Array TO: primitive type
        console.log('ASSIGN: Array TO: primitive type');
        // TODO
        //return;
      }

      // 13. ASSIGN: primitive type TO: null/undefined
      if (isNullOrUndefined(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: null/undefined');
        // TODO
        //return;
      }

      // 14. ASSIGN: primitive type TO: TrackableObject
      if (isTrackableObject(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: TrackableObject');
        // TODO
        //return;
      }

      // 15. ASSIGN: primitive type TO: TrackableArray
      if (isTrackableArray(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: TrackableArray');
        // TODO
        //return;
      }

      // 16. ASSIGN: primitive type TO: primitive type
      console.log('ASSIGN: primitive type TO: primitive type');
      // TODO
      //return;

      /*********** TESTING *******************/
      var change = find(o._trackable.workspaces[0].changes, { property: name });

      if (change) {
        if (areEqual(change.original, value)) {
          remove(o._trackable.workspaces[0].changes, change);
        }
      } else {
        if (isTrackable(o._trackable.fields[name])) {
          var nonTrackableOriginal = o._trackable.fields[name].asNonTrackable();
          change = {
            property: name,
            original: o._trackable.fields[name]
          };
        } else {
          change = {
            property: name,
            original: o._trackable.fields[name]
          };
        }
        o._trackable.workspaces[0].changes.push(change);
      }

      if (isObject(value)) {
        o._trackable.fields[name] = new TrackableObject(value);
      } else if (isArray(value)) {
        o._trackable.fields[name] = new TrackableArray(value);
      } else {
        o._trackable.fields[name] = value;
      }

      evaluateTrackableObjectState(o);
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
      return !!this._trackable.workspaces[0].changes.length;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGhlbHBlcnMuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFx0cmFja2FibGUtYXJyYXkuanMiLCJzcmNcXHRyYWNrYWJsZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixRQUFRLEdBQVIsUUFBUTtRQUlSLFFBQVEsR0FBUixRQUFRO1FBSVIsT0FBTyxHQUFQLE9BQU87UUFJUCxXQUFXLEdBQVgsV0FBVztRQUlYLGlCQUFpQixHQUFqQixpQkFBaUI7UUFJakIsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQUloQixRQUFRLEdBQVIsUUFBUTtRQTRDUixJQUFJLEdBQUosSUFBSTtRQXFCSixNQUFNLEdBQU4sTUFBTTtRQUtOLFFBQVEsR0FBUixRQUFRO1FBVVIsaUJBQWlCLEdBQWpCLGlCQUFpQjtRQUlqQix3QkFBd0IsR0FBeEIsd0JBQXdCO1FBbUV4QiwwQkFBMEIsR0FBMUIsMEJBQTBCO1FBNk0xQiw0QkFBNEIsR0FBNUIsNEJBQTRCOzs7O0FBNVhyQyxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsU0FBTyxDQUFDLEdBQUUsQ0FBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzlCOztBQUVNLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUMxQixTQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxDQUFDO0NBQ3pFOztBQUVNLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRTtBQUN6QixTQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDO0NBQ3hFOztBQUVNLFNBQVMsV0FBVyxD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S0FDdkQ7Ozt3Q0FFbUI7QUFDbEIsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxRCxZQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDaEQsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7T0FDRjtLQUNGOzs7OENBRXlCLEVBQ3pCOzs7OENBRXlCLEVBQ3pCOzs7b0NBRWUsRUFDZjs7O29DQUVlLEVBQ2Y7OztxQ0FFZ0I7QUFDZixVQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxXQUFLLElBQUksWUFBWSxJQUFJLElBQUksRUFBRTtBQUM3QixZQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDckMsY0FBSSxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFO0FBQzNDLGFBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7V0FDdkQsTUFBTTtBQUNMLGFBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7V0FDckM7U0FDRjtPQUNGO0FBQ0QsYUFBTyxDQUFDLENBQUM7S0FDVjs7O1NBcEdVLGVBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzKG8pIHtcclxuICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKG8pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qobykge1xyXG4gIHJldHVybiBnZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnb2JqZWN0JztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkobykge1xyXG4gIHJldHVybiBnZXRDbGFzcyhvKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpID09PSAnYXJyYXknO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFja2FibGUobykge1xyXG4gIHJldHVybiAoaXNPYmplY3QobykgfHwgaXNBcnJheShvKSkgJiYgKG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3QgfHwgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJhY2thYmxlT2JqZWN0KG8pIHtcclxuICByZXR1cm4gKGlzT2JqZWN0KG8pIHx8IGlzQXJyYXkobykpICYmIG8gaW5zdGFuY2VvZiBUcmFja2FibGVPYmplY3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyYWNrYWJsZUFycmF5KG8pIHtcclxuICByZXR1cm4gKGlzT2JqZWN0KG8pIHx8IGlzQXJyYXkobykpICYmIG8gaW5zdGFuY2VvZiBUcmFja2FibGVBcnJheTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUVxdWFsKG8xLCBvMikge1xyXG4gIGxldCBwcm9wZXJ0eU5hbWU7XHJcblxyXG4gIGlmIChvMSA9PT0gbzIpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCEobzEgaW5zdGFuY2VvZiBPYmplY3QpIHx8ICEobzIgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAobzEuY29uc3RydWN0b3IgIT09IG8yLmNvbnN0cnVjdG9yKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmb3IgKHByb3BlcnR5TmFtZSBpbiBvMSkge1xyXG4gICAgaWYgKCFvMS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghbzIuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG8xW3Byb3BlcnR5TmFtZV0gPT09IG8yW3Byb3BlcnR5TmFtZV0pIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiAobzFbcHJvcGVydHlOYW1lXSkgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWFyZUVxdWFsKG8xW3Byb3BlcnR5TmFtZV0sIG8yW3Byb3BlcnR5TmFtZV0pKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvciAocHJvcGVydHlOYW1lIGluIG8yKSB7XHJcbiAgICBpZiAobzIuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSAmJiAhbzEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZChhLCBvKSB7XHJcbiAgbGV0IGkgPSBhLmxlbmd0aDtcclxuICB3aGlsZSAoaS0tKSB7XHJcbiAgICBsZXQgZm91bmQgPSB0cnVlO1xyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIG8pIHtcclxuICAgICAgaWYgKGFbaV0uaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGlmIChhW2ldW3Byb3BlcnR5TmFtZV0gPT09IG9bcHJvcGVydHlOYW1lXSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICByZXR1cm4gYVtpXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmUoYSwgbykge1xyXG4gIGxldCBpID0gYS5pbmRleE9mKG8pO1xyXG4gIGEuc3BsaWNlKGksIDEpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nSWQobGVuZ3RoID0gMTApIHtcclxuICBsZXQgY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODknLFxyXG4gICAgICByZXN1bHQgPSAnJztcclxuXHJcbiAgZm9yIChsZXQgaSA9IGxlbmd0aDsgaSA+IDA7IC0taSkge1xyXG4gICAgcmVzdWx0ICs9IGNoYXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJzLmxlbmd0aCldO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQobykge1xyXG4gIHJldHVybiBvID09PSBudWxsIHx8IG8gPT09IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYWNrYWJsZVN0cnVjdHVyZShvKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sICdfdHJhY2thYmxlJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2NvbmZpZ3VyYXRpb24nLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBpZiAoaXNPYmplY3QobykpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuY29uZmlndXJhdGlvbiwgJ2FkZFN0YXRlRGVmaW5pdGlvbicsIHtcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICB2YWx1ZToge31cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2V4dGVuc2lvbnMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiB7fVxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLCAnZmllbGRzJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ3N0YXRlJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5zdGF0ZSwgJ2N1cnJlbnQnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBudWxsXHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuc3RhdGUsICdvcmlnaW5hbCcsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IG51bGxcclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ3dvcmtzcGFjZXMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBbXVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhY2thYmxlT2JqZWN0RmllbGQobywgbmFtZSwgdmFsdWUpIHtcclxuICAvLyBjcmVhdGUgYmFja2luZyBmaWVsZFxyXG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuZmllbGRzLCBuYW1lLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHZhbHVlOiBuZXcgVHJhY2thYmxlT2JqZWN0KHZhbHVlKVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5maWVsZHMsIG5hbWUsIHtcclxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgdmFsdWU6IG5ldyBUcmFja2FibGVBcnJheSh2YWx1ZSlcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLmZpZWxkcywgbmFtZSwge1xyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB2YWx1ZTogdmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gY3JlYXRlIGdldHRlci9zZXR0ZXIgZm9yIGJhY2tpbmcgZmllbGRcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgbmFtZSwge1xyXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBvLl90cmFja2FibGUuZmllbGRzW25hbWVdXHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAvLyBpZiBhbHJlYWR5IGRlbGV0ZWQ7IGRvIG5vdCBhbGxvdyBtb3JlIGNoYW5nZXNcclxuICAgICAgaWYgKG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCcpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcignT25jZSBkZWxldGVkIGFsd2F5cyBkZWxldGVkLicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBjdXJyZW50bHkgbm90IHN1cHBvcnRpbmcgYXNzaWduaW5nIGEgdHJhY2thYmxlIG9iamVjdCBvciBhcnJheVxyXG4gICAgICBpZiAoaXNUcmFja2FibGUodmFsdWUpKSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBhc3NpbmcgVHJhY2thYmxlIG9iamVjdHMgb3IgYXJyYXlzLicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAwMS4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCAgIFRPOiBudWxsL3VuZGVmaW5lZFxyXG4gICAgICAvLyAwMi4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCAgIFRPOiBUcmFja2FibGVPYmplY3RcclxuICAgICAgLy8gMDMuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgICBUTzogVHJhY2thYmxlQXJyYXlcclxuICAgICAgLy8gMDQuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgICBUTzogcHJpbWl0aXZlIHR5cGVcclxuICAgICAgLy8gMDUuIEFTU0lHTjogT2JqZWN0ICAgICAgICAgICBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgLy8gMDYuIEFTU0lHTjogT2JqZWN0ICAgICAgICAgICBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgIC8vIDA3LiBBU1NJR046IE9iamVjdCAgICAgICAgICAgVE86IFRyYWNrYWJsZUFycmF5XHJcbiAgICAgIC8vIDA4LiBBU1NJR046IE9iamVjdCAgICAgICAgICAgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgIC8vIDA5LiBBU1NJR046IEFycmF5ICAgICAgICAgICAgVE86IG51bGwvdW5kZWZpbmVkXHJcbiAgICAgIC8vIDEwLiBBU1NJR046IEFycmF5ICAgICAgICAgICAgVE86IFRyYWNrYWJsZU9iamVjdFxyXG4gICAgICAvLyAxMS4gQVNTSUdOOiBBcnJheSAgICAgICAgICAgIFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAvLyAxMi4gQVNTSUdOOiBBcnJheSAgICAgICAgICAgIFRPOiBwcmltaXRpdmUgdHlwZVxyXG4gICAgICAvLyAxMy4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSAgIFRPOiBudWxsL3VuZGVmaW5lZFxyXG4gICAgICAvLyAxNC4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSAgIFRPOiBUcmFja2FibGVPYmplY3RcclxuICAgICAgLy8gMTUuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgICBUTzogVHJhY2thYmxlQXJyYXlcclxuICAgICAgLy8gMTYuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgICBUTzogcHJpbWl0aXZlIHR5cGVcclxuXHJcbiAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAvLyAwMS4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQoby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IG51bGwvdW5kZWZpbmVkIFRPOiBudWxsL3VuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAwMi4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgICAgaWYgKGlzVHJhY2thYmxlT2JqZWN0KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogVHJhY2thYmxlT2JqZWN0Jyk7XHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvL3JldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDAzLiBBU1NJR046IG51bGwvdW5kZWZpbmVkIFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAgIGlmIChpc1RyYWNrYWJsZUFycmF5KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogVHJhY2thYmxlQXJyYXknKTtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMDQuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogbnVsbC91bmRlZmluZWQgVE86IHByaW1pdGl2ZSB0eXBlJyk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgLy8gMDUuIEFTU0lHTjogT2JqZWN0IFRPOiBudWxsL3VuZGVmaW5lZFxyXG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZChvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogT2JqZWN0IFRPOiBudWxsL3VuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAwNi4gQVNTSUdOOiBPYmplY3QgVE86IFRyYWNrYWJsZU9iamVjdFxyXG4gICAgICAgIGlmIChpc1RyYWNrYWJsZU9iamVjdChvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogT2JqZWN0IFRPOiBUcmFja2FibGVPYmplY3QnKTtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMDcuIEFTU0lHTjogT2JqZWN0IFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAgIGlmIChpc1RyYWNrYWJsZUFycmF5KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBPYmplY3QgVE86IFRyYWNrYWJsZUFycmF5Jyk7XHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvL3JldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDA4LiBBU1NJR046IE9iamVjdCBUTzogcHJpbWl0aXZlIHR5cGVcclxuICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBPYmplY3QgVE86IHByaW1pdGl2ZSB0eXBlJyk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAvLyAwOS4gQVNTSUdOOiBBcnJheSBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQoby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IEFycmF5IFRPOiBudWxsL3VuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAxMC4gQVNTSUdOOiBBcnJheSBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgICAgaWYgKGlzVHJhY2thYmxlT2JqZWN0KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBBcnJheSBUTzogVHJhY2thYmxlT2JqZWN0Jyk7XHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvL3JldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDExLiBBU1NJR046IEFycmF5IFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAgIGlmIChpc1RyYWNrYWJsZUFycmF5KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBBcnJheSBUTzogVHJhY2thYmxlQXJyYXknKTtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMTIuIEFTU0lHTjogQXJyYXkgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogQXJyYXkgVE86IHByaW1pdGl2ZSB0eXBlJyk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAxMy4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IG51bGwvdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAxNC4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgIGlmIChpc1RyYWNrYWJsZU9iamVjdChvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBUcmFja2FibGVPYmplY3QnKTtcclxuICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIDE1LiBBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICBpZiAoaXNUcmFja2FibGVBcnJheShvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBUcmFja2FibGVBcnJheScpO1xyXG4gICAgICAgIC8vIFRPRE9cclxuICAgICAgICAvL3JldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gMTYuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBwcmltaXRpdmUgdHlwZScpO1xyXG4gICAgICAvLyBUT0RPXHJcbiAgICAgIC8vcmV0dXJuO1xyXG5cclxuICAgICAgLyoqKioqKioqKioqIFRFU1RJTkcgKioqKioqKioqKioqKioqKioqKi9cclxuICAgICAgbGV0IGNoYW5nZSA9IGZpbmQoby5fdHJhY2thYmxlLndvcmtzcGFjZXNbMF0uY2hhbmdlcywgeyBwcm9wZXJ0eTogbmFtZSB9KTtcclxuXHJcbiAgICAgIGlmIChjaGFuZ2UpIHtcclxuICAgICAgICBpZiAoYXJlRXF1YWwoY2hhbmdlLm9yaWdpbmFsLCB2YWx1ZSkpIHtcclxuICAgICAgICAgIHJlbW92ZShvLl90cmFja2FibGUud29ya3NwYWNlc1swXS5jaGFuZ2VzLCBjaGFuZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaXNUcmFja2FibGUoby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIHZhciBub25UcmFja2FibGVPcmlnaW5hbCA9IG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0uYXNOb25UcmFja2FibGUoKTtcclxuICAgICAgICAgIGNoYW5nZSA9IHtcclxuICAgICAgICAgICAgcHJvcGVydHk6IG5hbWUsXHJcbiAgICAgICAgICAgIG9yaWdpbmFsOiBvLl90cmFja2FibGUuZmllbGRzW25hbWVdXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjaGFuZ2UgPSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5OiBuYW1lLFxyXG4gICAgICAgICAgICBvcmlnaW5hbDogby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgby5fdHJhY2thYmxlLndvcmtzcGFjZXNbMF0uY2hhbmdlcy5wdXNoKGNoYW5nZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICBvLl90cmFja2FibGUuZmllbGRzW25hbWVdID0gbmV3IFRyYWNrYWJsZU9iamVjdCh2YWx1ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICBvLl90cmFja2FibGUuZmllbGRzW25hbWVdID0gbmV3IFRyYWNrYWJsZUFycmF5KHZhbHVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvLl90cmFja2FibGUuZmllbGRzW25hbWVdID0gdmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV2YWx1YXRlVHJhY2thYmxlT2JqZWN0U3RhdGUobyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBldmFsdWF0ZVRyYWNrYWJsZU9iamVjdFN0YXRlKG8pIHtcclxuICAvLyBjaGVjayBpZiBkZWxldGVkXHJcbiAgaWYgKG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCcpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIGlmIGFkZGVkXHJcbiAgaWYgKE9iamVjdC5rZXlzKG8uX3RyYWNrYWJsZS5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbikubGVuZ3RoKSB7XHJcbiAgICBsZXQgaXNBZGRlZCA9IHRydWU7XHJcblxyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIG8uX3RyYWNrYWJsZS5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbikge1xyXG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgaWYgKG8uX3RyYWNrYWJsZS5jb25maWd1cmF0aW9uLmFkZFN0YXRlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVdICE9PSBvW3Byb3BlcnR5TmFtZV0pIHtcclxuICAgICAgICAgIGlzQWRkZWQgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpc0FkZGVkID0gZmFsc2U7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNBZGRlZCkge1xyXG4gICAgICBvLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9ICdhJztcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgaWYgdXBkYXRlZFxyXG4gIGxldCBpc1VwZGF0ZWQgPSBmYWxzZSxcclxuICAgICAgdyA9IG8uX3RyYWNrYWJsZS53b3Jrc3BhY2VzLmxlbmd0aDtcclxuXHJcbiAgd2hpbGUgKHctLSkge1xyXG4gICAgaWYgKG8uX3RyYWNrYWJsZS53b3Jrc3BhY2VzW3ddLmNoYW5nZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBpc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChpc1VwZGF0ZWQpIHtcclxuICAgIG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID0gJ3UnO1xyXG4gICAgcmV0dXJuO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9ICdwJztcclxuICAgIHJldHVybjtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtUcmFja2FibGVPYmplY3R9IGZyb20gJy4vdHJhY2thYmxlLW9iamVjdCdcclxuaW1wb3J0IHtUcmFja2FibGVBcnJheX0gZnJvbSAnLi90cmFja2FibGUtYXJyYXknXHJcblxyXG53aW5kb3cuVHJhY2thYmxlT2JqZWN0ID0gVHJhY2thYmxlT2JqZWN0O1xyXG53aW5kb3cuVHJhY2thYmxlQXJyYXkgPSBUcmFja2FibGVBcnJheTtcclxuIiwiaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXHJcblxyXG5leHBvcnQgY2xhc3MgVHJhY2thYmxlQXJyYXkge1xyXG4gIGNvbnN0cnVjdG9yKG8pIHtcclxuICAgIGlmIChIZWxwZXJzLmlzVHJhY2thYmxlKG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJhY2tlcnMgZG8gbm90IGxpa2UgdG8gYmUgdHJhY2tlZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUhlbHBlcnMuaXNBcnJheShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYW4gQXJyYXkgY2FuIGxlYXJuIGhvdyB0byB0cmFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICBIZWxwZXJzLmNyZWF0ZVRyYWNrYWJsZVN0cnVjdHVyZSh0aGlzKTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gbykge1xyXG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgbGV0IHByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICBpZiAocHJvcGVydHlEZXNjcmlwdG9yLndyaXRhYmxlICYmIHByb3BlcnR5RGVzY3JpcHRvci5jb25maWd1cmFibGUpIHtcclxuICAgICAgICAgIEhlbHBlcnMuY3JlYXRlVHJhY2thYmxlT2JqZWN0RmllbGQodGhpcywgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eURlc2NyaXB0b3IudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubmV3VW5pdE9mV29yaygpO1xyXG4gIH1cclxuXHJcbiAgbmV3VW5pdE9mV29yaygpIHtcclxuICAgIGxldCB3b3Jrc3BhY2UgPSB7XHJcbiAgICAgIGNoYW5nZXM6IFtdLFxyXG4gICAgICBpZDogSGVscGVycy5zdHJpbmdJZCgpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuX3RyYWNrYWJsZS53b3Jrc3BhY2VzLnVuc2hpZnQod29ya3NwYWNlKTtcclxuICB9XHJcblxyXG4gIGhhc0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICBoYXNQZW5kaW5nQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIGFjY2VwdFVuaXRPZldvcmtDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgcmVqZWN0VW5pdE9mV29ya0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICB1bmRvQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIGFzTm9uVHJhY2thYmxlKCkge1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFja2FibGVPYmplY3Qge1xyXG4gIGNvbnN0cnVjdG9yKG8sIGFkZFN0YXRlRGVmaW5pdGlvbikge1xyXG4gICAgaWYgKEhlbHBlcnMuaXNUcmFja2FibGUobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VycyBkbyBub3QgbGlrZSB0byBiZSB0cmFja2VkLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghSGVscGVycy5pc09iamVjdChvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYW4gT2JqZWN0IGNhbiBsZWFybiBob3cgdG8gdHJhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgSGVscGVycy5jcmVhdGVUcmFja2FibGVTdHJ1Y3R1cmUodGhpcyk7XHJcblxyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIG8pIHtcclxuICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGxldCBwcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3BlcnR5TmFtZSk7XHJcblxyXG4gICAgICAgIGlmIChwcm9wZXJ0eURlc2NyaXB0b3Iud3JpdGFibGUgJiYgcHJvcGVydHlEZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkge1xyXG4gICAgICAgICAgSGVscGVycy5jcmVhdGVUcmFja2FibGVPYmplY3RGaWVsZCh0aGlzLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5RGVzY3JpcHRvci52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSGVscGVycy5ldmFsdWF0ZVRyYWNrYWJsZU9iamVjdFN0YXRlKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5vcmlnaW5hbCA9IHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50O1xyXG5cclxuICAgIHRoaXMubmV3VW5pdE9mV29yaygpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGUoKSB7XHJcbiAgICBzd2l0Y2ggKHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50KSB7XHJcbiAgICAgIGNhc2UgJ3AnOiByZXR1cm4gJ3ByaXN0aW5lJztcclxuICAgICAgY2FzZSAnYSc6IHJldHVybiAnYWRkZWQnO1xyXG4gICAgICBjYXNlICd1JzogcmV0dXJuICd1cGRhdGVkJztcclxuICAgICAgY2FzZSAnZCc6IHJldHVybiAnZGVsZXRlZCc7XHJcbiAgICAgIGRlZmF1bHQ6ICB0aHJvdyBuZXcgRXJyb3IoJ1RyYWNrYWJsZSBPYmplY3QgaGFzIGFuIHVua25vd24gc3RhdGUuJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc1ByaXN0aW5lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAncCc7XHJcbiAgfVxyXG5cclxuICBpc0FkZGVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnYSc7XHJcbiAgfVxyXG5cclxuICBpc1VwZGF0ZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICd1JztcclxuICB9XHJcblxyXG4gIGlzRGVsZXRlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9PT0gJ2QnO1xyXG4gIH1cclxuXHJcbiAgbmV3VW5pdE9mV29yaygpIHtcclxuICAgIGxldCB3b3Jrc3BhY2UgPSB7XHJcbiAgICAgIGNoYW5nZXM6IFtdLFxyXG4gICAgICBpZDogSGVscGVycy5zdHJpbmdJZCgpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuX3RyYWNrYWJsZS53b3Jrc3BhY2VzLnVuc2hpZnQod29ya3NwYWNlKTtcclxuICB9XHJcblxyXG4gIGhhc0NoYW5nZXMoKSB7XHJcbiAgICByZXR1cm4gISF0aGlzLl90cmFja2FibGUud29ya3NwYWNlc1swXS5jaGFuZ2VzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGhhc1BlbmRpbmdDaGFuZ2VzKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLl90cmFja2FibGUud29ya3NwYWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5fdHJhY2thYmxlLndvcmtzcGFjZXNbaV0uY2hhbmdlcy5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWNjZXB0VW5pdE9mV29ya0NoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICByZWplY3RVbml0T2ZXb3JrQ2hhbmdlcygpIHtcclxuICB9XHJcblxyXG4gIGFjY2VwdENoYW5nZXMoKSB7XHJcbiAgfVxyXG5cclxuICByZWplY3RDaGFuZ2VzKCkge1xyXG4gIH1cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgICBsZXQgbyA9IHt9O1xyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIHRoaXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGlmIChIZWxwZXJzLmlzVHJhY2thYmxlKHRoaXNbcHJvcGVydHlOYW1lXSkpIHtcclxuICAgICAgICAgIG9bcHJvcGVydHlOYW1lXSA9IHRoaXNbcHJvcGVydHlOYW1lXS5hc05vblRyYWNrYWJsZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvW3Byb3BlcnR5TmFtZV0gPSB0aGlzW3Byb3BlcnR5TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvO1xyXG4gIH1cclxufVxyXG4iXX0=
