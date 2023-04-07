let map;
let polyline = null;
let path = [];
let directionsService;
let directionsRenderer;
let weatherDisplay = document.getElementById('weather-display');

async function initMap() {
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 57.14965, lng: 56.6700 },
    zoom: 8,
  });
}

initMap();

  
  // Initialize the Directions Service and Renderer
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    polylineOptions: {
      strokeColor: '#0000FF',
      strokeOpacity: 0.7,
      strokeWeight: 5
    }
  });

  // Add a marker at the center of the map
  marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    draggable: true
  });

  // Add click event listener to the map
  map.addListener('click', (event) => {
    // Add a point to the path and redraw the polyline
    path.push(event.latLng);
    polyline.setPath(path);
    updateDistance();
  });

  // Add click event listener to the marker
  marker.addListener('click', () => {
    // Clear the path and redraw the polyline
    path = [];
    polyline.setPath(path);
    updateDistance();
  });

  // Initialize the polyline
  polyline = new google.maps.Polyline({
    map: map,
    path: path,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });

  document.getElementById('draw-route-btn').addEventListener('click', () => {
    // Enable drawing mode
    polyline.setOptions({ editable: true });
    marker.setMap(null);
    updateDistance(); // add this line
  });
  
  // Add click event listener to the map
  map.addListener('click', (event) => {
    // Add a point to the path and redraw the polyline
    path.push(event.latLng);
    polyline.setPath(path);
    updateDistance(); // add this line
  });
  

  // Add click event listener to the "Clear Route" button
  document.getElementById('clear-route-btn').addEventListener('click', () => {
    // Clear the path and redraw the polyline
    path = [];
    polyline.setPath(path);
    polyline.setOptions({ editable: false });
    marker.setMap(map);
    marker.setPosition(map.getCenter());
    updateDistance();
    weatherDisplay.innerHTML = '';
  });

  // Add click event listener to the "Get Weather" button
  document.getElementById('get-weather-btn').addEventListener('click', () => {
    getWeatherAlongRoute();
  });


