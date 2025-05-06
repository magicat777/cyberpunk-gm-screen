# Cyberpunk GM Screen: Google Cloud Run Setup Guide

This guide provides comprehensive step-by-step instructions for deploying the Cyberpunk GM Screen application to Google Cloud Run.

## Prerequisites

- Google Cloud account with billing enabled
- Google Cloud CLI (`gcloud`) installed on your local machine
- Docker installed on your local machine
- Git (optional, for version control)

## Step 1: Create a New Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter "cyberpunk-gm-screen" as the project name
5. Select your organization or leave as "No organization"
6. Click "Create"
7. Wait for the project to be created and switch to it

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services > Library"
2. Search for and enable the following APIs:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API
   - Cloud Storage API
   - Secret Manager API (if using secrets)

## Step 3: Set Up Local Environment

1. Open a terminal on your local machine
2. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   ```
3. Set the project:
   ```bash
   gcloud config set project cyberpunk-gm-screen
   ```

## Step 4: Prepare Application for Cloud Deployment

### 4.1: Create Dockerfile

Create a file named `Dockerfile` in the root of your project:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy application files
COPY . .

# Install dependencies (if any)
# If you have a requirements.txt file, uncomment the next line
# RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8080

# Command to run the application
# We're using 8080 as it's the port Cloud Run expects
CMD ["python", "-m", "http.server", "8080"]
```

### 4.2: Create .dockerignore File

Create a `.dockerignore` file to exclude unnecessary files:

```
.git
.gitignore
*.md
LICENSE
*.png
*.jpg
__pycache__/
*.py[cod]
*$py.class
*.so
.env
```

### 4.3: Create Cloud Storage Adapter (Optional)

For data persistence, create a new file at `/mnt/c/Users/magic/cyberpunk-gm-screen/js/cloud-storage-adapter.js`:

```javascript
/**
 * Cyberpunk RED GM Screen - Cloud Storage Adapter
 * Enables data persistence using Google Cloud Storage
 */

class CloudStorageAdapter {
    constructor() {
        this.bucketName = 'cyberpunk-gm-screen-data';
        this.apiEndpoint = '/api/storage'; // Will be implemented in server.py
    }

    /**
     * Save data to Cloud Storage
     * @param {string} key - The storage key
     * @param {any} data - The data to save
     * @returns {Promise} - Promise resolving to success message
     */
    async saveItem(key, data) {
        try {
            const response = await fetch(`${this.apiEndpoint}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: key,
                    data: data
                })
            });

            if (!response.ok) {
                throw new Error(`Error saving data: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving to Cloud Storage:', error);
            // Fallback to localStorage for offline mode
            localStorage.setItem(key, JSON.stringify(data));
            return { success: false, error: error.message, offlineFallback: true };
        }
    }

    /**
     * Load data from Cloud Storage
     * @param {string} key - The storage key
     * @returns {Promise} - Promise resolving to the data
     */
    async getItem(key) {
        try {
            const response = await fetch(`${this.apiEndpoint}/load?key=${encodeURIComponent(key)}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Error loading data: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error loading from Cloud Storage:', error);
            // Fallback to localStorage for offline mode
            const localData = localStorage.getItem(key);
            return { data: localData ? JSON.parse(localData) : null, offlineFallback: true };
        }
    }

    /**
     * Remove data from Cloud Storage
     * @param {string} key - The storage key
     * @returns {Promise} - Promise resolving to success message
     */
    async removeItem(key) {
        try {
            const response = await fetch(`${this.apiEndpoint}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: key
                })
            });

            if (!response.ok) {
                throw new Error(`Error removing data: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error removing from Cloud Storage:', error);
            // Fallback to localStorage for offline mode
            localStorage.removeItem(key);
            return { success: false, error: error.message, offlineFallback: true };
        }
    }
}

// Export the adapter
const cloudStorage = new CloudStorageAdapter();

// For compatibility with existing code
window.cloudStorage = cloudStorage;
```

### 4.4: Create a Simple API Server

Create a file named `server.py` in the root of your project:

```python
#!/usr/bin/env python3
import os
import json
import base64
from http import server
from urllib.parse import parse_qs, urlparse
from google.cloud import storage

# Initialize Google Cloud Storage client
storage_client = storage.Client()
bucket_name = os.environ.get('BUCKET_NAME', 'cyberpunk-gm-screen-data')
bucket = storage_client.bucket(bucket_name)

