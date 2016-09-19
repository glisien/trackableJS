'use strict';

describe('trackable', function () {
  function newTestObject () {
    return {
      object1: {
        string: 's',
        number: 0,
        date: new Date(1912, 10, 28),
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
        context = newTestObject(),
        trackableContext;

    beforeEach(function () {
      trackableContext = tracker.asTrackable(context);
    });

    it('should have changes', function () {
      trackableContext.object1.string = 's-updated-1';
      expect(trackableContext.hasChanges()).toBeTruthy();
    });

    it('should have changes', function () {
      trackableContext.object1.date.setDate(21);
      expect(trackableContext.hasChanges()).toBeTruthy();
    });

    it('should not have changes after undoing them one-by-one', function () {
      trackableContext.object1.string = 's-updated-1';
      trackableContext.object1.string = 's-updated-2';
      trackableContext.object1.undo();
      trackableContext.object1.undo();
      expect(trackableContext.object1.hasChanges()).toBeFalsy();
    });

    it('should not have changes after undoing all of them', function () {
      trackableContext.object1.string = 's-updated-1';
      trackableContext.object1.string = 's-updated-2';
      trackableContext.object1.undoAll();
      expect(trackableContext.object1.hasChanges()).toBeFalsy();
    })

    it('should have changes after redoing the last undone change', function () {
      trackableContext.object1.number = 1;
      trackableContext.object1.number = 2;
      trackableContext.object1.undoAll();
      trackableContext.object1.redo();
      expect(trackableContext.object1.number).toBe(1);
    });

    it('should have changes after redoing the last undone change', function () {
      trackableContext.object1.number = 1;
      trackableContext.object1.number = 2;
      trackableContext.object1.undoAll();
      trackableContext.object1.redo();
      expect(trackableContext.object1.hasChanges()).toBeTruthy();
    });

    it('should redo the last change that was undone', function () {
      trackableContext.object1.number = 1;
      trackableContext.object1.number = 2;
      trackableContext.object1.undoAll();
      trackableContext.object1.redo();
      expect(trackableContext.object1.number).toBe(1);
    });

    it('should have changes after creating snapshot', function () {
      trackableContext.object1.number = 1;
      trackableContext.object1.createSnapshot('checkpoint-a');
      trackableContext.object1.number = 2;
      expect(trackableContext.object1.hasChangesAfterSnapshot('checkpoint-a')).toBeTruthy();
    });

    it('should not have changes after restoring to snapshot', function () {
      trackableContext.object1.number = 1;
      trackableContext.object1.createSnapshot('checkpoint-a');
      trackableContext.object1.number = 2;
      trackableContext.object1.applySnapshot('checkpoint-a');
      expect(trackableContext.object1.hasChangesAfterSnapshot('checkpoint-a')).toBeFalsy();
    });
  })
});
