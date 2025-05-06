/**
 * Cyberpunk RED GM Screen - Authentication Handler
 * Handles user authentication and session management
 */

class AuthHandler {
    constructor() {
        // Session storage key
        this.SESSION_KEY = 'cyberpunk-gm-auth';
        
        // Default timeout (4 hours)
        this.SESSION_TIMEOUT = 4 * 60 * 60 * 1000;
        
        // Default credentials (in production, this would be handled server-side)
        this.credentials = [
            { username: 'admin', password: 'edgerunner' },
            { username: 'gm', password: 'nightcity' }
        ];
    }
    
    /**
     * Authenticate user with provided credentials
     * @param {string} username - The username to check
     * @param {string} password - The password to check
     * @returns {boolean} - Whether authentication was successful
     */
    authenticate(username, password) {
        // In production, this would make a server request
        const validUser = this.credentials.find(user => 
            user.username === username && 
            user.password === password
        );
        
        if (validUser) {
            // Create a session token
            this.createSession(username);
            return true;
        }
        
        return false;
    }
    
    /**
     * Create a new authenticated session
     * @param {string} username - The username for the session
     */
    createSession(username) {
        const session = {
            username: username,
            authenticated: true,
            timestamp: new Date().getTime(),
            expires: new Date().getTime() + this.SESSION_TIMEOUT
        };
        
        // Store in sessionStorage (more secure than localStorage)
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean} - Whether the user has a valid session
     */
    isAuthenticated() {
        try {
            const sessionData = sessionStorage.getItem(this.SESSION_KEY);
            
            if (!sessionData) {
                return false;
            }
            
            const session = JSON.parse(sessionData);
            const now = new Date().getTime();
            
            // Check if session is expired
            if (now > session.expires) {
                this.logout();
                return false;
            }
            
            return session.authenticated === true;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }
    
    /**
     * Log out the current user
     */
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
    }
    
    /**
     * Redirect to login page if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'secure-login.html';
        }
    }
    
    /**
     * Redirect to main application page
     */
    redirectToApp() {
        window.location.href = 'desktop-cyberpunk.html';
    }
}

// Create and export a singleton instance
const authHandler = new AuthHandler();

// Export the instance for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { authHandler };
}