class CyberpunkHandler(server.SimpleHTTPRequestHandler):
    """Custom handler for serving static files and API endpoints"""
    
    def do_GET(self):
        """Handle GET requests"""
        # Parse URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # API endpoints
        if path.startswith('/api/'):
            if path == '/api/storage/load':
                # Get storage key from query parameters
                query = parse_qs(parsed_url.query)
                key = query.get('key', [''])[0]
                
                if not key:
                    self._send_json_response({'error': 'Missing key parameter'}, 400)
                    return
                
                try:
                    # Get blob from storage
                    blob = bucket.blob(key)
                    
                    if not blob.exists():
                        self._send_json_response({'data': None}, 200)
                        return
                    
                    # Get data from blob
                    data = json.loads(blob.download_as_string())
                    self._send_json_response({'data': data}, 200)
                except Exception as e:
                    self._send_json_response({'error': str(e)}, 500)
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
        else:
            # Serve static files
            super().do_GET()
    
    def do_POST(self):
        """Handle POST requests"""
        # Parse URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # API endpoints
        if path.startswith('/api/'):
            if path == '/api/storage/save':
                # Get content length
                content_length = int(self.headers['Content-Length'])
                
                # Read request body
                body = self.rfile.read(content_length)
                
                try:
                    # Parse JSON data
                    data = json.loads(body)
                    key = data.get('key')
                    value = data.get('data')
                    
                    if not key:
                        self._send_json_response({'error': 'Missing key parameter'}, 400)
                        return
                    
                    # Store data in Cloud Storage
                    blob = bucket.blob(key)
                    blob.upload_from_string(json.dumps(value), content_type='application/json')
                    
                    self._send_json_response({'success': True}, 200)
                except Exception as e:
                    self._send_json_response({'error': str(e)}, 500)
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
        else:
            self.send_response(405)
            self.end_headers()
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        # Parse URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # API endpoints
        if path.startswith('/api/'):
            if path == '/api/storage/delete':
                # Get content length
                content_length = int(self.headers['Content-Length'])
                
                # Read request body
                body = self.rfile.read(content_length)
                
                try:
                    # Parse JSON data
                    data = json.loads(body)
                    key = data.get('key')
                    
                    if not key:
                        self._send_json_response({'error': 'Missing key parameter'}, 400)
                        return
                    
                    # Delete blob from Cloud Storage
                    blob = bucket.blob(key)
                    
                    if blob.exists():
                        blob.delete()
                    
                    self._send_json_response({'success': True}, 200)
                except Exception as e:
                    self._send_json_response({'error': str(e)}, 500)
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
        else:
            self.send_response(405)
            self.end_headers()
    
    def _send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

def run():
    """Run the server"""
    port = int(os.environ.get('PORT', 8080))
    server_address = ('', port)
    httpd = server.HTTPServer(server_address, CyberpunkHandler)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
```

### 4.5: Create requirements.txt

Create a file named `requirements.txt` in the root of your project:

```
google-cloud-storage==2.9.0
```

### 4.6: Update Dockerfile to Use New Server

Update the Dockerfile to use the new server.py:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8080

# Command to run the application
CMD ["python", "server.py"]
```

## Step 5: Create Cloud Storage Bucket

1. In the Google Cloud Console, go to "Cloud Storage > Buckets"
2. Click "Create Bucket"
3. Name the bucket "cyberpunk-gm-screen-data"
4. Choose "Region" for Location type and select a region close to you
5. Leave the default storage class as "Standard"
6. Under "Access control", choose "Uniform"
7. Under "Protection tools", keep the defaults
8. Click "Create"

## Step 6: Set CORS for the Bucket

1. In the Google Cloud Console, go to "Cloud Storage > Buckets"
2. Click on your "cyberpunk-gm-screen-data" bucket
3. Go to the "Permissions" tab
4. Click "CORS configuration"
5. Add the following configuration:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
```

## Step 7: Build and Deploy to Cloud Run

1. Open a terminal in your project directory
2. Build the container image:

```bash
gcloud builds submit --tag gcr.io/cyberpunk-gm-screen/gm-screen-app
```

3. Deploy to Cloud Run:

```bash
gcloud run deploy gm-screen-service \
  --image gcr.io/cyberpunk-gm-screen/gm-screen-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-env-vars "BUCKET_NAME=cyberpunk-gm-screen-data"
