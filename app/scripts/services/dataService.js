angular.module('getitright')
  .service('data', ['$http', '$q', function($http, $q) {
    this.heartbeat = function(long, lat, uid) {
      var data = {long: long, lat: lat};

      if (uid) {
        data.id = uid;
      }

      return $http.post('/api/heartbeat', data).then(function(response) {
        var id = response.data && response.data.uid;

        if (id) {
          return id;
        } else {
          $q.reject(response.statusText);
        }
      });
    };

    this.loadCoordinates = function() {
      $http.get('/api/active-users').then(function(response) {
        if (response.data) {
          return response.data;
        } else {
          $q.reject(response.statusText);
        }
      });
    };
  }]);
