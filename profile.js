//PROFILE JAVASCRIPT

const profileButton = document.querySelector("#profile-btn");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const userInput = document.getElementById("user-input");
const profilePicture = document.getElementById("profile-picture");
const profilePictureInput = document.getElementById("profile-picture-input");

profileButton.addEventListener("click", function () {
    // Save the values of the input fields and the image to local storage
    localStorage.setItem("name", nameInput.value);
    localStorage.setItem("email", emailInput.value);
    localStorage.setItem("username", userInput.value);
    localStorage.setItem("profilePicture", profilePicture.src);
    console.log("Data saved to local storage.");

});

// When the page is loaded, populate the input fields and the image with the saved values
window.addEventListener("load", function () {
    nameInput.value = localStorage.getItem("name") || "";
    emailInput.value = localStorage.getItem("email") || "";
    userInput.value = localStorage.getItem("username") || "";
    profilePicture.src = localStorage.getItem("profilePicture") || "profile-picture-input";
});

// Update the image
profilePictureInput.addEventListener("change", function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        profilePicture.src = reader.result;
    });
    reader.readAsDataURL(file);
});



