```javascript
"use strict";

// Set the copyright year automatically.
const yearElement = document.querySelector("#current-year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

console.log("Skillfolio welcome page is ready.");
```