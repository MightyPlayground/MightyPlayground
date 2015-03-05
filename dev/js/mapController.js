angular.module('thoughtdrop.mapController', [])

.controller('mapController', function($scope, $log, Private, Geolocation) {
  var global_lat, global_lon;
  var cityCircle;
  $scope.coverage;
  // renders google map
  function initialize () {
    var map_canvas = document.getElementById('map-canvas');
    var myLatlng = new google.maps.LatLng(global_lat, global_lon);
    map_options = {
      center: myLatlng,
      zoom: 16, 
      mapTypeId: google.maps.MapTypeId.ROADMAP, 
      panControl: false,
      streetViewControl: false,
      zoomControl: false,
      mapTypeControl: false
    }

    var map = new google.maps.Map(map_canvas, map_options)
    //WORKS!!!!
    // setInterval(function(){
    //   console.log(map.getCenter());
    // }, 5000);
    //************** CLICK LISTENER ****************//
    // google.maps.event.addListener(map, 'click', function (event) {
    //     var latitude = event.latLng.lat();
    //     var longitude = event.latLng.lng();
    // });=

  //************** GEO FENCE OVERLAY *****************//
  // var circle = {
  //   strokeColor: '#3371F4',
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   fillColor: '#94EAFD',
  //   fillOpacity: 0.50,
  //   map: map,
  //   center: map.getCenter(), //center needs to be dynamic Angulardatabinding. 
  //   radius: 100

  // };
  // cityCircle = new google.maps.Circle(circle);

  // var myTitle = document.createElement('h1');
  // myTitle.style.color = 'red';
  // myTitle.innerHTML = 'coverage: {{coverage}}'+ "m";
  // var myTextDiv = document.createElement('div');
  // myTextDiv.appendChild(myTitle);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(myTextDiv);

  //************** SEARCH BAR FUNCTIONALITY ****************//
    var input = (document.getElementById('pac-input'));
    var clearButton = (document.getElementById('clearButton'));
    // var input2 = (document.getElementById('subButton'));
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(clearButton);
    var searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));
    // var autocomplete = new google.maps.places.Autocomplete(input);
    //autocomplete.bindTo('bounds', map);

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var position = searchBox.getPlaces()[0].geometry.location;// d & k 
      var newPoint = new google.maps.LatLng(position.lat(), position.lng());
      console.log(newPoint);
      map.setCenter(newPoint);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      searchBox.setBounds(bounds);
    });

    // brokedown panBy function. 
    function offsetCenter(latlng,offsetx,offsety) {
      // latlng is the apparent centre-point
      // offsetx is the distance you want that point to move to the right, in pixels
      // offsety is the distance you want that point to move upwards, in pixels
      // offset can be negative
      // offsetx and offsety are both optional
      var scale = Math.pow(2, map.getZoom());
      var nw = new google.maps.LatLng(
          map.getBounds().getNorthEast().lat(),
          map.getBounds().getSouthWest().lng()
      );
      var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
      var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)
      var worldCoordinateNewCenter = new google.maps.Point(
          worldCoordinateCenter.x - pixelOffset.x,
          worldCoordinateCenter.y + pixelOffset.y
      );
      var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
      return newCenter;
      //map.setCenter(newCenter);
    }// offsetCenter


    console.log('center'+ map.getCenter());
    // convert LNG/LAT into distance
    function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000; // meters
    }
    function getMeters(){
      var center = map.getCenter();
      console.log("got here");
      var offCenter = offsetCenter(map.getCenter(), 53, 0);
      var distance = measure(center.lat(), center.lng(), offCenter.lat(), offCenter.lng());
      console.log('center: ' + center, 'offCenter: ' + offCenter + 'distance: '+ distance);
      return Math.round(distance);
    }


    $scope.clearText = function(){
       getMeters();
       // var center = map.getCenter();
       // var offCenter = offsetCenter(map.getCenter(), 53, 0);
       // var distance = measure(center.lat(), center.lng(), offCenter.lat(), offCenter.lng());
       // console.log('distance: '+ distance);

      document.getElementById('pac-input').value = '';
    }


    $scope.coverage = 100;
    google.maps.event.addListener(map, 'idle', function(){
      $scope.coverage = getMeters();//offsetCenter(map.getCenter(), 53, 0);
      $scope.$apply();
    });
    // $scope.alert = function(){
    //   alert(map.getCenter());
    // };

    $scope.submit = function(){
      Private.saveMessage(map.getCenter(), $scope.coverage);
    }
    
  }//initialized

  // Google GeoCoder. Returns a physical address from latt and lng. 
  // Quotas: 5 per second and 2500 per day 
  function codeLatLng (latt, Lon, cb) {
    var lat = latt;
    var lng = Lon;
    var latlng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({'latLng': latlng}, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          markersObj[lat+', '+lng] = marker;
          // infowindow.setContent(results[1].formatted_address);
          // infowindow.open(map, marker);
          setBounds();  

          cb(results[1].formatted_address);
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }
    //TODO: check logic to see if latt and long exist, if not check. 
  if(!!Geolocation.lastPosition){
    var coordinates = Geolocation.lastPosition.coords;
    global_lat = coordinates.latitude;
    global_lon = coordinates.longitude;
    initialize();
  } else {
      Geolocation.getPosition().then(function(position){
        var coordinates = position.coords;
        global_lat = coordinates.latitude;
        global_lon = coordinates.longitude;
        initialize();
      });  
  }
  


  // map title validity checker. 
  // function submitform () {
  //   var f = document.getElementsByTagName('form')[0];
  //   if(f.checkValidity()) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // 
  });