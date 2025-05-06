# Testing Guide for Cyberpunk GM Screen Firebase Deployment

This guide will help you thoroughly test your Firebase deployment to ensure everything is working correctly.

## Authentication Testing

### 1. Login Testing

1. Open your Firebase hosting URL (e.g., `https://cyberpunk-gm-screen.web.app`)
2. Verify that you see the login screen with:
   - Email field
   - Password field
   - Login button
   - Cyberpunk RED GM Screen title

3. Test invalid login:
   - Enter an incorrect email or password
   - Click "Login"
   - Verify that you see an error message
   - Verify that you remain on the login screen

4. Test valid login:
   - Enter your authorized email and password
   - Click "Login"
   - Verify that the login screen disappears
   - Verify that the Cyberpunk GM Screen loads in the iframe

### 2. Logout Testing

1. After logging in successfully, look for the logout button in the top-right corner
2. Click the logout button
3. Verify that you're returned to the login screen
4. Try to access the application directly (without logging in):
   - Open a new tab and navigate to your Firebase hosting URL + `/fixed-super-minimal.html`
   - Verify that you're redirected to the login page

### 3. Session Persistence Testing

1. Log in to the application
2. Close the browser tab (don't log out)
3. Open a new tab and navigate to your Firebase hosting URL
4. Verify that you're still logged in (Firebase preserves session state)
5. Open an incognito/private window and navigate to your Firebase hosting URL
6. Verify that you need to log in again (sessions don't persist across incognito)

## UI Functionality Testing

### 1. Panel Creation Testing

1. After logging in, test each panel creation option:
   - Click "Add Panel" in the toolbar
   - Select "Notes" from the dropdown
   - Verify that a notes panel appears
   - Repeat for other panel types (Dice Roller, Initiative Tracker, etc.)

2. Test at least 5 different panel types to ensure they all work

### 2. Panel Interaction Testing

1. Test panel dragging:
   - Click and hold a panel's header
   - Drag it to a different position
   - Verify it moves smoothly

2. Test panel resizing:
   - Find the resize handle in the bottom-right corner of a panel
   - Click and drag to resize
   - Verify the panel resizes smoothly

3. Test panel closing:
   - Click the X button in a panel's header
   - Verify the panel closes

### 3. Feature-Specific Testing

Test the following specific features:

1. **Dice Roller**:
   - Select dice count and type
   - Click "Roll"
   - Verify results appear

2. **Initiative Tracker**:
   - Add a few combatants with names and initiative values
   - Click "Next Turn" to advance the tracker
   - Click "Roll For All" to generate random initiatives
   - Try removing a combatant

3. **Notes Panel**:
   - Type some text in the notes area
   - Verify that typing works correctly

4. **Rules Reference**:
   - Select different rule categories from the dropdown
   - Verify that content changes accordingly

### 4. Layout Management Testing

1. Test the "Auto-Organize" feature:
   - Create several panels of different types
   - Click "Layout" > "Auto-Organize"
   - Verify panels reorganize in a grid pattern

2. Test the "Fit to Window" feature:
   - Create several panels of different types
   - Click "Layout" > "Fit to Window"
   - Verify panels resize to fit the window

3. Test saving a layout:
   - Arrange panels in a specific way
   - Click "Layout" > "Save Layout"
   - Close all panels
   - Click "Layout" > "Load Layout"
   - Verify your arrangement is restored

## Browser Compatibility Testing

If possible, test in multiple browsers:

1. Chrome
2. Firefox
3. Edge
4. Safari (if available)

For each browser, verify:
- Login works
- Panels can be created
- Dragging and resizing work
- No obvious visual glitches

## Mobile Testing (Optional)

If you plan to use the app on mobile devices:

1. Open the Firebase hosting URL on a mobile device
2. Verify that the login screen is usable on mobile
3. Test basic functionality after logging in
4. Note any usability issues specific to mobile

## Performance Testing

1. Create at least 10 panels
2. Test for any lag or performance issues
3. Check browser console for any errors or warnings

## Record Testing Results

Keep track of any issues you find during testing:

1. Describe the issue
2. Note the browser and device where it occurred
3. Document the steps to reproduce it
4. Take screenshots if helpful

## Common Issues and Solutions

### Login Issues

- **Firebase authentication error**: Verify your Firebase configuration in auth.js
- **Redirect loops**: Check your Firebase.json for correct redirect settings
- **CORS errors**: Make sure your Firebase hosting settings allow proper cross-origin access

### UI Issues

- **Panels not appearing**: Check browser console for JavaScript errors
- **Styles missing**: Verify that styles.css is properly loaded
- **Panels not draggable**: Check for JavaScript errors related to mouse events

### Content Issues

- **Missing content**: Verify all necessary files were deployed
- **404 errors**: Check paths in your HTML files and Firebase hosting configuration
- **Broken links**: Verify that all links point to the correct locations