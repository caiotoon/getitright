describe('resultController', function() {
  var scope, ctrl, diff, phrase, $location;

  beforeEach(module('getitright'));

  beforeEach(inject(function(_diff_, _phrase_, _$location_) {
    diff = _diff_;
    phrase = _phrase_;
    $location = _$location_;

    spyOn(diff, 'compare');
    spyOn($location, 'path');

    spyOn(phrase, 'get');
    spyOn(phrase, 'getTranscription');
    spyOn(phrase, 'prepare').andCallFake(function(text) {
      return 'p: ' + text;
    });
  }));

  function createCtrl() {
    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      $controller('ResultCtrl', {$scope: scope});
    });
  }

  it('should compare the transcription to the original text', function() {
    phrase.get.andReturn('original phrase');
    phrase.getTranscription.andReturn('original');
    diff.compare.andReturn('diff');
    createCtrl();

    expect($location.path).not.toHaveBeenCalled();
    expect(diff.compare).toHaveBeenCalledWith('p: original phrase', 'p: original');
  });

  it('should redirect to /record if there is no transcription', function() {
    createCtrl();
    expect($location.path).toHaveBeenCalledWith('/record');
  });
});
