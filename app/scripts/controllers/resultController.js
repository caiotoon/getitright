angular.module('getitright')
  .controller('ResultCtrl', ['$scope', '$location', '$sce', 'phrase', 'diff', function($scope, $location, $sce, phrase, diff) {
    var original = phrase.get(),
      transcription = phrase.getTranscription();

    if (!transcription) {
      $location.path('/record');
    }

    $scope.result = $sce.trustAsHtml(diff.compare(phrase.prepare(original), phrase.prepare(transcription)));
  }]);
