var app = angular.module('trackable', []);

app.controller('trackable-controller', function($scope) {
  $scope.ctrl = {
    context: null
  };

  $scope.onTest = function() {
  }

  $scope.onApply = function() {
    $scope.$apply();
  }

  $scope.onUndo = function() {
    $scope.ctrl.context.undo();
  }

  $scope.onUndoAll = function() {
    $scope.ctrl.context.undoAll();
  }

  $scope.onRedo = function() {
    $scope.ctrl.context.redo();
  }

  $scope.onRedoAll = function() {
    $scope.ctrl.context.redoAll();
  }

  var tracker = new Tracker({ trackingMethod: 'mutate', trackingScope: 'nested' });

  var testObject = {
    firstName: 'firstName',
    lastName: 'lastName',
    age: 99
  };

  //$scope.ctrl.context = testObject;
  //tracker.asTrackable($scope.ctrl.context);

  $scope.ctrl.context = tracker.asTrackable(testObject);

  window.tracker = tracker;
  window.scope = $scope;
});
