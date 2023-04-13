//USING THE WEATHER API ON THE SETTINGS PAGE TO STORE MAIN LOCATION
//THERE IS ALSO A FUNCTION ON HERE TO CLEAR THE MAP ROUTE ON THE HOME PAGE


// Weather API key and source
const apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "f7e12627407bf5695eebfd813ed35fd6";

// Get the latitude, longitude, and units from local storage, or use default values
let lat = localStorage.getItem("lat") || 51.5074; // default to London coordinates
let lon = localStorage.getItem("lon") || -0.1278; // default to London coordinates
let units = localStorage.getItem("units") || "metric";

// Get the notification threshold from local storage, or use a default value of 5
const notificationThreshold = localStorage.getItem("notificationThreshold") || 5;

// Get the minimum temperature from local storage, or use a default value of 0
const minimumTemperature = localStorage.getItem("minimumTemperature") || 0;

// Sections that the user can add input
let city = localStorage.getItem('city') || 'London'; // default to London
const cityInput = document.getElementById("city-input");
const unitsInput = document.getElementById("units-input");
const minimumTemperatureInput = document.getElementById("minimum-temperature-input");
const thresholdInput = document.getElementById("threshold-input");
const thresholdInput1 = document.getElementById("threshold-input1");
const saveButton = document.querySelector('#saveButton');
const clearButton = document.querySelector('#clearRouteButton');

window.addEventListener("load", function() {
  // Set the values of the input fields based on the saved values
  cityInput.value = localStorage.getItem('city') || 'London';
  unitsInput.value = localStorage.getItem('units') || 'metric';
  minimumTemperatureInput.value = localStorage.getItem('minimumTemperature') || 0;
  thresholdInput.value = localStorage.getItem('notificationThreshold') || 0;


  // Update the city and units with the saved values
  city = cityInput.value;
  units = unitsInput.value;

  // Call the function to update the weather with the saved values
  fetchWeatherData();
});


if (saveButton) {
  saveButton.addEventListener('click', () => {
    localStorage.setItem('city', cityInput.value);
    localStorage.setItem('units', unitsInput.value);
    localStorage.setItem('notificationThreshold', thresholdInput.value);
    localStorage.setItem('minimumTemperature', minimumTemperatureInput.value);
    console.log('Save button clicked');

    // Update the city and units with the new user inputs
    city = cityInput.value;
    units = unitsInput.value;

    // Update the weather with the new user inputs
    fetchWeatherData();
  });
}


function clearRoute() {
  // Get the map object
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 57.1499, lng: -2.0990 },
    zoom: 13,
  });

  // Get the polyline representing the route
  const polyline = new google.maps.Polyline({
    path: [],
    strokeColor: "red",
    strokeWeight: 3,
  });

  // Set the polyline path to an empty array
  polyline.setPath([]);

  // Remove the polyline from the map
  polyline.setMap(null);

  console.log("Route cleared");
}



function fetchWeatherData() {
  fetch(`${apiEndpoint}?q=${city}&units=${units}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const currentTemperature = data.main.temp;
      const weatherDescription = data.weather[0].description;
      const weatherIcon = data.weather[0].icon;

      const toolbars = document.querySelectorAll(".toolbar"); // get all toolbars

      toolbars.forEach(toolbar => { // loop over each toolbar
        // Updating weather info
        const temperatureElement = toolbar.querySelector("ion-toolbar-content:first-of-type");
        temperatureElement.textContent = `${currentTemperature}°`;
        const descriptionElement = toolbar.querySelector("ion-toolbar-content:last-of-type");
        descriptionElement.textContent = weatherDescription;
        const iconElement = toolbar.querySelector("#icon");
        iconElement.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        iconElement.alt = weatherDescription;
      });

      console.log(`Current temperature in ${city}: ${currentTemperature}°C`);
      console.log(`Current weather in ${city}: ${weatherDescription}`);
      console.log(`Current weather icon in ${city}: ${weatherIcon}`);
      console.log(`Current temperature in ${city}: ${currentTemperature}°C`);
      console.log(`Current weather in ${city}: ${weatherDescription}`);
      console.log(`Current weather icon in ${city}: ${weatherIcon}`);

      // Check if the temperature is below the threshold and show a notification if it is
      if (currentTemperature < minimumTemperature) {
        if (Notification.permission === "granted") {
          const notification = new Notification(`Temperature Alert: ${currentTemperature}°C`, {
            body: `The temperature in ${city} has dropped below ${minimumTemperature}°C.`,
            // icon: "path/to/icon.png" // icon
          });

          console.log(`Temperature drop alert notification shown for ${city}.`);

        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              const notification = new Notification(`Temperature Alert: ${currentTemperature}°C`, {
                body: `The temperature in ${city} has dropped below ${minimumTemperature}°C.`,
                // icon: "path/to/icon.png" // icon
              });

              console.log(`Temperature drop alert notification shown for ${city}.`);

            } else {
              console.log("User denied permission for notifications.");
            }
          });
        }
      }


            // Check if the temperature is below the threshold and show a notification if it is
            if (currentTemperature > thresholdInput1) {
              if (Notification.permission === "granted") {
                const notification = new Notification(`Temperature Alert: ${currentTemperature}°C`, {
                  body: `The temperature in ${city} has risen above ${thresholdInput1}°C.`,
                  // icon: "path/to/icon.png" // icon
                });
      
                console.log(`Temperature rise alert notification shown for ${city}.`);
      
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    const notification = new Notification(`Temperature Alert: ${currentTemperature}°C`, {
                      body: `The temperature in ${city} has risen above ${thresholdInput1}°C.`,
                      // icon: "path/to/icon.png" // icon
                    });
      
                    console.log(`Temperature rise alert notification shown for ${city}.`);
      
                  } else {
                    console.log("User denied permission for notifications.");
                  }
                });
              }
            }
      
    })
    
    .catch(error => {
      console.error(error);
    });

}
