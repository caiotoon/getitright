angular.module('getitright')
  .controller('RecordCtrl', ['$scope', '$location', '$timeout', 'phrase', 'transcription',
    function($scope, $location, $timeout, phrase, transcription) {
      var REQUEST_PERMISSION_MSG = 'Requesting permission...',
        timeout, transcriptionPromise;

      $scope.actualPhrase = phrase.get();

      if (!phrase.prepare($scope.actualPhrase)) {
        $location.path('/enter');
      }

      $scope.record = function() {
        if (!$scope.recording) {
          $scope.recording = true;
          timeout = $timeout(requestPermissionDelay, 1000);
          requestTranscript();
        }
      };

      function requestPermissionDelay() {
        $scope.errorMsg = REQUEST_PERMISSION_MSG;
      }

      function clearPermissionRequestDelay() {
        if (timeout) {
          $timeout.cancel(timeout);
          timeout = null;
        }
      }

      function requestTranscript() {
        phrase.setTranscription(null);
        transcription.startTranscription().then(
          function(transcript) {
            cancelRecording();
            phrase.setTranscription(transcript);
            $location.path('/result');
          }, function(error) {
            cancelRecording();
            $scope.errorMsg = error;
          }, function(notification) {
            if (notification === 'started') {
              $scope.errorMsg = null;
              $scope.voiceRecording = true;
              clearPermissionRequestDelay();
            }
          }
        );
      }

      function cancelRecording() {
        $scope.recording = false;
        $scope.voiceRecording = false;
        $scope.errorMsg = null;

        clearPermissionRequestDelay();
      }
  }]);
