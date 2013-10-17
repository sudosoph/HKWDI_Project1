'use strict';

describe('Controller: MultiplayerCtrl', function () {

  // load the controller's module
  beforeEach(module('TickeyApp'));

  var MultiplayerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MultiplayerCtrl = $controller('MultiplayerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
