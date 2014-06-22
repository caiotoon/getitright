describe('recordController', function() {
  var MOCKED_PHRASE = 'mocked phrase',
    INTERVAL = 1000,
    $location, $rootScope, $controller, $interval, phrase,
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

  beforeEach(inject(function(_$location_, _phrase_, _$rootScope_, _$controller_, _$interval_, _transcription_) {
    transcription = _transcription_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    $interval = _$interval_;
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
      jasmine.Clock.useMock();
    });

    it('should not navigate back to /enter if there is a phrase', function() {
      expect($location.path).not.toHaveBeenCalled();
    });

    it('should clear the transcription message when start recording', function() {
      scope.toggleRecord();
      expect(phrase.setTranscription).toHaveBeenCalledWith(null);
    });

    it('should timeout 1 sec and ask for transcription', function() {
      scope.toggleRecord();
      expect(transcription.startTranscription).not.toHaveBeenCalled();
      $interval.flush(INTERVAL);
      expect(transcription.startTranscription).toHaveBeenCalled();
    });

    describe('when toggling off the record', function() {
      it('should cancel the countdown if recordToggle gets called', function() {
        spyOn($interval, 'cancel');

        scope.toggleRecord();
        expect(scope.countdown).toBe(3);
        $interval.flush(INTERVAL);
        expect(scope.countdown).toBe(2);
        scope.toggleRecord();
        expect($interval.cancel).toHaveBeenCalled();
      });

      it('should abort the transcription', function() {
        scope.toggleRecord();
        $interval.flush(INTERVAL);
        scope.toggleRecord();
        expect(transcription.abortTranscription).toHaveBeenCalled();
      });

      it('should NOT abort the transcription if it has not been started', function() {
        scope.toggleRecord();
        scope.toggleRecord();
        expect(transcription.abortTranscription).not.toHaveBeenCalled();
      });
    });

    describe('upon transcription', function() {
      function startRecording() {
        scope.toggleRecord();
        $interval.flush(INTERVAL);
      }

      function transcribe(value, reject) {
        transcriptionDeferred[reject ? 'reject' : 'resolve'](value);
        $rootScope.$apply();
      }

      beforeEach(startRecording);

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
