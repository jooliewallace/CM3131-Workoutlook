let map; // Declare the map variable outside of the functions
let path = []; // Declare the path variable to store the points on the path
let selectedDate, selectedTime; // Declare the variables to store the selected date and time

const dateObj = new Date(date + ' ' + time);
const unixTime = Math.floor(dateObj.getTime() / 1000);
const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&dt=${unixTime}&appid=${apiKey}`;


function initMap() {
  // Create a new map instance
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 57.149717, lng: -2.094278 },
    zoom: 13
  });

  // Add a listener to the map to allow users to draw a path
  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYLINE]
    },
    polylineOptions: {
      editable: true,
      strokeColor: '#FF0000',
      strokeWeight: 2
    }
  });
  drawingManager.setMap(map);

  // Add a listener to the path to update the distance when it changes
  google.maps.event.addListener(drawingManager, 'polylinecomplete', function (polyline) {
    path = polyline.getPath().getArray();
    updateDistance();
    updateWeather(path, selectedDate, selectedTime);
    google.maps.event.addListener(polyline.getPath(), 'set_at', function () {
      path = polyline.getPath().getArray();
      updateDistance();
      updateWeather(path, selectedDate, selectedTime);
    });
    google.maps.event.addListener(polyline.getPath(), 'insert_at', function () {
      path = polyline.getPath().getArray();
      updateDistance();
      updateWeather(path, selectedDate, selectedTime);
    });
  });

  // Add a listener to the date and time inputs to update the selected date and time when they change
  document.getElementById('date-input').addEventListener('change', function () {
    selectedDate = this.value;
    updateWeather(path, selectedDate, selectedTime);
  });
  document.getElementById('time-input').addEventListener('change', function () {
    selectedTime = this.value;
    updateWeather(path, selectedDate, selectedTime);
  });
}

function updateDistance() {
  // Check that the google.maps.geometry library is loaded
  if (!google.maps.geometry) {
    console.error('The google.maps.geometry library is not loaded');
    return;
  }

  // Calculate the total distance between all points on the path
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    distance += google.maps.geometry.spherical.computeDistanceBetween(path[i], path[i + 1]);
  }

  // Convert the distance from meters to kilometers
  distance /= 1000;

  // Display the distance on the page
  document.getElementById('distance-display').textContent = `Total distance: ${distance.toFixed(2)} kilometers`;
}

function updateWeather(points, date, time) {
  // Check that the fetch API is available
  if (!window.fetch) {
    console.error('The fetch API is not available');
    return;
  }

  if (date && time && points.length > 0) {
    const apiKey = 'f7e12627407bf5695eebfd813ed35fd6';

    // Convert the date and time to Unix time
    const dateObj = new Date(date + ' ' + time);
    const unixTime = Math.floor(dateObj.getTime() / 1000);

    // Fetch the weather data for the first point using the OpenWeatherMap API
    const lat = points[0].lat();
    const lng = points[0].lng();
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&dt=${unixTime}&appid=${apiKey}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const weather = data.current.weather[0].description;
        const temperature = (data.current.temp - 273.15).toFixed(1);
        const location = `(${lat.toFixed(4)}, ${lng.toFixed(4)}) on ${date}`;
        const displayText = `Weather at ${location}: ${weather}, Temperature: ${temperature}°C`;
        document.getElementById('weather-display').textContent = displayText;
      })
      .catch(error => console.error(error));
  }
}


// Clear the path from the map and local storage
function clearRoute() {
  path = [];
  document.getElementById('distance-display').textContent = '';
  document.getElementById('weather-display').textContent = '';
  localStorage.removeItem("path");
  const mapPolyline = map.data.getFeatureById('polyline');
  if (mapPolyline) {
    map.data.remove(mapPolyline);
  }
}


function savePath() {
  const pathName = document.getElementById('path-name').value;
  const pathDate = document.getElementById('path-date').value;
  const pathDescription = document.getElementById('path-description').value;

  const timestamp = Math.floor(new Date(pathDate + 'T00:00:00').getTime() / 1000);

  const path = {
    name: pathName,
    date: timestamp,
    description: pathDescription
  };

  localStorage.setItem('path', JSON.stringify(path));

  alert('Path saved successfully!');
}

function clearRoute() {
  localStorage.removeItem('path');

  alert('Path cleared successfully!');
}

