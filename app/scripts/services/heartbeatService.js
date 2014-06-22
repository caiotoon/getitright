angular.module('getitright')
  .service('heartbeat', ['data', function(data) {
    var RETRIAL_INTERVAL = 30000,
      HEARTBEAT_INTERVAL = 120000,
      timeoutId, uid, started;

    function beat() {
      data.heartbeat(uid).then(function(id) {
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

    this.startBeating = function() {
      if (!started) {
        started = true;
        beat();
      }
    };
  }]);
