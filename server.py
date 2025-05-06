#!/usr/bin/env python3
import os
import sys
import json
import base64
import time
from http import server
from urllib.parse import parse_qs, urlparse

# Try to import Google Cloud Storage, but provide graceful fallback
cloud_storage_available = False
bucket = None
try:
    from google.cloud import storage
    # Placeholder for successful import
    print("Successfully imported Google Cloud Storage module")
except ImportError:
    print("Google Cloud Storage module not available. Running in local-only mode.")
    storage = None

# Initialize Google Cloud Storage client
try:
    # First check if the google.cloud.storage module exists
    if 'google.cloud.storage' in sys.modules or storage:
        print("Google Cloud Storage module is available, initializing client...")
        try:
            # Try to get the default credentials
            storage_client = storage.Client()
            bucket_name = os.environ.get('BUCKET_NAME', 'cyberpunk-gm-screen-data')
            bucket = storage_client.bucket(bucket_name)
            
            # Test bucket access by listing blobs
            list(bucket.list_blobs(max_results=1))
            
            cloud_storage_available = True
            print(f"Successfully connected to Google Cloud Storage bucket: {bucket_name}")
        except Exception as client_error:
            print(f"Warning: Could not initialize Google Cloud Storage client: {client_error}")
            cloud_storage_available = False
            bucket = None
    else:
        print("Google Cloud Storage module is not available, running in local-only mode")
        cloud_storage_available = False
        bucket = None
except ImportError:
    print("Google Cloud Storage module is not installed, running in local-only mode")
    cloud_storage_available = False
    bucket = None
except Exception as e:
    print(f"Unexpected error initializing storage: {e}")
    cloud_storage_available = False
    bucket = None

# Show a clear status message about cloud storage
print(f"\n{'=' * 50}")
if cloud_storage_available:
    print("CLOUD STORAGE: ENABLED")
    print(f"Using bucket: {bucket_name}")
else:
    print("CLOUD STORAGE: DISABLED (local storage only)")
    print("To enable cloud storage, set up Google Cloud credentials")
print(f"{'=' * 50}\n")

