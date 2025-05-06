// Simple client-side authentication
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    
    // Access key - CHANGE THIS to your desired password
    const ACCESS_KEY = 'cyberpunk2045';
    
    // Check if already authenticated
    if (localStorage.getItem('cpauth') === 'true') {
        window.location.href = 'app.html';
    }
    
    // Handle login button click
    loginButton.addEventListener('click', function() {
        if (passwordInput.value === ACCESS_KEY) {
            localStorage.setItem('cpauth', 'true');
            window.location.href = 'app.html';
        } else {
            errorMessage.style.display = 'block';
            passwordInput.value = '';
        }
    });
    
    // Handle Enter key press
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });
});