'use strict';

describe('trackableJS', function () {
  function newTestObject () {
    return {
      object1: {
        string: 's',
        number: 0,
        date: new Date(1912, 11, 28),
        stringArray: ['s0', 's1', 's2', 's3', 's4'],
        numberArray: [0, 1, 2, 3, 4],
        objectArray: [
          {
            field: 'object-array-field',
            array: ['object-array-array-index-0', 'object-array-array-index-1']
          },
          {
            field: 'object-array-field',
            array: ['object-array-array-index-0', 'object-array-array-index-1']
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
      object2: {},
      string: 's',
      number: 0
    };
  }

  describe('tracker', function () {
    var tracker = new Tracker(),
        obj = newTestObject(),
        trackedObj;

    beforeEach(function () {
      trackedObj = tracker.asTrackable(obj);
    });

    it('should have changes', function () {
      trackedObj.object1.string = 's-updated-1';
      expect(tracker.hasChanges(trackedObj)).toBeTruthy();
    });
  })
});
