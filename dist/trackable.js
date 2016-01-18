(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var EventTypes = exports.EventTypes = {
  0: 'SNAPSHOT',
  1: 'UPDATE'
};

},{}],2:[function(require,module,exports){
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
exports.isNullOrUndefined = isNullOrUndefined;
exports.areEqual = areEqual;
exports.find = find;
exports.remove = remove;
exports.stringId = stringId;

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

},{}],3:[function(require,module,exports){
'use strict';

var _trackableObject = require('./trackable-object');

var _trackableArray = require('./trackable-array');

window.TrackableObject = _trackableObject.TrackableObject;
window.TrackableArray = _trackableArray.TrackableArray;

},{"./trackable-array":4,"./trackable-object":6}],4:[function(require,module,exports){
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
    key: 'asNonTrackable',
    value: function asNonTrackable() {}
  }]);

  return TrackableArray;
})();

},{"./generic-helpers":2}],5:[function(require,module,exports){
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

  if (GenericHelpers.isObject(o)) {
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

  Object.defineProperty(o._trackable, 'events', {
    enumerable: false,
    writable: true,
    configurable: false,
    value: []
  });
}

function createField(o, name, value) {
  // create backing field
  if (GenericHelpers.isObject(value)) {
    Object.defineProperty(o._trackable.fields, name, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: new TrackableObject(value)
    });
  } else if (GenericHelpers.isArray(value)) {
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
        if (GenericHelpers.isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: null/undefined');
          //return;
        }

        // 02. ASSIGN: null/undefined TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: TrackableObject');
          // TODO
          //return;
        }

        // 03. ASSIGN: null/undefined TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: null/undefined TO: TrackableArray');
          // TODO
          //return;
        }

        // 04. ASSIGN: null/undefined TO: primitive type
        console.log('ASSIGN: null/undefined TO: primitive type');
        // TODO
        //return;
      }

      if (GenericHelpers.isObject(value)) {
        // 05. ASSIGN: Object TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: null/undefined');
          // TODO
          //return;
        }

        // 06. ASSIGN: Object TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: TrackableObject');
          // TODO
          //return;
        }

        // 07. ASSIGN: Object TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o._trackable.fields[name])) {
          console.log('ASSIGN: Object TO: TrackableArray');
          // TODO
          //return;
        }

        // 08. ASSIGN: Object TO: primitive type
        console.log('ASSIGN: Object TO: primitive type');
        // TODO
        //return;
      }

      if (GenericHelpers.isArray(value)) {
        // 09. ASSIGN: Array TO: null/undefined
        if (GenericHelpers.isNullOrUndefined(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: null/undefined');
          // TODO
          //return;
        }

        // 10. ASSIGN: Array TO: TrackableObject
        if (GenericHelpers.isTrackableObject(o._trackable.fields[name])) {
          console.log('ASSIGN: Array TO: TrackableObject');
          // TODO
          //return;
        }

        // 11. ASSIGN: Array TO: TrackableArray
        if (GenericHelpers.isTrackableArray(o._trackable.fields[name])) {
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
      if (GenericHelpers.isNullOrUndefined(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: null/undefined');
        // TODO
        //return;
      }

      // 14. ASSIGN: primitive type TO: TrackableObject
      if (GenericHelpers.isTrackableObject(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: TrackableObject');
        // TODO
        //return;
      }

      // 15. ASSIGN: primitive type TO: TrackableArray
      if (GenericHelpers.isTrackableArray(o._trackable.fields[name])) {
        console.log('ASSIGN: primitive type TO: TrackableArray');
        // TODO
        //return;
      }

      // 16. ASSIGN: primitive type TO: primitive type
      console.log('ASSIGN: primitive type TO: primitive type');
      // TODO
      //return;

      /*********** TESTING *******************/
      var changeEvent = GenericHelpers.find(o._trackable.snapshots[0].events, { property: name });

      if (changeEvent) {
        if (GenericHelpers.areEqual(changeEvent.original, value)) {
          GenericHelpers.remove(o._trackable.snapshots[0].events, changeEvent);
        }
      } else {
        if (GenericHelpers.isTrackable(o._trackable.fields[name])) {
          var nonTrackableOriginal = o._trackable.fields[name].asNonTrackable();
          changeEvent = {
            property: name,
            original: o._trackable.fields[name]
          };
        } else {
          changeEvent = {
            property: name,
            original: o._trackable.fields[name]
          };
        }
        o._trackable.snapshots[0].events.push(changeEvent);
      }

      if (GenericHelpers.isObject(value)) {
        o._trackable.fields[name] = new TrackableObject(value);
      } else if (GenericHelpers.isArray(value)) {
        o._trackable.fields[name] = new TrackableArray(value);
      } else {
        o._trackable.fields[name] = value;
      }

      evaluateTrackableObjectState(o);
    }
  });
}

function evaluateState(o) {
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
      w = o._trackable.snapshots.length;

  while (w--) {
    if (o._trackable.snapshots[w].events.length > 0) {
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

},{"./generic-helpers":2}],6:[function(require,module,exports){
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

var _eventTypes = require('./event-types');

var _eventTypes2 = _interopRequireDefault(_eventTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  /*
    state() {
    switch (this._trackable.state.current) {
      case 'p': return 'pristine';
      case 'a': return 'added';
      case 'u': return 'updated';
      case 'd': return 'deleted';
      default:  throw new Error('Trackable Object has an unknown state.');
    }
  }
    isPristine() {
    return this._trackable.state.current === 'p';
  }
    isAdded() {
    return this._trackable.state.current === 'a';
  }
    isUpdated() {
    return this._trackable.state.current === 'u';
  }
    isDeleted() {
    return this._trackable.state.current === 'd';
  }
    snapshot() {
    this.localSnapshot();
      for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (GenericHelpers.isTrackable(this._trackable.fields[propertyName])) {
          this._trackable.fields[propertyName].snapshot();
        }
      }
    }
      return this;
  }
    localSnapshot() {
    if (this._trackable.snapshots[0].events.length) {
      let snapshot = {
        events: [],
        id: GenericHelpers.stringId()
      };
      this._trackable.snapshots.unshift(snapshot);
    }
    return this;
  }
    hasChanges() {
    let hasLocalChanges = this.hasLocalChanges();
    if (hasLocalChanges) {
      return true;
    }
      for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (GenericHelpers.isTrackable(this._trackable.fields[propertyName])) {
          let hasChanges = this._trackable.fields[propertyName].hasChanges();
          if (hasChanges) {
            return true;
          }
        }
      }
    }
      return false;
  }
    hasSnapshotChanges() {
    let hasLocalSnapshotChanges = this.hasLocalSnapshotChanges();
    if (hasLocalSnapshotChanges) {
      return true;
    }
      for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (GenericHelpers.isTrackable(this._trackable.fields[propertyName])) {
          let hasSnapshotChanges = this._trackable.fields[propertyName].hasSnapshotChanges();
          if (hasSnapshotChanges) {
            return true;
          }
        }
      }
    }
      return false;
  }
    hasLocalChanges() {
    let s = this._trackable.snapshots.length;
    while (s--) {
      if (this._trackable.snapshots[s].events.length) {
        return true;
      }
    }
    return false;
  }
    hasLocalSnapshotChanges() {
    if (this._trackable.snapshots[0].events.length) {
      return true;
    }
    return false;
  }
    rejectChanges() {
    // TODO
    return this;
  }
    rejectSnapshotChanges() {
    let e = this._trackable.snapshots[0].events.length;
    while (e--) {
      }
    return this;
  }
    rejectLocalChanges() {
    // TODO
    return this;
  }
    rejectLocalSnapshotChanges() {
    // TODO
    return this;
  }
    acceptChanges() {
    // TODO
    return this;
  }
    acceptSnapshotChanges() {
    // TODO
    return this;
  }
    acceptLocalChanges() {
    // TODO
    return this;
  }
    acceptLocalSnapshotChanges() {
    // TODO
    return this;
  }
    */

  _createClass(TrackableObject, [{
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

},{"./event-types":1,"./generic-helpers":2,"./trackable-helpers":5}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGV2ZW50LXR5cGVzLmpzIiwic3JjXFxnZW5lcmljLWhlbHBlcnMuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFx0cmFja2FibGUtYXJyYXkuanMiLCJzcmNcXHRyYWNrYWJsZS1oZWxwZXJzLmpzIiwic3JjXFx0cmFja2FibGUtb2JqZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBTyxJQUFNLFVBQVUsV0FBVixVQUFVLEdBQUc7QUFDeEIsR0FBQyxFQUFFLFVBQVU7QUFDYixHQUFDLEVBQUUsUUFBUTtDQUNaLENBQUM7Ozs7Ozs7O1FDSGMsUUFBUSxHQUFSLFFBQVE7UUFJUixRQUFRLEdBQVIsUUFBUTtRQUlSLE9BQU8sR0FBUCxPQUFPO1FBSVAsV0FBVyxHQUFYLFdBQVc7UUFJWCxpQkFBaUIsR0FBakIsaUJBQWlCO1FBSWpCLGdCQUFnQixHQUFoQixnQkFBZ0I7UUFJaEIsaUJBQWlCLEdBQWpCLGlCQUFpQjtRQUlqQixRQUFRLEdBQVIsUUFBUTtRQTRDUixJQUFJLEdBQUosSUFBSTtRQXFCSixNQUFNLEdBQU4sTUFBTTtRQUtOLFFBQVEsR0FBUixRQUFROzs7O0FBbEdqQixTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsU0FBTyxDQUFDLEdBQUUsQ0FBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzlCOztBQUVNLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUMxQixTQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxDQUFDO0NBQ3pFOztBQUVNLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRTtBQUN6QixTQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENB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QUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFO0FBQ2xELGFBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7V0FDdkQsTUFBTTtBQUNMLGFBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7V0FDckM7U0FDRjtPQUNGO0FBQ0QsYUFBTyxDQUFDLENBQUM7S0FDVjs7O1NBL0xVLGVBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGNvbnN0IEV2ZW50VHlwZXMgPSB7XHJcbiAgMDogJ1NOQVBTSE9UJyxcclxuICAxOiAnVVBEQVRFJ1xyXG59O1xyXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3Mobykge1xyXG4gIHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwobyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvKSB7XHJcbiAgcmV0dXJuIGdldENsYXNzKG8pLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCkgPT09ICdvYmplY3QnO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShvKSB7XHJcbiAgcmV0dXJuIGdldENsYXNzKG8pLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCkgPT09ICdhcnJheSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RyYWNrYWJsZShvKSB7XHJcbiAgcmV0dXJuIChpc09iamVjdChvKSB8fCBpc0FycmF5KG8pKSAmJiAobyBpbnN0YW5jZW9mIFRyYWNrYWJsZU9iamVjdCB8fCBvIGluc3RhbmNlb2YgVHJhY2thYmxlQXJyYXkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFja2FibGVPYmplY3Qobykge1xyXG4gIHJldHVybiAoaXNPYmplY3QobykgfHwgaXNBcnJheShvKSkgJiYgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZU9iamVjdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJhY2thYmxlQXJyYXkobykge1xyXG4gIHJldHVybiAoaXNPYmplY3QobykgfHwgaXNBcnJheShvKSkgJiYgbyBpbnN0YW5jZW9mIFRyYWNrYWJsZUFycmF5O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQobykge1xyXG4gIHJldHVybiBvID09PSBudWxsIHx8IG8gPT09IHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFyZUVxdWFsKG8xLCBvMikge1xyXG4gIGxldCBwcm9wZXJ0eU5hbWU7XHJcblxyXG4gIGlmIChvMSA9PT0gbzIpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCEobzEgaW5zdGFuY2VvZiBPYmplY3QpIHx8ICEobzIgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAobzEuY29uc3RydWN0b3IgIT09IG8yLmNvbnN0cnVjdG9yKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmb3IgKHByb3BlcnR5TmFtZSBpbiBvMSkge1xyXG4gICAgaWYgKCFvMS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghbzIuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG8xW3Byb3BlcnR5TmFtZV0gPT09IG8yW3Byb3BlcnR5TmFtZV0pIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiAobzFbcHJvcGVydHlOYW1lXSkgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWFyZUVxdWFsKG8xW3Byb3BlcnR5TmFtZV0sIG8yW3Byb3BlcnR5TmFtZV0pKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvciAocHJvcGVydHlOYW1lIGluIG8yKSB7XHJcbiAgICBpZiAobzIuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSAmJiAhbzEuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZChhLCBvKSB7XHJcbiAgbGV0IGkgPSBhLmxlbmd0aDtcclxuICB3aGlsZSAoaS0tKSB7XHJcbiAgICBsZXQgZm91bmQgPSB0cnVlO1xyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIG8pIHtcclxuICAgICAgaWYgKGFbaV0uaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGlmIChhW2ldW3Byb3BlcnR5TmFtZV0gPT09IG9bcHJvcGVydHlOYW1lXSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICByZXR1cm4gYVtpXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmUoYSwgbykge1xyXG4gIGxldCBpID0gYS5pbmRleE9mKG8pO1xyXG4gIGEuc3BsaWNlKGksIDEpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nSWQobGVuZ3RoID0gMTApIHtcclxuICBsZXQgY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODknLFxyXG4gICAgICByZXN1bHQgPSAnJztcclxuXHJcbiAgZm9yIChsZXQgaSA9IGxlbmd0aDsgaSA+IDA7IC0taSkge1xyXG4gICAgcmVzdWx0ICs9IGNoYXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJzLmxlbmd0aCldO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiIsImltcG9ydCB7VHJhY2thYmxlT2JqZWN0fSBmcm9tICcuL3RyYWNrYWJsZS1vYmplY3QnXHJcbmltcG9ydCB7VHJhY2thYmxlQXJyYXl9IGZyb20gJy4vdHJhY2thYmxlLWFycmF5J1xyXG5cclxud2luZG93LlRyYWNrYWJsZU9iamVjdCA9IFRyYWNrYWJsZU9iamVjdDtcclxud2luZG93LlRyYWNrYWJsZUFycmF5ID0gVHJhY2thYmxlQXJyYXk7XHJcbiIsImltcG9ydCAqIGFzIEdlbmVyaWNIZWxwZXJzIGZyb20gJy4vZ2VuZXJpYy1oZWxwZXJzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYWNrYWJsZUFycmF5IHtcclxuICBjb25zdHJ1Y3RvcihvKSB7XHJcbiAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNUcmFja2FibGUobykpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFja2VycyBkbyBub3QgbGlrZSB0byBiZSB0cmFja2VkLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghR2VuZXJpY0hlbHBlcnMuaXNBcnJheShvKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYW4gQXJyYXkgY2FuIGxlYXJuIGhvdyB0byB0cmFjay4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzTm9uVHJhY2thYmxlKCkge1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBHZW5lcmljSGVscGVycyBmcm9tICcuL2dlbmVyaWMtaGVscGVycydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdHJ1Y3R1cmUobykge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCAnX3RyYWNrYWJsZScsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUsICdjb25maWd1cmF0aW9uJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzT2JqZWN0KG8pKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLmNvbmZpZ3VyYXRpb24sICdhZGRTdGF0ZURlZmluaXRpb24nLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IHt9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUsICdleHRlbnNpb25zJywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZToge31cclxuICB9KTtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZSwgJ2ZpZWxkcycsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUsICdzdGF0ZScsIHtcclxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgdmFsdWU6IHt9XHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuc3RhdGUsICdjdXJyZW50Jywge1xyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB2YWx1ZTogbnVsbFxyXG4gIH0pO1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLnN0YXRlLCAnb3JpZ2luYWwnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBudWxsXHJcbiAgfSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUsICdldmVudHMnLCB7XHJcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIHZhbHVlOiBbXVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmllbGQobywgbmFtZSwgdmFsdWUpIHtcclxuICAvLyBjcmVhdGUgYmFja2luZyBmaWVsZFxyXG4gIGlmIChHZW5lcmljSGVscGVycy5pc09iamVjdCh2YWx1ZSkpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLl90cmFja2FibGUuZmllbGRzLCBuYW1lLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHZhbHVlOiBuZXcgVHJhY2thYmxlT2JqZWN0KHZhbHVlKVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIGlmIChHZW5lcmljSGVscGVycy5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8uX3RyYWNrYWJsZS5maWVsZHMsIG5hbWUsIHtcclxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgdmFsdWU6IG5ldyBUcmFja2FibGVBcnJheSh2YWx1ZSlcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoby5fdHJhY2thYmxlLmZpZWxkcywgbmFtZSwge1xyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB2YWx1ZTogdmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gY3JlYXRlIGdldHRlci9zZXR0ZXIgZm9yIGJhY2tpbmcgZmllbGRcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgbmFtZSwge1xyXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBvLl90cmFja2FibGUuZmllbGRzW25hbWVdXHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAvLyBpZiBhbHJlYWR5IGRlbGV0ZWQ7IGRvIG5vdCBhbGxvdyBtb3JlIGNoYW5nZXNcclxuICAgICAgaWYgKG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCcpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcignT25jZSBkZWxldGVkIGFsd2F5cyBkZWxldGVkLicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBjdXJyZW50bHkgbm90IHN1cHBvcnRpbmcgYXNzaWduaW5nIGEgdHJhY2thYmxlIG9iamVjdCBvciBhcnJheVxyXG4gICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNUcmFja2FibGUodmFsdWUpKSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBhc3NpbmcgVHJhY2thYmxlIG9iamVjdHMgb3IgYXJyYXlzLicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAwMS4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCAgIFRPOiBudWxsL3VuZGVmaW5lZFxyXG4gICAgICAvLyAwMi4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCAgIFRPOiBUcmFja2FibGVPYmplY3RcclxuICAgICAgLy8gMDMuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgICBUTzogVHJhY2thYmxlQXJyYXlcclxuICAgICAgLy8gMDQuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgICBUTzogcHJpbWl0aXZlIHR5cGVcclxuICAgICAgLy8gMDUuIEFTU0lHTjogT2JqZWN0ICAgICAgICAgICBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgLy8gMDYuIEFTU0lHTjogT2JqZWN0ICAgICAgICAgICBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgIC8vIDA3LiBBU1NJR046IE9iamVjdCAgICAgICAgICAgVE86IFRyYWNrYWJsZUFycmF5XHJcbiAgICAgIC8vIDA4LiBBU1NJR046IE9iamVjdCAgICAgICAgICAgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgIC8vIDA5LiBBU1NJR046IEFycmF5ICAgICAgICAgICAgVE86IG51bGwvdW5kZWZpbmVkXHJcbiAgICAgIC8vIDEwLiBBU1NJR046IEFycmF5ICAgICAgICAgICAgVE86IFRyYWNrYWJsZU9iamVjdFxyXG4gICAgICAvLyAxMS4gQVNTSUdOOiBBcnJheSAgICAgICAgICAgIFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAvLyAxMi4gQVNTSUdOOiBBcnJheSAgICAgICAgICAgIFRPOiBwcmltaXRpdmUgdHlwZVxyXG4gICAgICAvLyAxMy4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSAgIFRPOiBudWxsL3VuZGVmaW5lZFxyXG4gICAgICAvLyAxNC4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSAgIFRPOiBUcmFja2FibGVPYmplY3RcclxuICAgICAgLy8gMTUuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgICBUTzogVHJhY2thYmxlQXJyYXlcclxuICAgICAgLy8gMTYuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgICBUTzogcHJpbWl0aXZlIHR5cGVcclxuXHJcbiAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAvLyAwMS4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNOdWxsT3JVbmRlZmluZWQoby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IG51bGwvdW5kZWZpbmVkIFRPOiBudWxsL3VuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAwMi4gQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlT2JqZWN0KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogVHJhY2thYmxlT2JqZWN0Jyk7XHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvL3JldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDAzLiBBU1NJR046IG51bGwvdW5kZWZpbmVkIFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZUFycmF5KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBudWxsL3VuZGVmaW5lZCBUTzogVHJhY2thYmxlQXJyYXknKTtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMDQuIEFTU0lHTjogbnVsbC91bmRlZmluZWQgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogbnVsbC91bmRlZmluZWQgVE86IHByaW1pdGl2ZSB0eXBlJyk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNPYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgLy8gMDUuIEFTU0lHTjogT2JqZWN0IFRPOiBudWxsL3VuZGVmaW5lZFxyXG4gICAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc051bGxPclVuZGVmaW5lZChvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogT2JqZWN0IFRPOiBudWxsL3VuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAwNi4gQVNTSUdOOiBPYmplY3QgVE86IFRyYWNrYWJsZU9iamVjdFxyXG4gICAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZU9iamVjdChvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogT2JqZWN0IFRPOiBUcmFja2FibGVPYmplY3QnKTtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMDcuIEFTU0lHTjogT2JqZWN0IFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZUFycmF5KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBPYmplY3QgVE86IFRyYWNrYWJsZUFycmF5Jyk7XHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvL3JldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDA4LiBBU1NJR046IE9iamVjdCBUTzogcHJpbWl0aXZlIHR5cGVcclxuICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBPYmplY3QgVE86IHByaW1pdGl2ZSB0eXBlJyk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAvLyAwOS4gQVNTSUdOOiBBcnJheSBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNOdWxsT3JVbmRlZmluZWQoby5fdHJhY2thYmxlLmZpZWxkc1tuYW1lXSkpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IEFycmF5IFRPOiBudWxsL3VuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAxMC4gQVNTSUdOOiBBcnJheSBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlT2JqZWN0KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBBcnJheSBUTzogVHJhY2thYmxlT2JqZWN0Jyk7XHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvL3JldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDExLiBBU1NJR046IEFycmF5IFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZUFycmF5KG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQVNTSUdOOiBBcnJheSBUTzogVHJhY2thYmxlQXJyYXknKTtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMTIuIEFTU0lHTjogQXJyYXkgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogQXJyYXkgVE86IHByaW1pdGl2ZSB0eXBlJyk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAxMy4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSBUTzogbnVsbC91bmRlZmluZWRcclxuICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzTnVsbE9yVW5kZWZpbmVkKG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0FTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IG51bGwvdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAxNC4gQVNTSUdOOiBwcmltaXRpdmUgdHlwZSBUTzogVHJhY2thYmxlT2JqZWN0XHJcbiAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZU9iamVjdChvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBUcmFja2FibGVPYmplY3QnKTtcclxuICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIDE1LiBBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBUcmFja2FibGVBcnJheVxyXG4gICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNUcmFja2FibGVBcnJheShvLl90cmFja2FibGUuZmllbGRzW25hbWVdKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBUcmFja2FibGVBcnJheScpO1xyXG4gICAgICAgIC8vIFRPRE9cclxuICAgICAgICAvL3JldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gMTYuIEFTU0lHTjogcHJpbWl0aXZlIHR5cGUgVE86IHByaW1pdGl2ZSB0eXBlXHJcbiAgICAgIGNvbnNvbGUubG9nKCdBU1NJR046IHByaW1pdGl2ZSB0eXBlIFRPOiBwcmltaXRpdmUgdHlwZScpO1xyXG4gICAgICAvLyBUT0RPXHJcbiAgICAgIC8vcmV0dXJuO1xyXG5cclxuICAgICAgLyoqKioqKioqKioqIFRFU1RJTkcgKioqKioqKioqKioqKioqKioqKi9cclxuICAgICAgbGV0IGNoYW5nZUV2ZW50ID0gR2VuZXJpY0hlbHBlcnMuZmluZChvLl90cmFja2FibGUuc25hcHNob3RzWzBdLmV2ZW50cywgeyBwcm9wZXJ0eTogbmFtZSB9KTtcclxuXHJcbiAgICAgIGlmIChjaGFuZ2VFdmVudCkge1xyXG4gICAgICAgIGlmIChHZW5lcmljSGVscGVycy5hcmVFcXVhbChjaGFuZ2VFdmVudC5vcmlnaW5hbCwgdmFsdWUpKSB7XHJcbiAgICAgICAgICBHZW5lcmljSGVscGVycy5yZW1vdmUoby5fdHJhY2thYmxlLnNuYXBzaG90c1swXS5ldmVudHMsIGNoYW5nZUV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlKG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0pKSB7XHJcbiAgICAgICAgICB2YXIgbm9uVHJhY2thYmxlT3JpZ2luYWwgPSBvLl90cmFja2FibGUuZmllbGRzW25hbWVdLmFzTm9uVHJhY2thYmxlKCk7XHJcbiAgICAgICAgICBjaGFuZ2VFdmVudCA9IHtcclxuICAgICAgICAgICAgcHJvcGVydHk6IG5hbWUsXHJcbiAgICAgICAgICAgIG9yaWdpbmFsOiBvLl90cmFja2FibGUuZmllbGRzW25hbWVdXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjaGFuZ2VFdmVudCA9IHtcclxuICAgICAgICAgICAgcHJvcGVydHk6IG5hbWUsXHJcbiAgICAgICAgICAgIG9yaWdpbmFsOiBvLl90cmFja2FibGUuZmllbGRzW25hbWVdXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBvLl90cmFja2FibGUuc25hcHNob3RzWzBdLmV2ZW50cy5wdXNoKGNoYW5nZUV2ZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzT2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICAgIG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0gPSBuZXcgVHJhY2thYmxlT2JqZWN0KHZhbHVlKTtcclxuICAgICAgfSBlbHNlIGlmIChHZW5lcmljSGVscGVycy5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgIG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0gPSBuZXcgVHJhY2thYmxlQXJyYXkodmFsdWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG8uX3RyYWNrYWJsZS5maWVsZHNbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZXZhbHVhdGVUcmFja2FibGVPYmplY3RTdGF0ZShvKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV2YWx1YXRlU3RhdGUobykge1xyXG4gIC8vIGNoZWNrIGlmIGRlbGV0ZWRcclxuICBpZiAoby5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdkJykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgaWYgYWRkZWRcclxuICBpZiAoT2JqZWN0LmtleXMoby5fdHJhY2thYmxlLmNvbmZpZ3VyYXRpb24uYWRkU3RhdGVEZWZpbml0aW9uKS5sZW5ndGgpIHtcclxuICAgIGxldCBpc0FkZGVkID0gdHJ1ZTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gby5fdHJhY2thYmxlLmNvbmZpZ3VyYXRpb24uYWRkU3RhdGVEZWZpbml0aW9uKSB7XHJcbiAgICAgIGlmIChvLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICBpZiAoby5fdHJhY2thYmxlLmNvbmZpZ3VyYXRpb24uYWRkU3RhdGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZV0gIT09IG9bcHJvcGVydHlOYW1lXSkge1xyXG4gICAgICAgICAgaXNBZGRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlzQWRkZWQgPSBmYWxzZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0FkZGVkKSB7XHJcbiAgICAgIG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID0gJ2EnO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBpZiB1cGRhdGVkXHJcbiAgbGV0IGlzVXBkYXRlZCA9IGZhbHNlLFxyXG4gICAgICB3ID0gby5fdHJhY2thYmxlLnNuYXBzaG90cy5sZW5ndGg7XHJcblxyXG4gIHdoaWxlICh3LS0pIHtcclxuICAgIGlmIChvLl90cmFja2FibGUuc25hcHNob3RzW3ddLmV2ZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGlzVXBkYXRlZCA9IHRydWU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGlzVXBkYXRlZCkge1xyXG4gICAgby5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPSAndSc7XHJcbiAgICByZXR1cm47XHJcbiAgfSBlbHNlIHtcclxuICAgIG8uX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID0gJ3AnO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBHZW5lcmljSGVscGVycyBmcm9tICcuL2dlbmVyaWMtaGVscGVycydcclxuaW1wb3J0ICogYXMgVHJhY2thYmxlSGVscGVycyBmcm9tICcuL3RyYWNrYWJsZS1oZWxwZXJzJ1xyXG5pbXBvcnQgRXZlbnRUeXBlcyBmcm9tICcuL2V2ZW50LXR5cGVzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYWNrYWJsZU9iamVjdCB7XHJcbiAgY29uc3RydWN0b3IobywgYWRkU3RhdGVEZWZpbml0aW9uID0gbnVsbCkge1xyXG4gICAgaWYgKEdlbmVyaWNIZWxwZXJzLmlzVHJhY2thYmxlKG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJhY2tlcnMgZG8gbm90IGxpa2UgdG8gYmUgdHJhY2tlZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUdlbmVyaWNIZWxwZXJzLmlzT2JqZWN0KG8pKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBhbiBPYmplY3QgY2FuIGxlYXJuIGhvdyB0byB0cmFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICBUcmFja2FibGVIZWxwZXJzLmNyZWF0ZVN0cnVjdHVyZSh0aGlzKTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gbykge1xyXG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcbiAgICAgICAgbGV0IHByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICBpZiAocHJvcGVydHlEZXNjcmlwdG9yLndyaXRhYmxlICYmIHByb3BlcnR5RGVzY3JpcHRvci5jb25maWd1cmFibGUpIHtcclxuICAgICAgICAgIFRyYWNrYWJsZUhlbHBlcnMuY3JlYXRlRmllbGQodGhpcywgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eURlc2NyaXB0b3IudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG5cclxuICAvKlxyXG5cclxuICBzdGF0ZSgpIHtcclxuICAgIHN3aXRjaCAodGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQpIHtcclxuICAgICAgY2FzZSAncCc6IHJldHVybiAncHJpc3RpbmUnO1xyXG4gICAgICBjYXNlICdhJzogcmV0dXJuICdhZGRlZCc7XHJcbiAgICAgIGNhc2UgJ3UnOiByZXR1cm4gJ3VwZGF0ZWQnO1xyXG4gICAgICBjYXNlICdkJzogcmV0dXJuICdkZWxldGVkJztcclxuICAgICAgZGVmYXVsdDogIHRocm93IG5ldyBFcnJvcignVHJhY2thYmxlIE9iamVjdCBoYXMgYW4gdW5rbm93biBzdGF0ZS4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzUHJpc3RpbmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdwJztcclxuICB9XHJcblxyXG4gIGlzQWRkZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHJhY2thYmxlLnN0YXRlLmN1cnJlbnQgPT09ICdhJztcclxuICB9XHJcblxyXG4gIGlzVXBkYXRlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl90cmFja2FibGUuc3RhdGUuY3VycmVudCA9PT0gJ3UnO1xyXG4gIH1cclxuXHJcbiAgaXNEZWxldGVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrYWJsZS5zdGF0ZS5jdXJyZW50ID09PSAnZCc7XHJcbiAgfVxyXG5cclxuICBzbmFwc2hvdCgpIHtcclxuICAgIHRoaXMubG9jYWxTbmFwc2hvdCgpO1xyXG5cclxuICAgIGZvciAobGV0IHByb3BlcnR5TmFtZSBpbiB0aGlzKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNUcmFja2FibGUodGhpcy5fdHJhY2thYmxlLmZpZWxkc1twcm9wZXJ0eU5hbWVdKSkge1xyXG4gICAgICAgICAgdGhpcy5fdHJhY2thYmxlLmZpZWxkc1twcm9wZXJ0eU5hbWVdLnNuYXBzaG90KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBsb2NhbFNuYXBzaG90KCkge1xyXG4gICAgaWYgKHRoaXMuX3RyYWNrYWJsZS5zbmFwc2hvdHNbMF0uZXZlbnRzLmxlbmd0aCkge1xyXG4gICAgICBsZXQgc25hcHNob3QgPSB7XHJcbiAgICAgICAgZXZlbnRzOiBbXSxcclxuICAgICAgICBpZDogR2VuZXJpY0hlbHBlcnMuc3RyaW5nSWQoKVxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLl90cmFja2FibGUuc25hcHNob3RzLnVuc2hpZnQoc25hcHNob3QpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBoYXNDaGFuZ2VzKCkge1xyXG4gICAgbGV0IGhhc0xvY2FsQ2hhbmdlcyA9IHRoaXMuaGFzTG9jYWxDaGFuZ2VzKCk7XHJcbiAgICBpZiAoaGFzTG9jYWxDaGFuZ2VzKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHByb3BlcnR5TmFtZSBpbiB0aGlzKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNUcmFja2FibGUodGhpcy5fdHJhY2thYmxlLmZpZWxkc1twcm9wZXJ0eU5hbWVdKSkge1xyXG4gICAgICAgICAgbGV0IGhhc0NoYW5nZXMgPSB0aGlzLl90cmFja2FibGUuZmllbGRzW3Byb3BlcnR5TmFtZV0uaGFzQ2hhbmdlcygpO1xyXG4gICAgICAgICAgaWYgKGhhc0NoYW5nZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaGFzU25hcHNob3RDaGFuZ2VzKCkge1xyXG4gICAgbGV0IGhhc0xvY2FsU25hcHNob3RDaGFuZ2VzID0gdGhpcy5oYXNMb2NhbFNuYXBzaG90Q2hhbmdlcygpO1xyXG4gICAgaWYgKGhhc0xvY2FsU25hcHNob3RDaGFuZ2VzKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHByb3BlcnR5TmFtZSBpbiB0aGlzKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICBpZiAoR2VuZXJpY0hlbHBlcnMuaXNUcmFja2FibGUodGhpcy5fdHJhY2thYmxlLmZpZWxkc1twcm9wZXJ0eU5hbWVdKSkge1xyXG4gICAgICAgICAgbGV0IGhhc1NuYXBzaG90Q2hhbmdlcyA9IHRoaXMuX3RyYWNrYWJsZS5maWVsZHNbcHJvcGVydHlOYW1lXS5oYXNTbmFwc2hvdENoYW5nZXMoKTtcclxuICAgICAgICAgIGlmIChoYXNTbmFwc2hvdENoYW5nZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaGFzTG9jYWxDaGFuZ2VzKCkge1xyXG4gICAgbGV0IHMgPSB0aGlzLl90cmFja2FibGUuc25hcHNob3RzLmxlbmd0aDtcclxuICAgIHdoaWxlIChzLS0pIHtcclxuICAgICAgaWYgKHRoaXMuX3RyYWNrYWJsZS5zbmFwc2hvdHNbc10uZXZlbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBoYXNMb2NhbFNuYXBzaG90Q2hhbmdlcygpIHtcclxuICAgIGlmICh0aGlzLl90cmFja2FibGUuc25hcHNob3RzWzBdLmV2ZW50cy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZWplY3RDaGFuZ2VzKCkge1xyXG4gICAgLy8gVE9ET1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByZWplY3RTbmFwc2hvdENoYW5nZXMoKSB7XHJcbiAgICBsZXQgZSA9IHRoaXMuX3RyYWNrYWJsZS5zbmFwc2hvdHNbMF0uZXZlbnRzLmxlbmd0aDtcclxuICAgIHdoaWxlIChlLS0pIHtcclxuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHJlamVjdExvY2FsQ2hhbmdlcygpIHtcclxuICAgIC8vIFRPRE9cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcmVqZWN0TG9jYWxTbmFwc2hvdENoYW5nZXMoKSB7XHJcbiAgICAvLyBUT0RPXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGFjY2VwdENoYW5nZXMoKSB7XHJcbiAgICAvLyBUT0RPXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGFjY2VwdFNuYXBzaG90Q2hhbmdlcygpIHtcclxuICAgIC8vIFRPRE9cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgYWNjZXB0TG9jYWxDaGFuZ2VzKCkge1xyXG4gICAgLy8gVE9ET1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBhY2NlcHRMb2NhbFNuYXBzaG90Q2hhbmdlcygpIHtcclxuICAgIC8vIFRPRE9cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgKi9cclxuXHJcbiAgYXNOb25UcmFja2FibGUoKSB7XHJcbiAgICBsZXQgbyA9IHt9O1xyXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIGluIHRoaXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICAgIGlmIChHZW5lcmljSGVscGVycy5pc1RyYWNrYWJsZSh0aGlzW3Byb3BlcnR5TmFtZV0pKSB7XHJcbiAgICAgICAgICBvW3Byb3BlcnR5TmFtZV0gPSB0aGlzW3Byb3BlcnR5TmFtZV0uYXNOb25UcmFja2FibGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb1twcm9wZXJ0eU5hbWVdID0gdGhpc1twcm9wZXJ0eU5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbztcclxuICB9XHJcbn1cclxuIl19
