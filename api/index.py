"""
Tagore Learning Platform — Python API for Vercel
Deployed as Vercel Serverless Function.
Uses Google Gemini API (FREE tier — 15 RPM, 1M tokens/day)
Get your free API key at: https://aistudio.google.com/apikey
Endpoints:
  POST /api/chat   — AI chat via Google Gemini
  GET  /api/health — Health check
"""
import os
import json
from http.server import BaseHTTPRequestHandler
from http.client import HTTPSConnection
class handler(BaseHTTPRequestHandler):
    """
    Vercel serverless Python handler.
    Vercel requires a class named 'handler' that extends BaseHTTPRequestHandler.
    """
    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()
    def do_GET(self):
        """Handle GET requests — health check."""
        self.send_response(200)
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        response = json.dumps({
            "status": "ok",
            "service": "Tagore Learning Platform API"
        })
        self.wfile.write(response.encode())
    def do_POST(self):
        """Handle POST requests — AI chat."""
        try:
            # Read request body
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            message = data.get("message", "").strip()
            system_prompt = data.get(
                "systemPrompt",
                "You are an AI Tutor for the Tagore Learning Platform. Be helpful, concise, and educational.",
            )
            if not message:
                self._send_json(400, {"error": "Message is required"})
                return
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                self._send_json(500, {
                    "error": "Gemini API key is not configured. Get a free key at https://aistudio.google.com/apikey"
                })
                return
            # Call Google Gemini API
            reply = call_gemini(api_key, message, system_prompt)
            self._send_json(200, {"reply": reply})
        except Exception as e:
            self._send_json(500, {
                "error": f"Failed to communicate with AI server: {str(e)}"
            })
    def _send_json(self, status_code, data):
        """Send a JSON response with CORS headers."""
        self.send_response(status_code)
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    def _set_cors_headers(self):
        """Set CORS headers to allow requests from any origin."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
def call_gemini(api_key, message, system_prompt):
    """
    Call Google Gemini API using Python stdlib (no pip dependencies).
    Uses gemini-2.0-flash model (free tier).
    """
    conn = HTTPSConnection("generativelanguage.googleapis.com")
    payload = json.dumps({
        "system_instruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": message}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024,
        }
    })
    headers = {
        "Content-Type": "application/json",
    }
    path = f"/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    conn.request("POST", path, body=payload, headers=headers)
    response = conn.getresponse()
    data = json.loads(response.read().decode())
    if response.status != 200:
        error_msg = data.get("error", {}).get("message", "Unknown API error")
        raise Exception(f"Gemini API error ({response.status}): {error_msg}")
    candidates = data.get("candidates", [])
    if not candidates:
        return "I'm sorry, I couldn't generate a response."
    parts = candidates[0].get("content", {}).get("parts", [])
    reply_text = ""
    for part in parts:
        reply_text += part.get("text", "")
    return reply_text or "I'm sorry, I couldn't generate a response."

