describe('phraseProvider', function() {
  var phrase,
    examplePhrase = 'My original, without  modifications - any!';

  beforeEach(module('getitright'));

  beforeEach(inject(function(_phrase_) {
    phrase = _phrase_;
  }));

  it('should return the stored message', function() {
    phrase.set(examplePhrase);
    expect(phrase.get()).toBe(examplePhrase);
  });

  it('prepare() should return a message without any punctuation', function() {
    expect(phrase.prepare(examplePhrase)).toBe('my original without modifications any');
  })
});
