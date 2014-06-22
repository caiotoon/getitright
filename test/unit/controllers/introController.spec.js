describe('introController', function() {
  var ctrl, scope, $location, engineIsAvailableReturnValue;

  beforeEach(module('getitright'));

  beforeEach(inject(function(_$location_, $rootScope, transcription) {
    scope = $rootScope.$new();

    $location = _$location_;

    spyOn($location, 'path');
    spyOn(transcription, 'isAvailable').andCallFake(function() {
      return engineIsAvailableReturnValue;
    });
  }));

  function createTestController() {
    inject(function($controller) {
      ctrl = $controller('IntroCtrl', { $scope: scope });
    });
  }

  it('Should not navigate if there is a speech recognition engine available', function() {
    engineIsAvailableReturnValue = true;
    createTestController();
    expect($location.path).not.toHaveBeenCalled();
  });

  it('Should leave the page if there isn\'t a valid speech recognition engine available', function() {
    engineIsAvailableReturnValue = false;
    createTestController();
    expect($location.path).toHaveBeenCalledWith('/not-supported');
  });
});
