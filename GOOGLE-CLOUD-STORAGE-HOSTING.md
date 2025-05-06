# Google Cloud Storage Hosting Guide for Cyberpunk GM Screen

This guide will walk you through hosting your Cyberpunk GM Screen on Google Cloud Storage as a static website. This is the most cost-effective Google Cloud option for serving static content.

## Prerequisites

1. Google Cloud account (with billing enabled)
2. Google Cloud SDK installed
3. Your Cyberpunk GM Screen files ready for deployment

## Step 1: Create a Minimal Deployment Package

To avoid the executable file issues, we'll create a minimal deployment package with only the essential files.

Create a new directory for deployment:

```bash
# Create directory
mkdir ~/cyberpunk-gm-deploy

# Copy essential files
cp /mnt/c/Users/magic/cyberpunk-gm-screen/fixed-super-minimal.html ~/cyberpunk-gm-deploy/index.html
cp /mnt/c/Users/magic/cyberpunk-gm-screen/styles.css ~/cyberpunk-gm-deploy/
cp -r /mnt/c/Users/magic/cyberpunk-gm-screen/fonts ~/cyberpunk-gm-deploy/
find /mnt/c/Users/magic/cyberpunk-gm-screen/images -type f -not -name "*.py" -exec cp {} ~/cyberpunk-gm-deploy/images/ \;
```

## Step 2: Create a Google Cloud Storage Bucket

1. Log in to Google Cloud Console
2. Go to Cloud Storage > Buckets
3. Click "Create Bucket"
4. Configure your bucket:
   - Name: (choose a unique name, e.g., `cyberpunk-gm-screen-12345`)
   - Location type: Region
   - Location: Choose a region close to you
   - Default storage class: Standard
   - Access control: Fine-grained
   - Protection: None
5. Click "Create"

## Step 3: Configure the Bucket for Web Hosting

1. Go to the bucket you just created
2. Go to the "Permissions" tab
3. Click "Grant Access"
4. Add a new entry:
   - New principals: `allUsers`
   - Role: Cloud Storage > Storage Object Viewer
5. Click "Save"

6. Go to the bucket's "Configuration" tab
7. Scroll to "Website configuration" and click "Edit website configuration"
8. Set "Main page" to `index.html`
9. Set "404 (not found) page" to `404.html` (we'll create this later)
10. Click "Save"

## Step 4: Create a Simple Password Protection

Since Google Cloud Storage doesn't have built-in authentication, we'll create a simple client-side password protection:

```html
<!-- Create a file named password.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Cyberpunk RED GM Screen</title>
    <style>
        body {
            background-color: #121212;
            color: #e0e0e0;
            font-family: monospace;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        
        #login-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .login-box {
            background-color: #1e1e2d;
            border: 1px solid #00ccff;
            box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
            padding: 30px;
            width: 300px;
            text-align: center;
        }
        
        input {
            width: 100%;
            margin-bottom: 15px;
            padding: 10px;
            background-color: #2a2a3a;
            color: #e0e0e0;
            border: 1px solid #00ccff;
        }
        
        button {
            background-color: #1e3a5a;
            color: #00ccff;
            border: 1px solid #00ccff;
            padding: 10px 20px;
            cursor: pointer;
            width: 100%;
        }
        
        h2 {
            color: #00ccff;
            margin-bottom: 20px;
        }
        
        #app-container {
            display: none;
            height: 100vh;
            width: 100vw;
        }
        
        iframe {
            border: none;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="login-container">
        <div class="login-box">
            <h2>Cyberpunk RED GM Screen</h2>
            <input type="password" id="password" placeholder="Password">
            <button onclick="checkPassword()">Log In</button>
        </div>
    </div>
    
    <div id="app-container">
        <iframe id="app-frame" src="index.html"></iframe>
    </div>
    
    <script>
        function checkPassword() {
            const password = document.getElementById('password').value;
            // Change 'your-password' to your desired password
            if (password === 'your-password') {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
                localStorage.setItem('authenticated', 'true');
            } else {
                alert('Incorrect password');
            }
        }
        
        window.onload = function() {
            if (localStorage.getItem('authenticated') === 'true') {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
            }
        }
    </script>
</body>
</html>
```

Save this as `password.html` in your deployment directory.

## Step 5: Create a 404 Page

Create a simple 404 page to handle not found errors:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Page Not Found - Cyberpunk RED GM Screen</title>
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
            text-align: center;
        }
        
        .container {
            max-width: 600px;
            padding: 30px;
            background-color: #1e1e2d;
            border: 1px solid #00ccff;
            box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
        }
        
        h1 {
            color: #00ccff;
            margin-bottom: 20px;
        }
        
        .error-code {
            font-size: 72px;
            color: #00ccff;
            margin: 20px 0;
        }
        
        a {
            color: #00ccff;
            text-decoration: none;
            border: 1px solid #00ccff;
            padding: 10px 20px;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>System Failure: Page Not Found</h1>
        <div class="error-code">404</div>
        <p>The file or directory you were looking for has been moved, deleted, or never existed in the first place.</p>
        <a href="/">Return to GM Screen</a>
    </div>
</body>
</html>
```

Save this as `404.html` in your deployment directory.

## Step 6: Upload Files to Cloud Storage

You can upload the files using the Google Cloud Console or the `gsutil` command-line tool:

Using `gsutil`:

```bash
# Navigate to your deployment directory
cd ~/cyberpunk-gm-deploy

# Upload all files to your bucket
gsutil -m cp -r * gs://cyberpunk-gm-screen-12345/
```

Replace `cyberpunk-gm-screen-12345` with your bucket name.

## Step 7: Verify and Access Your Site

1. Your website will be available at:
   ```
   https://storage.googleapis.com/cyberpunk-gm-screen-12345/password.html
   ```

2. Access this URL in your browser
3. Enter your password to access the GM Screen

## Step 8: Set Up a Custom Domain (Optional)

For a nicer URL, you can set up a custom domain:

1. Register a domain name if you don't have one
2. In the Google Cloud Console, go to Cloud DNS
3. Create a new zone with your domain name
4. Add a CNAME record pointing to `c.storage.googleapis.com`
5. Verify your domain ownership
6. Update your bucket's name to match your domain

## Costs and Pricing

Google Cloud Storage costs include:

1. **Storage**: ~$0.020 per GB per month
   - For your site (~5-10MB), this is practically free

2. **Egress**: ~$0.12 per GB
   - For personal use, this will be negligible

3. **Operations**: ~$0.004-$0.05 per 10,000 operations
   - Again, for personal use, this will be minimal

For a personal GM screen, you can expect costs of less than $1/month, possibly even within the Free Tier if your usage is modest.

## Advantages of Google Cloud Storage

1. **Simple**: Easy to set up and maintain
2. **Cost-effective**: Minimal costs for static sites
3. **Reliable**: Google's global infrastructure
4. **Scalable**: Can handle increased traffic if needed
5. **Fast**: Content served via Google's global network

## Limitations

1. **No server-side processing**: All logic must be client-side
2. **Basic authentication**: Only simple password protection is available
3. **URL format**: Without a custom domain, the URL is less friendly

## Future Enhancements

If you later want more advanced features, you can:

1. Set up Google Cloud CDN for better performance
2. Implement Firebase Authentication for stronger user management
3. Add Google Analytics for usage tracking
4. Connect to a serverless backend if you need server-side features