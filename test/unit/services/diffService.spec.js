describe('diffService', function() {
  var diff;

  beforeEach(module('getitright'));

  beforeEach(function() {
    angular.module('getitright')
      .config(function(diffProvider) {
        diffProvider.setTemplates('+%s+', '-%s-', '%s');
      });
  });

  beforeEach(inject(function(_diff_) {
    diff = _diff_;
  }));

  describe('isPhrase', function() {
    it('should return true if it is a prhase', function() {
      expect(diff.isPhrase('this is a prhase')).toBe(true);
    });

    it('should return false if it is not a phrase', function() {
      expect(diff.isPhrase('helocentric')).toBe(false);
    });
  });

  describe('compare() phrases', function() {
    it('should return the matching parts in the matchingTpl', function() {
      expect(diff.compare('some phrase', 'some phrase')).toBe('some phrase');
    });

    it('should return missed parts in the missingTpl', function() {
      expect(diff.compare('some phrase', 'some')).toBe('some- phrase-');
    });

    it('should return included parts in the excessTpl', function() {
      expect(diff.compare('some', 'some phrase')).toBe('some+ phrase+');
    });
  });

  describe('compare() words', function() {
    it('should return the matching parts in the matchingTpl', function() {
      expect(diff.compare('some', 'some')).toBe('some');
    });

    it('should return missed parts in the missingTpl', function() {
      expect(diff.compare('some', 'sme')).toBe('s-o-me');
    });

    it('should return included parts in the excessTpl', function() {
      expect(diff.compare('sme', 'some')).toBe('s+o+me');
    });
  });
});
