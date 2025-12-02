import http.server
import ssl
import os
import urllib.request
import urllib.error
import json

# Define the directory to serve
SERVER_ROOT = ".server_root"
PORT = 4433

os.makedirs(SERVER_ROOT, exist_ok=True)
symlink_path = os.path.join(SERVER_ROOT, "hi_25")
if os.path.exists(symlink_path):
    os.remove(symlink_path)
os.symlink("../dist", symlink_path)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SERVER_ROOT, **kwargs)

    def do_POST(self):
        if self.path.startswith('/api/proxy'):
            self.handle_proxy()
        else:
            super().do_POST()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Target-URL')
        self.end_headers()

    def handle_proxy(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        target_url = self.headers.get('X-Target-URL')
        if not target_url:
            self.send_error(400, "Missing X-Target-URL header")
            return

        print(f"Proxying request to: {target_url}")

        try:
            req = urllib.request.Request(
                target_url, 
                data=post_data, 
                headers={'Content-Type': 'application/json'}, 
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                for key, value in response.headers.items():
                    if key.lower() not in ['content-encoding', 'content-length', 'transfer-encoding']:
                        self.send_header(key, value)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response.read())

        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(e.read())
        except Exception as e:
            print(f"Proxy error: {e}")
            self.send_error(500, str(e))

httpd = http.server.HTTPServer(('0.0.0.0', PORT), Handler)

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile="cert.pem", keyfile="key.pem")
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Serving HTTPS on port {PORT}...")
print(f"Access at https://localhost:{PORT}/hi_25/")
httpd.serve_forever()
