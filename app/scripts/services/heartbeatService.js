angular.module('getitright')
  .service('heartbeat', ['data', function(data) {
    var RETRIAL_INTERVAL = 30000,
      HEARTBEAT_INTERVAL = 120000,
      timeoutId, uid, started, _lat, _long;

    function beat() {
      data.heartbeat(_long, _lat, uid).then(function(id) {
        if (id) {
          uid = id;
          delayBeat(HEARTBEAT_INTERVAL);
        } else {
          delayBeat(RETRIAL_INTERVAL);
        }
      }, function() {
        delayBeat(RETRIAL_INTERVAL);
      });
    }

    function delayBeat(interval) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(beat, interval);
    }

    this.startBeating = function(lat, long) {
      if (!started) {
        _lat = lat;
        _long = long;
        started = true;
        beat();
      }
    };
  }]);
