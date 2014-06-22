describe('trascriptionService', function() {
  var transcription, speechRecognitionEngine, $rootScope;

  function injectServices() {
    beforeEach(inject(function(_transcription_, _speechRecognitionEngine_, _$rootScope_) {
      transcription = _transcription_;
      speechRecognitionEngine = _speechRecognitionEngine_;
      $rootScope = _$rootScope_;
    }));
  }

  function mockSpeechRecognitionEngine(getInstanceReturnValue) {
    beforeEach(module('getitright', function($provide) {
      $provide.value('speechRecognitionEngine', { getInstance: function() { return getInstanceReturnValue; } });
    }));
  }

  describe('speech Recognition Engine is Available', function() {
    var mockEngine = {
          start: jasmine.createSpy('start').andCallFake(function() {
            executeOnStart && this.onstart();
            executeOnResult && this.onresult({ results: [[ { transcript: mockResults } ]] });
            executeOnEnd && this.onend();
          }),
          stop: jasmine.createSpy('stop')
        },
        executeOnStart, executeOnEnd, executeOnResult, mockResults;

    beforeEach(function() {
      executeOnStart = true;
      executeOnEnd = true;
      executeOnResult = true;
    });

    mockSpeechRecognitionEngine(mockEngine);

    injectServices();

    it('should return true if the speech recognition engine is not available', function() {
      expect(transcription.isAvailable()).toBe(true);
    });

    it('should notify the promise when the recognition starts', function() {
      var _this = this;

      executeOnResult = false;
      executeOnEnd = false;

      transcription.startTranscription().then(function(transcript) {
      }, function(error) {
        _this.fail('Promise should not be rejected.');
      }, function(notification) {
        expect(notification).toBe('started');
      });

      expect(mockEngine.start).toHaveBeenCalled();

      mockEngine.onstart();

      $rootScope.$digest();
    });

    it('should resolve the promise with null when the capture times-out', function() {
      var _this = this;

      mockResults = null;

      transcription.startTranscription().then(function(transcript) {
        expect(transcript).toBeNull();
      }, function(error) {
        _this.fail('Promise should not be rejected.');
      });

      expect(mockEngine.start).toHaveBeenCalled();

      $rootScope.$digest();
    });

    it('should resolve the promise with the text passed in the mockResults variable', function() {
      var _this = this;

      mockResults = 'test';

      transcription.startTranscription().then(function(transcript) {
        expect(transcript).toBe('test');
      }, function(error) {
        _this.fail('Promise should not be rejected.');
      });

      expect(mockEngine.start).toHaveBeenCalled();

      $rootScope.$digest();
    });

    it('should successfully stop the transcription when it has been started', function() {
      transcription.startTranscription();
      expect(mockEngine.start).toHaveBeenCalled();

      transcription.abortTranscription();
      expect(mockEngine.stop).toHaveBeenCalled();
    });

    it('should fail to stop the transcription when it hasn\'t been started', function() {
      var message = 'You cannot stop a transcription that hasn\'t been started.';

      expect(function() { transcription.abortTranscription(); }).toThrow({ message: message });
    });
  });

  describe('speech Recognition Engine is not Available', function() {
    mockSpeechRecognitionEngine(undefined);

    injectServices();

    it('should return false if the speech recognition engine is not available', function() {
      expect(transcription.isAvailable()).toBe(false);
    });

    it('should fail to start the transcription when the engine is not available', function() {
      var _this = this;

      transcription.startTranscription().then(function() {
        _this.fail('Promise should not be fulfilled.');
      }, function(error) {
        expect(error.message).toBe('Speech recognition engine is not available in your browser. Please test it again on Google Chrome.');
      });

      $rootScope.$digest();
    });

    it('should fail to stop the transcription when the engine is not available', function() {
      var message = 'Speech recognition engine is not available in your browser. Please test it again on Google Chrome.';

      expect(function() { transcription.abortTranscription(); }).toThrow({ message: message });
    });
  });
});
