"""
/api/health — Health check endpoint
"""
import json
from http.server import BaseHTTPRequestHandler
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        response = json.dumps({
            "status": "ok",
            "service": "Tagore Learning Platform API"
        })
        self.wfile.write(response.encode())
