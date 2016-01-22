'use strict';

describe('trackable', function() {
  var trackableContext,
      context = {
        object1: {
          string: 's',
          number: 0,
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
        object2: {}
      };

  beforeEach(function() {
    trackableContext = new TrackableObject(context);
  });

  afterEach(function() {
  });

  describe('change-tracking', function() {
    it('should pass', function() {
    });
  });

  describe('state-tracking', function() {
  });
});
