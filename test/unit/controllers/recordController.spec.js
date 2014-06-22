describe('recordController', function() {
  var MOCKED_PHRASE = 'mocked phrase',
    INTERVAL = 1000,
    $location, $rootScope, $controller, $timeout, phrase,
    transcription, transcriptionDeferred,
    ctrl, scope;

  function createCtrl() {
    scope = $rootScope.$new();
    ctrl = $controller('RecordCtrl', {$scope: scope});
  }

  beforeEach(module('getitright', 'ngMock', function($provide) {
    $provide.service('transcription', function($q) {
      this.startTranscription = jasmine.createSpy('transcription.startTranscription')
        .andCallFake(function() {
          transcriptionDeferred = $q.defer();
          return transcriptionDeferred.promise;
        });

      this.abortTranscription = jasmine.createSpy('transcription.abortTranscription');
    });
  }));

  beforeEach(inject(function(_$location_, _phrase_, _$rootScope_, _$controller_, _$timeout_, _transcription_) {
    transcription = _transcription_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    $timeout = _$timeout_;
    phrase = _phrase_;

    spyOn($location, 'path');
    spyOn(phrase, 'setTranscription');
  }));

  it('should return to /enter page if there is no message', inject(function(phrase) {
    createCtrl();
    expect($location.path).toHaveBeenCalledWith('/enter');
  }));

  describe('', function() {
    beforeEach(function() {
      phrase.set(MOCKED_PHRASE);
      createCtrl();
    });

    it('should not navigate back to /enter if there is a phrase', function() {
      expect($location.path).not.toHaveBeenCalled();
    });

    it('should clear the transcription message when start recording', function() {
      scope.record();
      expect(phrase.setTranscription).toHaveBeenCalledWith(null);
    });

    it('should toggle a requesting permission error msg after a few seconds without notification', function() {
      scope.record();
      $timeout.flush(INTERVAL);
      expect(scope.errorMsg).toBe('Requesting permission...');
    });

    it('should not create error msg if mic started already', function() {
      scope.record();
      transcriptionDeferred.notify('started');
      $rootScope.$apply();
      $timeout.flush(INTERVAL);
      expect(scope.errorMsg).not.toBe('Requesting permission...');
    });

    it('should remove requesting permission flag after start notification', function() {
      scope.record();
      scope.errorMsg = 'sdfasdf';
      transcriptionDeferred.notify('started');
      $rootScope.$apply();
      scope.errorMsg = null;
    });

    describe('upon transcription', function() {
      function startRecording() {
        scope.record();
      }

      function transcribe(value, reject) {
        transcriptionDeferred[reject ? 'reject' : 'resolve'](value);
        $rootScope.$apply();
      }

      beforeEach(startRecording);

      it('should set a voiceRecording flag after start notification', function() {
        expect(scope.voiceRecording).toBeUndefined();
        transcriptionDeferred.notify('started');
        $rootScope.$apply();
        expect(scope.voiceRecording).toBe(true);
      });

      it('should set a recording flag', function() {
        expect(scope.recording).toBe(true);
        transcribe('any text');
        expect(scope.recording).toBe(false);
      });

      it('should save the transcribed message and redirect to results page', function() {
        transcribe('some text');
        expect(phrase.setTranscription).toHaveBeenCalledWith('some text');
        expect($location.path).toHaveBeenCalledWith('/result');
      });

      it('should expose an error message on the scope if there is any error', function() {
        transcribe('test error message', true);
        expect(scope.errorMsg).toBe('test error message');
        expect(scope.recording).toBe(false);
      });
    });
  });
});
