        var map;
        var eqMarkers = [];
        var hourClick = false;
        var weekClick = false;
        var dayClick = false;
        var monthClick = false;
        var tweetsArray = [];
        var tweetMarkers = [];

        function initialize( ) {

          var styledMap = new google.maps.StyledMapType(styles,
            {name: "Styled Map"});

          var mapOptions = {
            zoom: 3,
            center: new google.maps.LatLng(0,0),
            panControl: false,
            zoomControl: true,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle.SMALL,
              position: google.maps.ControlPosition.TOP_LEFT
            },
            scaleControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            minZoom: 2,
            maxZoom: 5
          }

          map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
          map.mapTypes.set('map_style', styledMap);
          map.setMapTypeId('map_style');

        var script = document.createElement('script');
        script.src = 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/all/hour';
        document.getElementsByTagName('head')[0].appendChild(script);

        var script = document.createElement('script');
        script.src = 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/all/day';
        document.getElementsByTagName('head')[0].appendChild(script);

        var script = document.createElement('script');
        script.src = 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/4.5/week';
        document.getElementsByTagName('head')[0].appendChild(script);

         var script = document.createElement('script');
        script.src = 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/4.5/month';
        document.getElementsByTagName('head')[0].appendChild(script);

      }

       // Loop through the results array and place a marker
       window.eqfeed_callback = function(results) {
        console.log(results);
        for (var i = 0; i < results.features.length; i++) {
          var earthquake = results.features[i];
          var coords = earthquake.geometry.coordinates;
          var latLng = new google.maps.LatLng(coords[1],coords[0]);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: getCircle(earthquake.properties.mag)
          });
          marker.category = results.metadata.title;
          marker.setVisible(false);
          eqMarkers.push(marker);

          google.maps.event.addListener(marker, 'click', function() {
            
                var markerLocation = this.position.jb + ',' + this.position.kb;

                searchTweets(markerLocation);
          });

        }

        console.log(eqMarkers.length);

    }

      function getCircle(magnitude) {
        return {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#CFBE27',
          fillOpacity: 1,
          scale: Math.pow(2, magnitude) / Math.PI,
          strokeColor: '#CFBE27',
          strokeweight: .3
        };
      }

      function showCategory(category) {

        for (var i=0; i<eqMarkers.length; i++) {
          if (eqMarkers[i].category == category) {
            eqMarkers[i].setVisible(true);
          }
        }
      }

      function hideCategory(category) {

        for (var i=0; i<eqMarkers.length; i++) {
          if (eqMarkers[i].category == category) {
            eqMarkers[i].setVisible(false);
          }
        }
      }

      function searchTweets(location) {
            var searchUrl = 'http://search.twitter.com/search.json?q=%23earthquake&geocode=' + location + ',25mi';
            console.log(location);
          $.ajax({
            /* the 'param' function ensures that search terms are properly encoded */
            url: searchUrl,

            dataType: 'jsonp',

            /* since the function runs asynchronously, we need to define what should happen
               when the twitter API sends back a successful response (i.e. HTTP code 200)
            */

            success: function(data) {
              console.log(data);
            }
          });
      }

      //Google Map Style
      var styles = [
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
        { visibility: "off" }
        ]
      },
      {
        stylers: [
        { saturation: -100 }
        ]
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
        { visibility: "off" }
        ]
      },
      {
        featureType: "road.local",
        elementType: "labels",
        stylers: [
        { visibility: "off" }
        ]
      },
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [
        { visibility: "off" }
        ]
      },
      {
        featureType: "landscape.natural.landcover",
        elementType: "all",
        stylers: [
        { visibility: "off" }
        ]
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
        { visibility: "simplified" }
        ]
      }
      ];

$(function(){

    initialize();

    $('#showHour').on('click', function(e){
        e.preventDefault();
        if ( hourClick === false ) {
            showCategory('USGS All Earthquakes, Past Hour');
            hourClick = true;
        } else {
            hideCategory('USGS All Earthquakes, Past Hour');
            hourClick = false;
        }
    });

    $('#showDay').on('click', function(e){
        e.preventDefault();
        if ( dayClick === false ) {
            showCategory('USGS All Earthquakes, Past Day');
            dayClick = true;
        } else {
            hideCategory('USGS All Earthquakes, Past Day');
            dayClick = false;
        }
    });

    $('#showWeek').on('click', function(e){
        e.preventDefault();
        if ( weekClick === false ) {
            showCategory('USGS Magnitude 4.5+ Earthquakes, Past Week');
            weekClick = true;
        } else {
            hideCategory('USGS Magnitude 4.5+ Earthquakes, Past Week');
            weekClick = false;
        }
    });

    $('#showMonth').on('click', function(e){
        e.preventDefault();
        if ( monthClick === false ) {
            showCategory('USGS Magnitude 4.5+ Earthquakes, Past Month');
            monthClick = true;
        } else {
            hideCategory('USGS Magnitude 4.5+ Earthquakes, Past Month');
            monthClick = false;
        }
    });

});
