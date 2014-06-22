describe('phraseProvider', function() {
  var phrase,
    examplePhrase = 'My original, without  modifications - any!';

  beforeEach(module('getitright'));

  describe('localStorage', function() {
    it('it should restore the original phrase from localStorage if any', function() {
      window.localStorage.userInputPhrase = 'mocked value';

      inject(function(_phrase_) {
        expect(_phrase_.get()).toBe('mocked value');
      });
    });

    it('should save the phrase in the localStorage', inject(function(phrase) {
      spyOn(window.localStorage, 'setItem');
      phrase.set('new phrase');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('userInputPhrase', 'new phrase');
    }));
  });

  describe('message handling', function() {
    beforeEach(inject(function(_phrase_) {
      phrase = _phrase_;
    }));

    it('should return the stored message', function() {
      phrase.set(examplePhrase);
      expect(phrase.get()).toBe(examplePhrase);
    });

    it('prepare() should return a message without any punctuation', function() {
      expect(phrase.prepare(examplePhrase)).toBe('my original without modifications any');
    });

    it('should save and restore the transcription message', function() {
      phrase.setTranscription('I am the law!!');
      epxect(phrase.getTranscription()).toBe('I am the law!!');
    });

    it('should clear the transcription message after setting a new phrase', function() {
      phrase.setTranscription('I am the law!!');
      phrase.set('some new text');
      expect(phrase.getTranscription()).toBeNull();
    });
  });
});
