describe('inputController', function() {
  var ctrl, scope, $location;

  beforeEach(module('getitright'));

  beforeEach(inject(function(_$location_, $controller, $rootScope) {
    scope = $rootScope.$new();
    $location = _$location_;
    ctrl = $controller('InputCtrl', {$scope: scope});
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
});