class CyberpunkHandler(server.SimpleHTTPRequestHandler):
    """Custom handler for serving static files and API endpoints"""
    
    def do_GET(self):
        """Handle GET requests"""
        # Parse URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # API endpoints
        if path.startswith('/api/'):
            # Debug endpoint to get request info
            if path == '/api/debug':
                self._handle_debug()
                return
                
            # Cloud storage ping endpoint
            if path == '/api/storage/ping':
                self._handle_ping()
                return
                
            # Cloud storage load endpoint
            elif path == '/api/storage/load':
                # Get storage key from query parameters
                query = parse_qs(parsed_url.query)
                key = query.get('key', [''])[0]
                
                if not key:
                    self._send_json_response({'error': 'Missing key parameter'}, 400)
                    return
                
                self._handle_storage_load(key)
                return
                
            # Unknown API endpoint
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
                return
        
        # Serve static files
        super().do_GET()
    
    def do_POST(self):
        """Handle POST requests"""
        # Parse URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # API endpoints
        if path.startswith('/api/'):
            # Cloud storage save endpoint
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
                    
                    self._handle_storage_save(key, value)
                    
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
            # Cloud storage delete endpoint
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
                    
                    self._handle_storage_delete(key)
                    
                except Exception as e:
                    self._send_json_response({'error': str(e)}, 500)
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
        else:
            self.send_response(405)
            self.end_headers()
    
    def _handle_debug(self):
        """Handle debug requests to get server info"""
        # Get information about the server
        info = {
            'server_time': time.time(),
            'cloud_storage_available': cloud_storage_available,
            'path': self.path,
            'method': self.command,
            'headers': dict(self.headers),
            'api_endpoints': ['/api/storage/ping', '/api/storage/load', '/api/storage/save', '/api/storage/delete', '/api/debug'],
            'python_version': sys.version,
        }
        
        # Send response
        self._send_json_response(info, 200)
    
    def _handle_ping(self):
        """Handle cloud storage ping requests"""
        global cloud_storage_available
        
        try:
            # Check if cloud storage is available and properly configured
            if not cloud_storage_available:
                # Instead of returning 503, return 200 with offline status
                # This allows the client to work properly even when cloud is offline
                self._send_json_response({
                    'status': 'offline',
                    'message': 'Cloud Storage not configured, using offline mode',
                    'timestamp': time.time()
                }, 200)  # OK but offline
                return
                
            # Try a quick test operation - if it fails, we'll catch the exception
            try:
                # Only try to list blobs if bucket exists
                if bucket is not None:
                    blobs = list(bucket.list_blobs(max_results=1))
                    
                    # Send success response
                    self._send_json_response({
                        'status': 'ok',
                        'message': 'Cloud Storage is available',
                        'timestamp': time.time()
                    }, 200)
                else:
                    # Bucket doesn't exist, return offline status
                    self._send_json_response({
                        'status': 'offline',
                        'message': 'Cloud Storage bucket not configured',
                        'timestamp': time.time()
                    }, 200)  # OK but offline
            except Exception as bucket_error:
                # Issue with the bucket, but API is responding
                cloud_storage_available = False
                self._send_json_response({
                    'status': 'offline',
                    'error': str(bucket_error),
                    'message': 'Error accessing Cloud Storage bucket',
                    'timestamp': time.time()
                }, 200)  # OK but offline
                
        except Exception as e:
            cloud_storage_available = False
            self._send_json_response({
                'status': 'offline', 
                'error': str(e),
                'message': 'Error connecting to Cloud Storage service',
                'timestamp': time.time()
            }, 200)  # OK but offline - changed from 503 to allow client to work
    
    def _handle_storage_load(self, key):
        """Handle loading data from cloud storage"""
        global cloud_storage_available
        
        try:
            # Check if cloud storage is available
            if not cloud_storage_available or bucket is None:
                # Instead of 503, return 200 with indicator to use local storage
                self._send_json_response({
                    'message': 'Cloud Storage not available, use local data',
                    'data': None,
                    'useLocalStorage': True
                }, 200)
                return
                
            # Try to get blob from storage
            try:
                blob = bucket.blob(key)
                
                if not blob.exists():
                    self._send_json_response({
                        'data': None,
                        'message': 'Item not found in cloud storage'
                    }, 200)
                    return
                
                # Get data from blob
                data = json.loads(blob.download_as_string())
                self._send_json_response({'data': data}, 200)
            except Exception as blob_error:
                # Issue with specific blob, but API is responding
                self._send_json_response({
                    'message': f'Error accessing data: {str(blob_error)}',
                    'data': None,
                    'useLocalStorage': True
                }, 200)
            
        except Exception as e:
            cloud_storage_available = False
            self._send_json_response({
                'message': f'Error with cloud storage: {str(e)}',
                'data': None,
                'useLocalStorage': True
            }, 200)  # Changed from 500 to 200 to allow client fallback
    
    def _handle_storage_save(self, key, value):
        """Handle saving data to cloud storage"""
        global cloud_storage_available
        
        try:
            # Check if cloud storage is available
            if not cloud_storage_available or bucket is None:
                # Instead of 503, return 200 with indicator to use local storage
                self._send_json_response({
                    'message': 'Cloud Storage not available, saved to local storage',
                    'success': True,
                    'useLocalStorage': True
                }, 200)
                return
                
            try:
                # Store data in Cloud Storage
                blob = bucket.blob(key)
                blob.upload_from_string(json.dumps(value), content_type='application/json')
                
                self._send_json_response({
                    'success': True,
                    'message': 'Data saved to cloud storage'
                }, 200)
            except Exception as blob_error:
                # Issue with saving to blob, but API is responding
                self._send_json_response({
                    'message': f'Error saving data: {str(blob_error)}',
                    'success': True,
                    'useLocalStorage': True
                }, 200)
                
        except Exception as e:
            cloud_storage_available = False
            self._send_json_response({
                'message': f'Error with cloud storage: {str(e)}',
                'success': True,
                'useLocalStorage': True
            }, 200)  # Changed from 500 to 200 to allow client fallback
    
    def _handle_storage_delete(self, key):
        """Handle deleting data from cloud storage"""
        global cloud_storage_available
        
        try:
            # Check if cloud storage is available
            if not cloud_storage_available or bucket is None:
                # Instead of 503, return 200 with indicator to use local storage
                self._send_json_response({
                    'message': 'Cloud Storage not available, removed from local storage only',
                    'success': True,
                    'useLocalStorage': True
                }, 200)
                return
                
            try:
                # Delete blob from Cloud Storage
                blob = bucket.blob(key)
                
                if blob.exists():
                    blob.delete()
                
                self._send_json_response({
                    'success': True,
                    'message': 'Data deleted from cloud storage'
                }, 200)
            except Exception as blob_error:
                # Issue with deleting blob, but API is responding
                self._send_json_response({
                    'message': f'Error deleting data: {str(blob_error)}',
                    'success': True,
                    'useLocalStorage': True
                }, 200)
                
        except Exception as e:
            cloud_storage_available = False
            self._send_json_response({
                'message': f'Error with cloud storage: {str(e)}',
                'success': True,
                'useLocalStorage': True
            }, 200)  # Changed from 500 to 200 to allow client fallback
    
    def _send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        # Add CORS headers to allow cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run():
    """Run the server"""
    # Try several ports starting with 8888
    ports_to_try = [8888, 8889, 8890, 8891, 8892, 8893, 8894, 8895, 8896, 8897, 8898, 8899]
    
    # Override with environment variable if specified
    if os.environ.get('PORT'):
        ports_to_try = [int(os.environ.get('PORT'))]
    
    for port in ports_to_try:
        try:
            server_address = ('', port)
            httpd = server.HTTPServer(server_address, CyberpunkHandler)
            print(f"\nStarting Cyberpunk GM Screen Server on port {port}...")
            print(f"Cloud Storage status: {'Available' if cloud_storage_available else 'Unavailable'}")
            print(f"Access the application at http://localhost:{port}/desktop.html")
            httpd.serve_forever()
            break  # If we get here, the server started successfully
        except OSError as e:
            if e.errno == 98:  # Address already in use
                print(f"Port {port} is already in use, trying another port...")
            else:
                raise  # Re-raise if it's not a "port in use" error

if __name__ == '__main__':
    run()