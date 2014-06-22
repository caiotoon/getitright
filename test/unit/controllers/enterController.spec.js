describe('enterController', function() {
  var ctrl, scope, $location;

  beforeEach(module('getitright'));

  beforeEach(inject(function(_$location_, $controller, $rootScope) {
    scope = $rootScope.$new();
    $location = _$location_;
    ctrl = $controller('EnterCtrl', {$scope: scope});
    spyOn($location, 'path');
  }));

  it('should not navigate if there is not a valid string', function() {
    scope.usePhrase('      .,,     ');
    expect($location.path).not.toHaveBeenCalled();
  });

  it('should navigate if there is a valid string', function() {
    scope.usePhrase('      .,ab,     ');
    expect($location.path).toHaveBeenCalledWith('/record');
  });

  it('should retrieve the current phrase form the localStorage', inject(function($controller, $rootScope, phrase) {
    var scope = $rootScope.$new();

    spyOn(phrase, 'get').andReturn('mocked phrase');
    $controller('EnterCtrl', {$scope: scope});
    expect(scope.userInputPhrase).toBe('mocked phrase');
  }));
});
