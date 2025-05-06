# Firebase Deployment Terminal Commands

Use these exact commands in your terminal/command prompt to deploy the Cyberpunk GM Screen to Firebase.

## Prerequisites

- Ensure you have Node.js and npm installed
- Have a Google account with access to Firebase

## Installation Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools@12.9.1
```

## Authentication Commands

```bash
# Login to Firebase (this will open a browser window)
firebase login
```

## Deployment Commands

Navigate to your project directory:

```bash
# Windows
cd C:\Users\magic\cyberpunk-gm-screen

# Linux/macOS
cd /path/to/cyberpunk-gm-screen
```

Initialize Firebase:

```bash
# Initialize Firebase hosting
firebase init hosting
```

When prompted, select the following options:
- Select "Use an existing project" and choose "cyberpunk-gm-screen"
- For the public directory, enter `.` (a single dot) to use the current directory
- Configure as a single-page app? Select "No"
- Set up automatic GitHub deploys? Select "No"
- Overwrite existing files? Select "No" for all

Deploy to Firebase:

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Testing Your Deployment

After successful deployment, you'll receive a hosting URL like:
```
https://cyberpunk-gm-screen.web.app
```

Open this URL in your browser to test the deployment.

## Common Issues and Fixes

### Authentication Errors

If you see "Error: Failed to authenticate":

```bash
# Log out and log back in
firebase logout
firebase login
```

### Project Selection Issues

If you see "Error: No project selected":

```bash
# Set the project explicitly
firebase use cyberpunk-gm-screen
```

### Deployment Failures

If deployment fails due to permission issues:

```bash
# Check project status
firebase projects:list

# Verify your current project
firebase use
```

### Updating Your Deployment

After making changes to your files:

```bash
# Deploy the updates
firebase deploy --only hosting
```

## Viewing Deployed Site Information

```bash
# List all Firebase Hosting sites
firebase hosting:sites:list

# Get details about your deployment
firebase hosting:sites:detail
```

## Cleaning Up

If you need to delete the deployment (rarely needed):

```bash
# Delete the Firebase project (use with caution!)
firebase projects:delete cyberpunk-gm-screen
```

Note: This will delete everything in the project, including authentication, databases, etc.