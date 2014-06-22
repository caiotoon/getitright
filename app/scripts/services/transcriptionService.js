/**
 * @ngdoc service
 * @name diff
 * @kind class
 *
 * @description
 * Service that captures and transcribes user's voice.
 */
angular.module('getitright')
  .service('transcription', ['$q', 'speechRecognitionEngine', function($q, speechRecognitionEngine) {
    var engineInstance = speechRecognitionEngine.getInstance(),
        isAvailable = !!engineInstance,
        isCapturing = false,
        deferredCapture, transcript;

    if (isAvailable) {
      engineInstance.onresult = function(event) {
        var results, speakResults, resultAlternative;

        results = event.results;

        if (results && (speakResults = results[0]) && (resultAlternative = speakResults[0])) {
          transcript = resultAlternative.transcript;
        }
      };

      engineInstance.onend = function() {
        deferredCapture && deferredCapture.resolve(transcript);
      };

      engineInstance.onerror = function(error) {
        deferredCapture && deferredCapture.reject(error);
      };

      engineInstance.onstart = function() {
        deferredCapture.notify('started');
      };
    }

    this.isAvailable = function() {
      return isAvailable;
    };

    this.startTranscription = function() {
      transcript = null;

      deferredCapture = $q.defer();

      if (isAvailable) {
        engineInstance.start();
      } else {
        deferredCapture.reject({ message: 'Speech recognition engine is not available in your browser. Please test it again on Google Chrome.' });
      }

      isCapturing = true;

      return deferredCapture.promise;
    };

    this.abortTranscription = function() {
      deferredCapture = null;

      try {
        if (isAvailable) {
          if (isCapturing) {
            engineInstance.stop();
          } else {
            throw { message: 'You cannot stop a transcription that hasn\'t been started.' };
          }
        } else {
          throw { message: 'Speech recognition engine is not available in your browser. Please test it again on Google Chrome.' };
        }
      } finally {
        isCapturing = false;
      }
    }
  }]);
