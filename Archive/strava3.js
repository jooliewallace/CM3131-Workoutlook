		// Strava API credentials
		const CLIENT_ID = "104297";
		const CLIENT_SECRET = "ef3028dd9a5635363b41bb277c112fba8f4ca97b";
		const REDIRECT_URI = "http://127.0.0.1:5500/strava3.html";
		const AUTHORIZATION_ENDPOINT = "https://www.strava.com/oauth/authorize";
		const TOKEN_ENDPOINT = "https://www.strava.com/oauth/token";
		const API_ENDPOINT = "https://www.strava.com/api/v3";

		// Requested scopes
		const SCOPES = "read_all,profile:read_all";

		// State variable to prevent CSRF attacks
		const STATE = Math.random().toString(36).substring(2);

		// Function to redirect the user to the Strava authorization page
		function authorize() {
			const url = `${AUTHORIZATION_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}&state=${STATE}`;
			window.location.href = url;
		}

		// Function to exchange the authorization code for an access token
		function exchangeCodeForToken(code) {
			const data = {
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				code: code,
				grant_type: "authorization_code",
				redirect_uri: REDIRECT_URI
			};
			return $.ajax({
				method: "POST",
				url: TOKEN_ENDPOINT,
				data: data
			});
		}

    // Function to get the user's latest run data
function getLatestRunData(accessToken) {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const url = `${API_ENDPOINT}/athlete/activities?access_token=${accessToken}&after=${now}&per_page=1`;
    return $.ajax({
        method: "GET",
        url: url
    });
}

// Function to display the user's latest run data
function displayLatestRunData(data) {
    const latestRun = data[0];
    $("#distance").text(latestRun.distance);
    $("#start-time").text(latestRun.start_date_local);
}

// Function to handle the authorization process
function handleAuthorization() {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
        exchangeCodeForToken(code)
            .then(data => {
                const accessToken = data.access_token;
                $("#login").hide();
                $("#data").show();
                getLatestRunData(accessToken)
                    .then(data => displayLatestRunData(data));
            })
            .catch(error => console.error(error));
    }
}

// Call handleAuthorization on page load
$(document).ready(() => {
    handleAuthorization();
});


	
