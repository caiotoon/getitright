angular.module('getitright')
  .controller('RecordCtrl', ['$scope', '$location', '$interval', 'phrase', 'transcription',
    function($scope, $location, $interval, phrase, transcription) {
      var interval, transcriptionPromise;

      $scope.actualPhrase = phrase.get();

      if (!phrase.prepare($scope.actualPhrase)) {
        $location.path('/enter');
      }

      $scope.toggleRecord = function() {
        if ($scope.recording) {
          clearCountdown();
          $scope.recording = false;

          if (transcriptionPromise) {
            transcription.abortTranscription();
            transcriptionPromise = null;
          }
        } else {
          $scope.countdown = 3;
          $scope.recording = true;
          phrase.setTranscription(null);
          interval = $interval(countdown, 1000, 3);
        }
      };

      function countdown() {
        $scope.countdown--;

        if ($scope.countdown === 2) {
          transcriptionPromise = transcription.startTranscription().then(function(message) {
            $scope.recording = false;
            phrase.setTranscription(message);
            $location.path('/result');
          }, function(error) {
            $scope.recording = false;
            $scope.errorMsg = error;
          });
        }

        if ($scope.countdown === 0) {
          clearCountdown();
        }
      }

      function clearCountdown() {
        $interval.cancel(interval);
        interval = null;
      }
  }]);
