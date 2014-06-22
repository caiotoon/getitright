/**
 * @ngdoc service
 * @name diff
 * @kind class
 *
 * @description
 * Computes and returns a string representing the difference between two given
 * strings.
 * Words not in the original string will be shown in between <ins> tags, and
 * words not in the matching string will be shown in between <del> tags.
 */
angular.module('getitright')
  .provider('diff', function() {
    var _excessTpl, _missingTpl, _matchingTpl;

    this.setTemplates = function(excessTpl, missingTpl, matchingTpl) {
      _excessTpl = excessTpl;
      _missingTpl = missingTpl;
      _matchingTpl = matchingTpl;
    };

    this.$get = function() {
      return {
        isPhrase: function(text) {
          return text.indexOf(' ') > -1;
        }, compare: function(original, matching) {
          var diff, str, diffFunction;

          if (this.isPhrase(original)) {
            diffFunction = JsDiff.diffWords;
          } else {
            diffFunction = JsDiff.diffChars;
          }

          diff = diffFunction(original, matching);

          str = '';
          diff.forEach(function formatPart(part) {
            var tpl = part.added ? _excessTpl :
              part.removed ? _missingTpl : _matchingTpl;

            str += tpl.replace('%s', part.value);
          });

          return str;
        }
      };
    };
  });
