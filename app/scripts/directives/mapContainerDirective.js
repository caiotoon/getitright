angular.module('getitright')
  .directive('mapContainer', function() {
    return {
      restrict: 'E',
      template: '<div class="map-container"><h4>Check who else is getting it right around the world</h4><div class="arrow"></div><div class="map-placeholder"></div></div>',
      link: function(scope, element, attrs) {
        var w = $(window),
            arrow = element.find('.arrow').delay(200).fadeIn(),
            mapPlaceHolder = element.find('.map-placeholder'),
            map;

        w.on('scroll', showMap);

        arrow.fadeIn(200).off('click').on('click', function() {
          w.scrollTop(window.scrollY + 600);
        });

        function showMap() {
          if (window.scrollY > 20) {
            w.off('scroll');
            arrow.off('click').fadeOut(200);

            map = new google.maps.Map(mapPlaceHolder[0], { center: new google.maps.LatLng(0, 0), zoom: 1 });

            if (Modernizr.geolocation) {
              navigator.geolocation.getCurrentPosition(function(geoposition) {
                var coord = new google.maps.LatLng(geoposition.coords.latitude, geoposition.coords.longitude),
                    marker = new google.maps.Marker({ position: coord, animation: google.maps.Animation.DROP });

                marker.setMap(map);
              });
            }
          }
        }
      }
    };
  });
