# Google Cloud Setup Guide (Simplified)

This guide provides step-by-step instructions for deploying the Cyberpunk GM Screen's lightweight version to Google Cloud Platform, making it accessible from anywhere.

## Prerequisites

1. A Google Cloud Platform account
2. The Cyberpunk GM Screen files on your local machine

## Step 1: Create a New Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter the following details:
   - Project name: Cyberpunk GM Screen
   - Organization: (Your organization or leave as No organization)
5. Click "Create"

Note your Project ID and Project Number for future reference:
- Project name: Cyberpunk GM Screen
- Project number: 526579895525
- Project ID: cyberpunk-gm-screen

## Step 2: Enable Required APIs

1. In the Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Cloud Storage API
   - Cloud Build API (if you plan to use CI/CD)

## Step 3: Set Up Google Cloud Storage for Static Website Hosting

Since our version of the Cyberpunk GM Screen is a lightweight static web application, we'll use Google Cloud Storage for hosting:

1. In the Cloud Console, go to "Storage" > "Browser"
2. Click "Create Bucket"
3. Enter a unique bucket name (e.g., "cyberpunk-gm-screen-static")
4. Set the following properties:
   - Location type: Region
   - Location: Choose a region close to your users
   - Storage class: Standard
   - Access control: Fine-grained
   - Protection tools: None (for now)
5. Click "Create"

## Step 4: Configure the Bucket for Website Hosting

1. In the bucket details page, go to the "Permissions" tab
2. Click "Add" to add a new principal
3. In the "New principals" field, enter "allUsers"
4. For the "Role" select "Storage Object Viewer"
5. Click "Save"

## Step 5: Upload the Cyberpunk GM Screen Files

1. In the bucket details page, click "Upload files" or "Upload folder"
2. Select all files from your local Cyberpunk GM Screen directory
   - Be sure to include: fixed-super-minimal.html, styles.css, and any other required files
3. Click "Upload"

## Step 6: Set the Main Page

1. In the bucket details page, go to the "Website configuration" tab
2. Click "Edit"
3. Set the following:
   - Main page: fixed-super-minimal.html
   - 404 (not found) page: 404.html (create a simple 404.html file if needed)
4. Click "Save"

## Step 7: Test Your Deployment

Your application is now accessible at:

```
https://storage.googleapis.com/YOUR_BUCKET_NAME/fixed-super-minimal.html
```

Replace `YOUR_BUCKET_NAME` with your actual bucket name.

## Step 8: Updating Content

When you make changes to your local files and want to update the deployed version:

1. In the bucket details page, click "Upload files"
2. Select the modified files (or all files if you've made extensive changes)
3. Click "Upload"
4. Verify the changes by refreshing your application

## Step 9: Implement Layout Persistence (Optional)

Since our lightweight version uses localStorage for saving layouts, the data is saved only in the user's browser. If you want to implement server-side persistence:

1. Consider using Google Firebase for a serverless database
2. Modify the layout storage code to use Firebase instead of localStorage
3. This allows users to access their saved layouts from any device

## Cost Management

Google Cloud Storage has minimal costs for typical usage:
- Storage costs are typically less than $1/month for applications of this size
- Network egress costs apply when users access your application
- Set up budget alerts in the "Billing" section to monitor costs

## Security Considerations

1. The default setup allows anyone to view your application
2. If you want to restrict access, change the permission from "allUsers" to specific Google accounts
3. Consider enabling Cloud Logging to monitor access to your application

## Troubleshooting

If you encounter issues with your deployment:

1. **404 Errors**: Ensure your files are properly uploaded and the main page is correctly set
2. **Permission Errors**: Verify that allUsers has the Storage Object Viewer role
3. **CORS Issues**: If your application makes API calls, you may need to configure CORS settings
4. **JavaScript Errors**: Check the browser console for errors related to paths or resources

## Additional Resources

- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [Hosting a Static Website](https://cloud.google.com/storage/docs/hosting-static-website)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)