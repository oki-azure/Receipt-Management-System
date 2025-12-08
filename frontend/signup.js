// Fill out the form fields
document.querySelector('input[placeholder="Enter your full name"]').value = "Demo";
document.querySelector('input[placeholder="Enter your email address"]').value = "demo@example.com";
document.querySelector('input[placeholder="Create a password"]').value = "SecurePass123!";
document.querySelector('input[placeholder="Confirm Password"]').value = "SecurePass123!";

// Check the Terms of Service checkbox
document.querySelector('input[type="checkbox"]').checked = true;

// Trigger the form's onSubmit handler
const form = document.querySelector("form");
if (form) {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}