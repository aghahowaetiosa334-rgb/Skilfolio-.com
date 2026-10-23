
/* =========================================
   SKILLFOLIO - EDIT PROFILE JAVASCRIPT
========================================= */

"use strict";

const profileForm = document.getElementById("editProfileForm");
const fullNameInput = document.getElementById("fullName");
const usernameInput = document.getElementById("username");
const bioInput = document.getElementById("bio");
const skillsInput = document.getElementById("skills");
const pictureInput = document.getElementById("profilePicture");
const avatarPreview = document.getElementById("avatarPreview");
const formMessage = document.getElementById("formMessage");
const bioCount = document.getElementById("bioCount");

const STORAGE_KEY = "skillfolioProfile";

let selectedPicture = "";

/* Show a message to the user */
function showMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("error", isError);
}

/* Display a profile picture or the default icon */
function showPicture(source) {
  avatarPreview.replaceChildren();

  if (!source) {
    const icon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");

    const head = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    head.setAttribute("cx", "12");
    head.setAttribute("cy", "8");
    head.setAttribute("r", "4");

    const body = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    body.setAttribute("d", "M4 21a8 8 0 0 1 16 0");

    icon.append(head, body);
    avatarPreview.appendChild(icon);
    return;
  }

  const image = document.createElement("img");
  image.src = source;
  image.alt = "Selected profile picture";
  avatarPreview.appendChild(image);
}

/* Update the bio character counter */
function updateBioCount() {
  bioCount.textContent = `${bioInput.value.length}/200`;
}

bioInput.addEventListener("input", updateBioCount);

/* Load the saved profile */
function loadProfile() {
  try {
    const savedProfile = localStorage.getItem(STORAGE_KEY);

    if (!savedProfile) {
      updateBioCount();
      return;
    }

    const profile = JSON.parse(savedProfile);

    fullNameInput.value = profile.fullName || "";
    usernameInput.value = profile.username || "";
    bioInput.value = profile.bio || "";
    skillsInput.value = profile.skills || "";

    selectedPicture = profile.profilePicture || "";
    showPicture(selectedPicture);
    updateBioCount();
  } catch (error) {
    console.error("Could not load the saved profile:", error);
    showMessage(
      "We couldn't load your saved profile. Please try refreshing.",
      true
    );
  }
}

/* Preview a selected image */
pictureInput.addEventListener("change", function () {
  const file = pictureInput.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showMessage("Please choose a valid image file.", true);
    pictureInput.value = "";
    return;
  }

  if (file.size > 1024 * 1024) {
    showMessage(
      "Please choose an image smaller than 1 MB.",
      true
    );
    pictureInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    selectedPicture = reader.result;
    showPicture(selectedPicture);
    showMessage("Picture preview updated.");
  };

  reader.onerror = function () {
    showMessage("We couldn't read that image. Try another.", true);
  };

  reader.readAsDataURL(file);
});

/* Save profile information */
profileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = fullNameInput.value.trim();
  const username = usernameInput.value.trim().replace(/^@+/, "");
  const bio = bioInput.value.trim();
  const skills = skillsInput.value.trim();

  if (!fullName || !username) {
    showMessage("Please enter your full name and username.", true);
    return;
  }

  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    showMessage(
      "Use only letters, numbers, dots, and underscores in your username.",
      true
    );
    return;
  }

  const profile = {
    fullName,
    username,
    bio,
    skills,
    profilePicture: selectedPicture
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    usernameInput.value = username;
    showMessage("Your profile has been saved successfully! 💜");
  } catch (error) {
    console.error("Could not save the profile:", error);
    showMessage(
      "Unable to save your profile. Try a smaller image or another browser tab.",
      true
    );
  }
});

/* Initialize */
loadProfile();
