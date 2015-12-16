(function() {

  window.context = {

    object_1: {

      string: 's',

      number: 0,

      string_array: ['s0', 's1', 's2', 's3', 's4'],

      number_array: [0, 1, 2, 3, 4],

      object_array: [
        {
          field: 'object-array-field',
          array: ['object-array-array-element-0', 'object-array-array-element-1']
        },
        {
          field: 'object-array-field',
          array: ['object-array-array-element-0', 'object-array-array-element-1']
        }
      ],

      hybrid_array: [
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
              field_1: 'this-is-deep',
              field_2: 'this-is-very-deep'
            }
          ]
        }
      ]
    },

    object_2: {
    }
  };

/*
var tc = new TrackableObject(context);

tc.state(); // pristine
tc.hasChanges(); // false
tc.hasPendingChanges(); // false

tc.string = 's-updated';

// [string =>   's' -> 's-updated']

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // false

tc.newUnitOfWork();

tc.state(); // updated
tc.hasChanges(); // false
tc.hasPendingChanges(); // true

tc.number = 1;

// [string =>   's' -> 's-updated']
// [number =>   0 -> 1]

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // true

tc.newUnitOfWork();

tc.string = 's-updated-again';

// [string =>   's' -> 's-updated']
// [number =>   0 -> 1]
// [string =>   's-updated' -> 's-updated-again']

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // true

VERSION 1
tc.acceptUnitOfWorkChanges();

// [string =>   's' -> 's-updated']
// [string =>   's-updated' -> 's-updated-again', number =>   0 -> 1]

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // true

tc.acceptUnitOfWorkChanges();

// [string =>   's-updated' -> 's-updated-again', number =>   0 -> 1]

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // false

VERSION 2
tc.rejectUnitOfWorkChanges();

// [string =>   's' -> 's-updated']
// [number =>   0 -> 1]

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // true

tc.rejectUnitOfWorkChanges();

// [string =>   's' -> 's-updated']

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // false

VERSION 3
tc.rejectUnitOfWorkChanges();

// [string =>   's' -> 's-updated']
// [number =>   0 -> 1]

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // true

tc.acceptUnitOfWorkChanges();

// [string =>   's' -> 's-updated', number =>   0 -> 1]

tc.state(); // updated
tc.hasChanges(); // true
tc.hasPendingChanges(); // false

VERSION 4
tc.undoChanges();

tc.state(); // pristine
tc.hasChanges(); // false
tc.hasPendingChanges(); // false

*/

})();
