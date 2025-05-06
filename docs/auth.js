/**
 * Simple client-side authentication for GitHub Pages
 * 
 * This is a simplified version for the GitHub Pages deployment
 * that uses localStorage instead of server-side authentication.
 */

const authHandler = {
    // Check if user is authenticated
    isAuthenticated: function() {
        return localStorage.getItem('cyberpunk-gm-authenticated') === 'true';
    },
    
    // Log user out
    logout: function() {
        localStorage.removeItem('cyberpunk-gm-authenticated');
        window.location.href = 'secure-login.html';
    },
    
    // Add a logout button to the page
    addLogoutButton: function() {
        const logoutButton = document.createElement('button');
        logoutButton.innerHTML = 'LOGOUT';
        logoutButton.className = 'logout-button';
        logoutButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #121212;
            color: #ff3a47;
            border: 1px solid #ff3a47;
            padding: 5px 10px;
            font-family: 'Share Tech Mono', monospace;
            cursor: pointer;
            z-index: 9999;
        `;
        logoutButton.addEventListener('click', this.logout);
        document.body.appendChild(logoutButton);
    },
    
    // Initialize authentication
    init: function() {
        // Check if user is authenticated
        if (!this.isAuthenticated()) {
            // Redirect to login page if not authenticated
            window.location.href = 'secure-login.html';
            return;
        }
        
        // Add logout button if authenticated
        this.addLogoutButton();
    }
};

// Initialize authentication when the script loads
document.addEventListener('DOMContentLoaded', function() {
    authHandler.init();
});