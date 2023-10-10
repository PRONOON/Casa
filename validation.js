// validation.js

// Function to check validation status in LocalStorage
function checkValidationStatus() {
    const validationStatus = localStorage.getItem("validationStatus");
    if (!validationStatus || !JSON.parse(validationStatus).validated) {
        // Validation status not found or not validated
        alert("VALIDATION REQUIRED: This usually happens when you access our platform on a new phone or browser.");
        window.location.href = "VERIFY.html"; // Redirect to OTP page
    }
}

// Call the checkValidationStatus function when the page loads
window.addEventListener("load", checkValidationStatus);
