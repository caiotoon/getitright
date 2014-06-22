/**
 * @ngdoc service
 * @name speechRecognitionEngine
 * @kind class
 *
 * @description
 * Provides an instance of the engine that converts voice into text.
 */
angular.module('getitright')
  .service('speechRecognitionEngine', function() {
    this.getInstance = function() {
      var engine = window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition ||
        window.SpeechRecognition,
        instance;

      if (engine) {
        instance = new engine();
        instance.lang = 'en-US';
        instance.maxAlternatives = 1;
      }

      return instance;
    }
  });
