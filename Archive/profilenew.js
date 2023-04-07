const profileDiv = document.getElementById('profile');
const loginDiv = document.getElementById('login');
const usernameSpan = document.getElementById('username');
const nameSpan = document.getElementById('name');
const emailSpan = document.getElementById('email');
const phoneSpan = document.getElementById('phone');
const loginForm = document.querySelector('#login form');

// Check if the user is already logged in
const isLoggedIn = false; // Replace with your authentication check
if (isLoggedIn) {
  showProfile();
} else {
  showLogin();
}

// Show the profile section
function showProfile() {
  profileDiv.style.display = 'block';
  loginDiv.style.display = 'none';
  // Replace with your code to retrieve the user's profile information
  usernameSpan.textContent = 'JohnDoe';
  nameSpan.textContent = 'John Doe';
  emailSpan.textContent = 'johndoe@example.com';
  phoneSpan.textContent = '123-456-7890';
}

// Show the login section
function showLogin() {
  profileDiv.style.display = 'none';
  loginDiv.style.display = 'block';
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = loginForm.elements.username.value;
    const password = loginForm.elements.password.value;
    // Replace with your authentication code
    if (username === 'user' && password === 'password') {
      showProfile();
    } else {
      alert('Incorrect username or password');
    }
  });
}
