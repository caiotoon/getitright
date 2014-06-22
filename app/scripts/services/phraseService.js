angular.module('getitright')
  .service('phrase', function() {
    var propertyName = 'userInputPhrase',
      original, transcription;

    this.set = function(phrase) {
      original = phrase;
      transcription = null;
      window.localStorage.setItem(propertyName, original);
    };

    this.get = function() {
      return original;
    };

    this.setTranscription = function(phrase) {
      transcription = phrase;
    };

    this.getTranscription = function() {
      return transcription;
    };

    this.prepare = function(original) {
      return original ?
        original.replace(/[^\w]/g, ' ') // removing all ponctuations
          .replace(/ {2,}/g, ' ') // removing all duplicated spaces
          .replace(/^ +| +$/g, '') // trimming
          .toLowerCase() :
        original;
    };

    this.set(window.localStorage[propertyName]);
  });
