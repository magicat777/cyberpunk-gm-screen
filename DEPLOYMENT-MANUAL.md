# Cyberpunk GM Screen - Manual Deployment Instructions

This document provides manual step-by-step instructions to deploy your Cyberpunk GM Screen to Firebase with private access.

## Prerequisites

- A Google account
- The files we've created:
  - auth.js
  - firebase-index.html
  - firebase.json
  - .firebaserc

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter "Cyberpunk GM Screen" as the project name
4. Optionally disable Google Analytics for now (you can enable it later)
5. Click "Create project"
6. Wait for the project to be created
7. You'll be redirected to the project dashboard

## Step 2: Add a Web App to Your Firebase Project

1. In the Firebase Console, click on the "</>" (Web) icon to add a web app
2. Register your app with the name "Cyberpunk GM Screen Web"
3. Do NOT check the "Also set up Firebase Hosting" option (we'll do this separately)
4. Click "Register app"
5. You'll see your Firebase configuration - copy this information
6. Open `auth.js` in a text editor
7. Replace the `firebaseConfig` object with your copied configuration
8. Save the file

## Step 3: Enable Email/Password Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Select the "Email/Password" provider
4. Toggle "Email/Password" to enabled
5. Click "Save"

## Step 4: Add Yourself as an Authorized User

1. In the Firebase Authentication section, go to the "Users" tab
2. Click "Add user"
3. Enter your email address and a password
4. Click "Add user"
5. You should see your user in the list

## Step 5: Set Up Firebase Hosting

1. Open a command prompt or terminal
2. Navigate to your Cyberpunk GM Screen directory:
   ```
   cd /mnt/c/Users/magic/cyberpunk-gm-screen
   ```
3. Log in to Firebase (you already have the CLI installed):
   ```
   firebase login
   ```
   Follow the prompts to authenticate

4. Initialize Firebase Hosting (this will use the existing files we created):
   ```
   firebase init hosting
   ```
   - When prompted to select a project, choose "Cyberpunk GM Screen"
   - When asked about the public directory, enter "." (the current directory)
   - When asked if you want to configure as a single-page app, select "No"
   - When asked if you want to overwrite firebase.json, select "No"

## Step 6: Deploy to Firebase

1. In the command prompt, deploy your application:
   ```
   firebase deploy --only hosting
   ```

2. After deployment completes, you'll see a "Hosting URL" in the output. It should look something like:
   ```
   https://cyberpunk-gm-screen.web.app
   ```

3. Copy this URL for testing

## Step 7: Test Private Access

1. Open the Hosting URL in a web browser
2. You should see the login screen
3. Enter the email address and password you set in Step 4
4. After successful login, you should see the Cyberpunk GM Screen interface

## Step 8: Update Configuration if Needed

If you encounter any issues during login:

1. Check the browser console for errors (F12 in most browsers)
2. Verify that the Firebase configuration in auth.js is correct
3. Ensure that you've enabled Email/Password authentication
4. Confirm that your user is added to Firebase Authentication

## Step 9: Make Updates Later

Whenever you make changes to your files:

1. Test locally if possible
2. When ready to update the live version, run:
   ```
   firebase deploy --only hosting
   ```

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-credential)"
- Check that you've created a user in Firebase Authentication
- Verify you're entering the correct email and password

### Application Not Loading After Login
- Check browser console for errors
- Verify the correct path to fixed-super-minimal.html
- Ensure the iframe is loading correctly

### White Screen After Login
- The most common cause is a path issue - check that fixed-super-minimal.html exists
- Check for JavaScript errors in the console

### CORS Issues
- If you see CORS errors in the console, you may need to add CORS headers to your Firebase Hosting configuration
- This can be added in firebase.json:
  ```json
  {
    "hosting": {
      "headers": [
        {
          "source": "**",
          "headers": [
            {
              "key": "Access-Control-Allow-Origin",
              "value": "*"
            }
          ]
        }
      ]
      // other existing config...
    }
  }
  ```

## Future Steps for Monetization

When you're ready to monetize:

1. **Update Authentication to Include Payment Status**:
   - Add custom claims to user profiles to track payment status
   - Update your auth.js to check these claims

2. **Implement Payment Processing**:
   - Add Stripe or another payment processor
   - Create a payment page/flow

3. **Feature Flagging**:
   - Update your application to show/hide premium features based on payment status

4. **User Management**:
   - Create an admin interface for managing users and subscriptions

## Need Help?

For more detailed information, refer to the following resources:
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Complete deployment guide](docs/technical/firebase-deployment-guide.md)