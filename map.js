// MAP API JAVASCRIPT

var map, markers = [], lines = [], directionsService, directionsRenderer;
var routes = [];

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 57.1499, lng: -2.0990 },
        zoom: 13
    });

    // Initialize the directions service and renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map
    });

    // Add a listener for clicks on the map to add a new marker
    map.addListener('click', function (event) {
        addMarker(event.latLng);
        calculateDistance();
        if (markers.length === 1) {
            getWeather(event.latLng);
        }
    });

    function addRoute(route) {
        // Create a new polyline and add it to the map
        var path = route.markers.map(function (marker) {
          return new google.maps.LatLng(marker.lat, marker.lng);
        });
        var polyline = new google.maps.Polyline({
          path: path,
          map: map,
          strokeColor: '#0000FF',
          strokeOpacity: 0.7,
          strokeWeight: 4
        });
      
        // Get the latitude of the first marker's location
        var lat = route.markers[0].lat;
        var lng = route.markers[0].lng;
        var latLng = new google.maps.LatLng(lat, lng);
      
        // If there's only one marker in the route, get the weather at that location and time
        if (route.markers.length === 1) {
          getWeather(latLng);
        }


        // Open a connection to the IndexedDB database
        var request = window.indexedDB.open('routesDB', 1);

        // Create the object store for routes if it doesn't exist
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains('routes')) {
                var store = db.createObjectStore('routes', { keyPath: 'id', autoIncrement: true });
            }
        };


        // Add a listener for clicks on the polyline to delete it
        polyline.addListener('click', function (event) {
            deleteRoute(polyline);
        });
    }

    function clearRoute() {
        // Remove all markers from the map
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];

        // Remove all lines from the map
        for (var i = 0; i < lines.length; i++) {
            lines[i].setMap(null);
        }
        lines = [];

        // Clear the directions renderer
        directionsRenderer.setDirections({});

        // Reset the distance display
        document.getElementById('distance').textContent = '0.00';
    }


    function addMarker(location) {
        // Check if location is a valid LatLng object
        if (!(location instanceof google.maps.LatLng)) {
            console.error('Invalid location parameter');
            return;
        }
    
        // If there are no markers on the map, add a new marker and return
        if (markers.length === 0) {
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
    
            markers.push(marker);
    
            return;
        }
    
        // Create a new marker and add it to the map
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
    
        markers.push(marker);
    
        // If there are at least two markers, calculate the route and display it
        if (markers.length > 1) {
            // Calculate the route and display it
            calculateRoute();
    
            // Draw lines between all the markers
            var path = markers.map(function (marker) {
                return marker.getPosition();
            });
            var line = new google.maps.Polyline({
                path: path,
                map: map
            });
            lines.push(line);
        }
    
        // If this is the first marker, get the weather at this location and time
        if (markers.length === 1) {
            getWeather(location);
        }
    }

    function deleteMarker(index) {
        // Remove the marker from the map and the array
        markers[index].setMap(null);
        markers.splice(index, 1);

        // Remove the corresponding line from the map and the array
        lines[index].setMap(null);
        lines.splice(index, 1);

        // Recalculate the route and display it
        calculateRoute();

        // Recalculate the distance and display it
        calculateDistance();
    }

    function addRoute(route) {
        // Create a new polyline and add it to the map
        var path = route.markers.map(function (marker) {
            return new google.maps.LatLng(marker.lat, marker.lng);

        });
        var polyline = new google.maps.Polyline({
            path: path,
            map: map,
            strokeColor: '#0000FF',
            strokeOpacity: 0.7,
            strokeWeight: 4
        });


        // Add a listener for clicks on the polyline to delete it
        polyline.addListener('click', function (event) {
            deleteRoute(polyline);
        });
    }

    function clearRoute() {
        // Remove all markers from the map
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    
        // Remove all lines from the map
        for (var i = 0; i < lines.length; i++) {
            lines[i].setMap(null);
            lines[i].removeListener('click');
        }
        lines = [];
    
        // Clear the directions renderer
        directionsRenderer.setDirections({});
    
        // Reset the distance display
        document.getElementById('distance').innerHTML = '0.00';
    }
    

    function deleteRoute(polyline) {
        // Remove the polyline from the map and the array
        polyline.setMap(null);
        var index = lines.indexOf(polyline);
        if (index !== -1) {
            lines.splice(index, 1);
        }
    }
    var route = {
        name: 'My Route',
        distance: '10.00 km',
        markers: [
            { lat: 37.7749, lng: -122.4194 },
            { lat: 37.8716, lng: -122.2727 }
        ]
    };

    addRoute(route);

    function calculateRoute() {
        // Check if there are at least two markers on the map
        if (markers.length < 2) {
          return;
        }
      
        // Calculate the route and display it
        var origin = markers[0].getPosition();
        var destination = markers[markers.length - 1].getPosition();
        var waypoints = markers.slice(1, markers.length - 1).map(function (marker) {
          return {
            location: marker.getPosition(),
            stopover: true
          };
        });
        var request = {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
          }
        });
      }
      
    function calculateDistance() {
        var totalDistance = 0;
        for (var i = 0; i < markers.length - 1; i++) {
            totalDistance += google.maps.geometry.spherical.computeDistanceBetween(markers[i].getPosition(), markers[i + 1].getPosition());
        }
        document.getElementById('distance').innerHTML = (totalDistance / 1000).toFixed(2);
    }
}

