# Secure Login System

## Overview

The Cyberpunk RED GM Screen now features a secure login system with a futuristic Cyberpunk Edgerunners-style animation. This document describes the implementation and usage of this system.

## Features

- Password-protected access to the GM Screen
- Cyberpunk Edgerunners-inspired animation and visual effects
- Session-based authentication
- Automatic redirection for unauthenticated users
- Logout functionality

## Components

### 1. Secure Login Page (`secure-login.html`)

The secure login page serves as the entry point to the application. It features:

- A cyberpunk-themed interface with neon colors and animated effects
- Username and password input fields
- Client-side validation
- Animated loading sequence after successful authentication
- Error messaging for invalid credentials

### 2. Authentication Handler (`auth-handler.js`)

The authentication handler manages user sessions and provides the following functionality:

- User authentication
- Session creation and management
- Session timeout (4 hours by default)
- Authentication checks for protected pages
- Logout functionality

### 3. Integration with Main Application

The main application pages have been updated to:

- Check for authentication before loading
- Redirect unauthenticated users to the login page
- Provide a logout button in the top navigation bar

## Default Credentials

The system is pre-configured with the following credentials:

- Username: `admin`, Password: `edgerunner`
- Username: `gm`, Password: `nightcity`

**Note:** In a production environment, these would be securely stored server-side.

## Implementation Details

### Authentication Flow

1. User attempts to access application
2. If not authenticated, user is redirected to the secure login page
3. User enters credentials
4. If valid, a session is created and stored in `sessionStorage`
5. User is presented with an animated loading sequence
6. After loading completes, user is redirected to the main application

### Security Considerations

- Credentials are validated client-side (for demonstration purposes only)
- In a production environment, authentication should be handled server-side
- Sessions expire after 4 hours
- Sessions are stored in `sessionStorage` rather than `localStorage` for additional security

### Visual Design

The visual design draws inspiration from the Cyberpunk Edgerunners anime with:

- Vibrant neon colors (pink, blue, green, yellow)
- Glitch effects and animated scanlines
- Pulsing elements that mimic technology interfaces
- Cyberpunk-themed typography and UI elements

## Customization Options

### Changing Default Credentials

To change the default credentials, edit the `credentials` array in `auth-handler.js`:

```javascript
this.credentials = [
    { username: 'admin', password: 'edgerunner' },
    { username: 'gm', password: 'nightcity' }
];
```

### Modifying Session Timeout

To change the session timeout duration, edit the `SESSION_TIMEOUT` constant in `auth-handler.js`:

```javascript
this.SESSION_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
```

### Customizing Visual Elements

The visual appearance can be customized by editing the CSS variables in `secure-login.html`:

```css
:root {
    --neon-pink: #ff00a5;
    --neon-blue: #00f0ff;
    --neon-green: #00ff66;
    --neon-yellow: #ffcc00;
    --dark-bg: #0d0d0f;
    --cyber-red: #ff003c;
    --text-color: #f0f0f0;
    --glitch-intensity: 0.15;
}
```

## Future Enhancements

- Server-side authentication
- User roles and permissions
- Password hashing and security improvements
- Custom profile settings per user
- Two-factor authentication