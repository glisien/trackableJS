(function() {

  window.areEqual = function(o1, o2) {
    var propertyName;

    if (o1 === o2) {
      return true;
    }

    if (!(o1 instanceof Object) || !(o2 instanceof Object)) {
      return false;
    }

/*
    if (o1.constructor !== o2.constructor) {
      return false;
    }
*/
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

      if (typeof (o1[propertyName]) !== 'object') {
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

    return true;
  }

  window.context = {
    object1: {
      string: 's',
      number: 0,
      stringArray: ['s0', 's1', 's2', 's3', 's4'],
      numberArray: [0, 1, 2, 3, 4],
      objectArray: [
        {
          field: 'object-array-field',
          array: ['object-array-array-element-0', 'object-array-array-element-1']
        },
        {
          field: 'object-array-field',
          array: ['object-array-array-element-0', 'object-array-array-element-1']
        }
      ],
      hybridArray: [
        0,
        's1',
        {
          field: 'hybrid-array-field',
          object: {}
        },
        null,
        ['a', 'b', 'c'],
        {
          field: 'hybrid-array-field',
          array: [
            {
              field1: 'this-is-deep',
              field2: 'this-is-very-deep'
            }
          ]
        }
      ]
    },
    object2: {
    }
  };
})();