function displayDateTime() {
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let dateTime = new Date(`${date} ${time}`);
    let formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
    document.getElementById("result").innerHTML = `You selected: ${formattedDateTime}`;

    // Call the getWeather function with the location, date, and time
    getWeather(location, date, time);
}

function getWeather(location) {
    const latitude = location.lat();
    const longitude = location.lng();
  
    const apiKey = 'f7e12627407bf5695eebfd813ed35fd6';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const weather = data.weather[0].main;
        const temp = data.main.temp;
        const windSpeed = data.wind.speed;
  
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        const li2 = document.createElement('li');
        const li3 = document.createElement('li');
  
        li1.textContent = `Weather: ${weather}`;
        li2.textContent = `Temperature: ${temp}°F`;
        li3.textContent = `Wind Speed: ${windSpeed} mph`;
  
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
  
        const weatherContainer = document.getElementById('weather');
        weatherContainer.innerHTML = '';
        weatherContainer.appendChild(ul);
      })
      .catch(error => {
        console.error(error);
      });
  }
  

// Open a connection to the IndexedDB database
var request = window.indexedDB.open('routesDB', 1);

// Create the object store for routes if it doesn't exist
request.onupgradeneeded = function (event) {
    var db = event.target.result;
    if (!db.objectStoreNames.contains('routes')) {
        var store = db.createObjectStore('routes', { keyPath: 'id', autoIncrement: true });
    }
};

function saveRoute() {
    if (!Array.isArray(markers)) {
        markers = [];

        var date = document.getElementById('date').value;
        var time = document.getElementById('time').value;
        var datetime = date + ' ' + time;


        // Get the weather value
        var weather = document.getElementById('weather').textContent;

        // Get the name value and check that it is not empty
        var nameInput = document.getElementById('route-name');
        var name = nameInput.value.trim();
        if (!name) {
            alert('Please enter a route name.');
            return;
        }

        // Get the distance
        var distance = document.getElementById('distance').textContent;

        // Map the markers to an array of lat/lng objects
        var markers = markers.map(function (marker) {
            return { lat: marker.getPosition().lat(), lng: marker.getPosition().lng() };
        });

        // Create a new route 
        var route = { datetime: datetime, name: name, distance: distance, markers: markers, weather: weather };

        // Open the database
        var request = window.indexedDB.open('routesDB', 1);

        request.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction(['routes'], 'readwrite');
            var store = transaction.objectStore('routes');
            var addRequest = store.add(route);
            addRequest.onsuccess = function (event) {
                console.log('Route added to IndexedDB');

                nameInput.value = '';
            };

            addRequest.onerror = function (event) {
                console.error('Error adding route to IndexedDB');
            };
        };
    }
}


