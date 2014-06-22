angular.module('getitright')
  .controller('InputCtrl', ['$scope', '$location', 'phrase', function($scope, $location, phrase) {
    $scope.usePhrase = function(value) {
      if (phrase.prepare(value)) {
        phrase.set(value);
        $location.path('/record');
      }
    };
  }]);
