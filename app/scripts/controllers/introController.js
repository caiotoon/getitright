angular.module('getitright')
  .controller('IntroCtrl', ['$scope', '$location', 'transcription', function($scope, $location, transcription) {
    if (!transcription.isAvailable()) {
      $location.path('/not-supported');
    }
  }]);
