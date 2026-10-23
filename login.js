
"use strict";

const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const forgotPassword = document.querySelector("#forgot-password");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  if (!loginForm.reportValidity()) {
    return;
  }

  if (!email || !password) {
    loginMessage.textContent = "Please enter your email and password.";
    return;
  }

  // Demo login: redirect to the Skillfolio homepage.
  window.location.href = "home.html";
});

forgotPassword.addEventListener("click", function (event) {
  event.preventDefault();

  loginMessage.textContent =
    "Password recovery will be available when authentication is connected.";
});
