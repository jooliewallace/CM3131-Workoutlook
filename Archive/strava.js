const express = require('express');
const axios = require('axios');
const app = express();

const client_id = '104297';
const client_secret = '38b3d4c5eb2e9272957e87f83304bfb66aead72c';
const redirect_uri = 'http://127.0.0.1:5500/profile.html'; // This needs to match your Strava application's redirect URI

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    // Exchange the authorization code for an access token
    const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id,
        client_secret,
        code,
        grant_type: 'authorization_code',
    });

    const access_token = response.data.access_token;

    // Use the access token to make API requests to Strava
    const activities = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    res.send(activities.data);
});

app.listen(5500, () => {
    console.log('Server started on port 5500');
});

// to get run data

const accessToken = 'bf2ff9eab657f4749a7d35450d7ae82d54b8d453';
const apiEndpoint = 'https://www.strava.com/api/v3/athlete/activities';
const activitiesDiv = document.getElementById('activities');

fetch(apiEndpoint, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
.then(response => response.json())
.then(data => {
  data.forEach(activity => {
    const activityDiv = document.createElement('div');
    const activityName = document.createElement('h3');
    activityName.innerText = activity.name;
    const activityDistance = document.createElement('p');
    activityDistance.innerText = `Distance: ${activity.distance}`;
    activityDiv.appendChild(activityName);
    activityDiv.appendChild(activityDistance);
    activitiesDiv.appendChild(activityDiv);
  });
})
.catch(error => console.error(error));


