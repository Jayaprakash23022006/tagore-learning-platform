"""
/api/chat — AI Chat endpoint using Google Gemini (FREE)
"""
import os
import json
from http.server import BaseHTTPRequestHandler
from http.client import HTTPSConnection
class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            message = data.get("message", "").strip()
            system_prompt = data.get(
                "systemPrompt",
                "You are an AI Tutor for the Tagore Learning Platform. Be helpful, concise, and educational.",
            )
            if not message:
                self._json(400, {"error": "Message is required"})
                return
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                self._json(500, {"error": "Gemini API key not configured. Get a free key at https://aistudio.google.com/apikey"})
                return
            reply = call_gemini(api_key, message, system_prompt)
            self._json(200, {"reply": reply})
        except Exception as e:
            self._json(500, {"error": f"AI server error: {str(e)}"})
    def _json(self, code, data):
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
def call_gemini(api_key, message, system_prompt):
    conn = HTTPSConnection("generativelanguage.googleapis.com")
    payload = json.dumps({
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": message}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024},
    })
    path = f"/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    conn.request("POST", path, body=payload, headers={"Content-Type": "application/json"})
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    if resp.status != 200:
        raise Exception(data.get("error", {}).get("message", "Gemini API error"))
    candidates = data.get("candidates", [])
    if not candidates:
        return "I'm sorry, I couldn't generate a response."
    parts = candidates[0].get("content", {}).get("parts", [])
    return "".join(p.get("text", "") for p in parts) or "I'm sorry, I couldn't generate a response."
