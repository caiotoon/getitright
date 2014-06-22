angular.module('getitright')
  .controller('HeaderCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.$location = $location;
  }]);
