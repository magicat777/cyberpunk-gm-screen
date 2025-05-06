# Cyberpunk GM Screen - Google Cloud Storage Deployment Guide

This guide explains how to deploy your Cyberpunk GM Screen to Google Cloud Storage as a static website with basic password protection. This approach offers a simple, low-cost option for private hosting that avoids the executable file restrictions of Firebase Hosting's free tier.

## Prerequisites

- A Google Cloud account
- The [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed locally (optional, for command-line deployment)
- Basic understanding of HTML/CSS/JavaScript

## Minimal Deployment Package

For a successful deployment to Google Cloud Storage, we'll create a minimal package containing only the essential files. Here's what you'll need:

1. `index.html` - A login page with password protection
2. `app.html` - Your main application (renamed from fixed-super-minimal.html)
3. `styles.css` - Your main stylesheet
4. `auth.js` - A simple client-side authentication script

## Step 1: Prepare Your Files

### 1. Create a deployment directory

Create a new directory called `deployment` to organize your files:

```bash
mkdir deployment
```

### 2. Create a simple login page (index.html)

Create a new file called `index.html` in your deployment directory:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Cyberpunk RED GM Screen - Login</title>
    <style>
        body {
            background-color: #121212;
            color: #e0e0e0;
            font-family: monospace;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .login-container {
            background-color: #1e1e2d;
            border: 1px solid #00ccff;
            box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
            padding: 30px;
            width: 300px;
            text-align: center;
        }
        .title {
            color: #00ccff;
            margin-bottom: 20px;
        }
        input {
            background-color: #2a2a3a;
            color: #e0e0e0;
            border: 1px solid #00ccff;
            padding: 8px;
            width: 100%;
            margin-bottom: 15px;
            box-sizing: border-box;
        }
        button {
            background-color: #1e3a5a;
            color: #00ccff;
            border: 1px solid #00ccff;
            padding: 8px 16px;
            cursor: pointer;
            width: 100%;
        }
        button:hover {
            background-color: #254b75;
        }
        .error-message {
            color: #ff4f4f;
            margin-top: 10px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2 class="title">Cyberpunk RED GM Screen</h2>
        <div>
            <input type="password" id="password" placeholder="Enter password">
            <button id="login-button">Login</button>
            <p class="error-message" id="error-message">Incorrect password. Please try again.</p>
        </div>
    </div>
    <script src="auth.js"></script>
</body>
</html>
```

### 3. Create a simple authentication script (auth.js)

Create a new file called `auth.js` in your deployment directory:

```javascript
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
```

### 4. Modify your main application (app.html)

Copy your `fixed-super-minimal.html` to `app.html` in your deployment directory and add the authentication check at the beginning of the script section:

```javascript
// Add this at the beginning of your script section
// Check authentication
if (localStorage.getItem('cpauth') !== 'true') {
    window.location.href = 'index.html';
}

// Add a logout function
function logout() {
    localStorage.removeItem('cpauth');
    window.location.href = 'index.html';
}

// Add a logout button to your settings menu
// (Add this to your HTML where appropriate)
// <a href="#" id="logout">Logout</a>

// Add the event listener for the logout button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('about').insertAdjacentHTML('afterend', 
        '<a href="#" id="logout">Logout</a>');
        
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
});
```

### 5. Copy your CSS file

Copy your `styles.css` file to the deployment directory.

## Step 2: Create and Configure a Google Cloud Storage Bucket

### 1. Create a new Google Cloud project (or use an existing one)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Name your project (e.g., "Cyberpunk GM Screen")
5. Click "Create"

### 2. Create a Cloud Storage bucket

1. Navigate to "Cloud Storage" > "Buckets" in the left sidebar
2. Click "Create Bucket"
3. Name your bucket (e.g., "cyberpunk-gm-screen-app")
   - Note: Bucket names must be globally unique across all of Google Cloud
4. Choose a region close to your users for best performance
5. Set "Default storage class" to "Standard"
6. Under "Access control", select "Uniform" 
7. For "Access Protection", leave as "None" (we'll handle this with our client-side auth)
8. Click "Create"

### 3. Configure the bucket for website hosting

1. Go to your newly created bucket
2. Navigate to the "Permissions" tab
3. Click "Add" to add a new member
4. In the "New members" field, enter `allUsers`
5. For the role, select "Cloud Storage" > "Storage Object Viewer"
6. Click "Save"

### 4. Set up website configuration

1. Go to your bucket's "Website configuration" tab
2. Click "Edit website configuration"
3. Enter "index.html" as the "Main page"
4. Enter "index.html" as the "404 (not found) page"
5. Click "Save"

## Step 3: Upload Your Files

### Option 1: Using the Google Cloud Console (Web UI)

1. Go to your bucket's "Objects" tab
2. Click "Upload files" or "Upload folder"
3. Select all the files from your deployment directory
4. Wait for upload to complete

### Option 2: Using the Google Cloud SDK (Command Line)

1. Open a terminal in your deployment directory
2. Initialize the Google Cloud SDK if you haven't already:
   ```bash
   gcloud init
   ```
3. Authenticate and select your project
4. Upload all files to your bucket:
   ```bash
   gsutil -m cp -r * gs://your-bucket-name/
   ```

## Step 4: Accessing Your Application

Your application is now available at:

```
https://storage.googleapis.com/your-bucket-name/index.html
```

You can also set up a custom domain with HTTPS to make your application more accessible, but that requires additional steps and costs.

## Estimated Costs

Google Cloud Storage is very cost-effective for small applications:

- **Storage costs**: ~$0.02 per GB per month
  - Your entire application is likely under 1MB, so storage cost is negligible (< $0.01/month)
  
- **Data transfer costs**: ~$0.12 per GB
  - With typical usage of a few users, data transfer should be minimal (< $1/month)
  
- **Operations costs**: ~$0.004 per 10,000 operations
  - The operations cost is essentially negligible for this application

Total estimated monthly cost: **Less than $1 for basic usage**

## Limitations

This approach has some limitations compared to other Google Cloud options:

1. **Client-side authentication only**: The password protection is client-side and not as secure as server-side authentication. Anyone with the URL can try to guess the password.

2. **No server-side logic**: You cannot run server-side code to implement features that require a backend.

3. **No API capabilities**: If you want to add features that require APIs, you'll need additional services.

4. **Limited scalability**: While Google Cloud Storage can handle high traffic, complex applications might need more robust solutions.

## Future Monetization

If you want to monetize your application in the future, consider these options:

1. **Implement a payment system**: Use services like Stripe.js to handle payments client-side.

2. **Upgrade to a more comprehensive solution**: 
   - Google Cloud Run: For adding backend capabilities with containerized applications
   - App Engine: For a fully managed platform with more features
   - Compute Engine: For complete control with virtual machines

3. **Implement multiple access tiers**: Using client-side authentication, you could create different access tiers with different passwords and features.

## Security Considerations

Remember that client-side authentication is not highly secure. Consider this solution for:

- Personal use
- Sharing with friends or a small group
- Development/testing purposes

For a more secure solution requiring strong authentication, consider implementing Google Identity Platform, Firebase Authentication, or moving to a solution with server-side authentication.

## Conclusion

This deployment approach provides a simple, low-cost way to host your Cyberpunk GM Screen privately on Google Cloud. It's easy to set up, avoids the executable file restrictions of Firebase Hosting's free tier, and gives you the flexibility to enhance the solution in the future as your needs evolve.