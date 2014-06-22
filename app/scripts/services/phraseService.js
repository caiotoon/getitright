angular.module('getitright')
  .service('phrase', function() {
    var original;

    this.set = function(phrase) {
      original = phrase;
    };

    this.get = function() {
      return original;
    };

    this.prepare = function(original) {
      return original ?
        original.replace(/[^\w]/g, ' ') // removing all ponctuations
          .replace(/ {2,}/g, ' ') // removing all duplicated spaces
          .replace(/^ +| +$/g, '') // trimming
          .toLowerCase() :
        original;
    };
  });
