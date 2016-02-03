(function () {
  'use strict';

  var testObject = {
    prop1: 's1',
    prop2: 1,
    prop3: {
      prop1: 1,
      prop2: 2,
      prop3: 3,
      prop4: [
        {
          prop1: 1,
          prop2: 2
        },
        null
      ]
    }
  };
  testObject.prop3.prop1 = testObject.prop3.prop4;
  testObject.prop3.prop4 = testObject.prop3;
  window.testObject = testObject;

  function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  var counter = 0;
  var traversed = [];

  function walk (obj, level) {
    var trav;

    if (!level) {
      level = 0;
    }

    if (obj.id === null || obj.id === undefined) {
      obj.id = guid();
      traversed.push({
        id: obj.id,
        level: level
      });
    } else {
      trav = null;
      var l = traversed.length;
      while (l--) {
        if (traversed[l].id === obj.id) {
          trav = traversed[l];
          return;
        }
      }
      if (trav && trav.level < level) {
        console.log('YOU ARE IN A LOOP');
        return;
      }
    }

    console.log(counter++, ' walking object: ', obj.id, ' at level:', level);
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop] instanceof Object) {
          walk(obj[prop], level + 1);
        }
      }
    }
  }
  window.walk = walk;

})();
