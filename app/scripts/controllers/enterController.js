angular.module('getitright')
  .controller('EnterCtrl', ['$scope', '$location', 'phrase', function($scope, $location, phrase) {
    $scope.usePhrase = function(value) {
      if (phrase.prepare(value)) {
        phrase.set(value);
        $location.path('/record');
      }
    };

    $scope.userInputPhrase = phrase.get();
  }]);
