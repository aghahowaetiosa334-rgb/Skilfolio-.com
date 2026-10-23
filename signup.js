
"use strict";

const signupForm = document.querySelector("#signup-form");
const fullNameInput = document.querySelector("#full-name");
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const termsInput = document.querySelector("#terms");
const formMessage = document.querySelector("#form-message");

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

function clearPasswordError() {
  confirmPasswordInput.setCustomValidity("");
  confirmPasswordInput.removeAttribute("aria-invalid");
}

confirmPasswordInput.addEventListener("input", clearPasswordError);
passwordInput.addEventListener("input", clearPasswordError);

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  clearPasswordError();

  if (!signupForm.reportValidity()) {
    return;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    confirmPasswordInput.setCustomValidity("The passwords do not match.");
    confirmPasswordInput.setAttribute("aria-invalid", "true");
    confirmPasswordInput.reportValidity();
    confirmPasswordInput.focus();

    showMessage("Please make sure both passwords match.", "error");
    return;
  }

  if (!termsInput.checked) {
    showMessage("Please agree to the terms to continue.", "error");
    return;
  }

  // Save basic demo profile details, never the password.
  const profile = {
    fullName: fullNameInput.value.trim(),
    username: usernameInput.value.trim(),
    email: emailInput.value.trim()
  };

  localStorage.setItem(
    "skillfolioSignupProfile",
    JSON.stringify(profile)
  );

  showMessage("Success! Taking you to Skillfolio...", "info");

  // Redirect to the homepage.
  window.location.href = "home.html";
});

console.log("Skillfolio sign-up form is ready.");
