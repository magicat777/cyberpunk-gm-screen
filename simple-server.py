#!/usr/bin/env python3
import os
import sys
import json
import time
from http import server
from urllib.parse import parse_qs, urlparse

# Use a simple flag to indicate cloud storage availability
cloud_storage_available = False

class CyberpunkHandler(server.SimpleHTTPRequestHandler):
    """Custom handler for serving static files and API endpoints"""
    
    def do_GET(self):
        """Handle GET requests"""
        # Parse URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # API endpoints
        if path.startswith('/api/'):
            # Debug endpoint
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
                self._send_json_response({
                    'error': 'Endpoint not found',
                    'path': path,
                    'available_endpoints': ['/api/debug', '/api/storage/ping', '/api/storage/load']
                }, 404)
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
            'server_version': 'Simple Server 1.0',
        }
        
        # Send response
        self._send_json_response(info, 200)
    
    def _handle_ping(self):
        """Handle cloud storage ping requests"""
        # Return a simplified response
        self._send_json_response({
            'status': 'offline',
            'message': 'Cloud Storage not available, using offline mode',
            'timestamp': time.time()
        }, 200)  # OK but offline
    
    def _handle_storage_load(self, key):
        """Handle loading data from cloud storage"""
        # Return offline response
        self._send_json_response({
            'message': 'Cloud Storage not available, use local data',
            'data': None, 
            'useLocalStorage': True
        }, 200)
    
    def _handle_storage_save(self, key, value):
        """Handle saving data to cloud storage"""
        # Return offline response
        self._send_json_response({
            'message': 'Cloud Storage not available, saved to local storage',
            'success': True,
            'useLocalStorage': True
        }, 200)
    
    def _handle_storage_delete(self, key):
        """Handle deleting data from cloud storage"""
        # Return offline response
        self._send_json_response({
            'message': 'Cloud Storage not available, removed from local storage only',
            'success': True,
            'useLocalStorage': True
        }, 200)
    
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
    # Try several ports
    ports_to_try = [9900, 9901, 9902, 9903, 9904, 9905]
    
    for port in ports_to_try:
        try:
            server_address = ('', port)
            httpd = server.HTTPServer(server_address, CyberpunkHandler)
            print(f"\nStarting Simple Cyberpunk Server on port {port}...")
            print(f"Access the application at http://localhost:{port}/cloud-test.html")
            httpd.serve_forever()
            break  # If we get here, the server started successfully
        except OSError as e:
            if e.errno == 98:  # Address already in use
                print(f"Port {port} is already in use, trying another port...")
            else:
                raise  # Re-raise if it's not a "port in use" error

if __name__ == '__main__':
    run()