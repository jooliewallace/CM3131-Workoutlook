const client_id = '104297';
const client_secret = '38b3d4c5eb2e9272957e87f83304bfb66aead72c';
const redirect_uri = 'http://127.0.0.1:5500/profile.html';

// Redirect the user to Strava's authorization page
function redirectToAuthorizationPage() {
  const scope = 'read_all,profile:read_all'; // Scopes determine the level of access the application has to the user's data
  const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`;
  window.location.href = authorizationUrl;
}

// Exchange the authorization code for an access token
async function exchangeAuthorizationCodeForAccessToken(code) {
  const response = await axios.post('https://www.strava.com/oauth/token', {
    client_id,
    client_secret,
    code,
    grant_type: 'authorization_code',
    redirect_uri,
  });
  return response.data.access_token;
}

// Fetch the user's activities using the access token
async function fetchActivities(access_token) {
  const apiEndpoint = 'https://www.strava.com/api/v3/athlete/activities';
  const response = await axios.get(apiEndpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data;
}

// On page load, check if the authorization code is in the URL query parameters and exchange it for an access token
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
if (code) {
  exchangeAuthorizationCodeForAccessToken(code)
    .then((access_token) => {
      return fetchActivities(access_token);
    })
    .then((activities) => {
      const activitiesDiv = document.getElementById('activities');
      activities.forEach((activity) => {
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
    .catch((error) => console.error(error));
} else {
  // If the authorization code is not in the URL query parameters, redirect the user to Strava's authorization page
  redirectToAuthorizationPage();
}


//to get the activity data

fetch('https://www.strava.com/api/v3/athlete/activities', {
  headers: {
    'Authorization': 'Bearer 9ea586c94226166f6604b096d042221da78da91d'
  }
})
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error(error);
});