```

Note: The `--allow-unauthenticated` flag makes your service publicly accessible. Remove this flag if you want to restrict access to authenticated users only.

## Step 8: Update Application to Use Cloud Storage (Optional)

To use the Cloud Storage adapter, update your JavaScript code to reference it:

1. Add this to the head of your HTML files:

```html
<script src="js/cloud-storage-adapter.js" defer></script>
```

2. Modify your data storage code to use the adapter:

```javascript
// Example for character-manager.js
saveCharacters() {
    try {
        // Try cloud storage first
        if (window.cloudStorage) {
            cloudStorage.saveItem(this.CHARACTERS_KEY, this.characters);
        } else {
            // Fallback to localStorage
            localStorage.setItem(this.CHARACTERS_KEY, JSON.stringify(this.characters));
        }
        return true;
    } catch (error) {
        console.error('Error saving characters:', error);
        return false;
    }
}

loadCharacters() {
    try {
        if (window.cloudStorage) {
            // Use async/await in an IIFE
            (async () => {
                const result = await cloudStorage.getItem(this.CHARACTERS_KEY);
                if (result.data) {
                    this.characters = result.data;
                }
            })();
        } else {
            // Fallback to localStorage
            const storedData = localStorage.getItem(this.CHARACTERS_KEY);
            if (storedData) {
                this.characters = JSON.parse(storedData);
            }
        }
        return true;
    } catch (error) {
        console.error('Error loading characters:', error);
        return false;
    }
}
```

## Step 9: Test the Deployment

1. After deployment, Cloud Run will provide a URL for your service
2. Open the URL in your browser to test the application
3. Verify that all features work correctly
4. Test data persistence by creating characters and reloading the page

## Step 10: Set Up Custom Domain (Optional)

1. In the Google Cloud Console, go to "Cloud Run"
2. Click on your service
3. Go to the "Domain mappings" tab
4. Click "Add mapping"
5. Select your domain and configure DNS settings as prompted

## Step 11: Set Up IAM for Access Control (Optional)

If you want to restrict access to specific users:

1. In the Google Cloud Console, go to "Cloud Run"
2. Click on your service
3. Go to the "Permissions" tab
4. Click "Add principal"
5. Enter the email addresses of users who should have access
6. Select the role "Cloud Run Invoker"
7. Click "Save"

## Step 12: Set Up Automatic Backup (Recommended)

1. In the Google Cloud Console, go to "Cloud Scheduler"
2. Click "Create job"
3. Configure the job to run daily
4. Use the following command:

```
gcloud storage cp -r gs://cyberpunk-gm-screen-data gs://cyberpunk-gm-screen-backups/$(date +%Y-%m-%d)/
```

## Step 13: Set Up Monitoring (Optional)

1. In the Google Cloud Console, go to "Monitoring > Overview"
2. Set up alerts for:
   - Cloud Run service health
   - Error rates
   - Storage usage

## Troubleshooting

### Can't Access the Application

1. Check that the Cloud Run service is deployed successfully
2. Verify that the service is set to allow unauthenticated access
3. Check Cloud Run logs for errors

### Data Not Persisting

1. Verify that the Cloud Storage bucket exists
2. Check CORS configuration on the bucket
3. Verify that the service has permission to access the bucket
4. Look for JavaScript errors in the browser console

### Error During Deployment

1. Check the Cloud Build logs for errors
2. Verify that all required APIs are enabled
3. Check that you have sufficient permissions in the project

## Cost Management

Monitor your costs in the Google Cloud Console under "Billing". For this application, the costs should be minimal, but it's good practice to set up billing alerts to prevent unexpected charges.

## Security Best Practices

1. Limit access to your Cloud Run service if it contains sensitive data
2. Consider encrypting sensitive data before storing it in Cloud Storage
3. Regularly update dependencies to address security vulnerabilities
4. Set up Cloud Monitoring to detect unusual activity

## Local Development with Cloud Storage

For local development that uses the Cloud Storage backend:

1. Install the Google Cloud SDK
2. Authenticate with application default credentials:
   ```bash
   gcloud auth application-default login
   ```
3. Use the same server.py script but run it locally:
   ```bash
   python server.py
   ```

This setup allows you to develop locally while using the cloud for data storage.