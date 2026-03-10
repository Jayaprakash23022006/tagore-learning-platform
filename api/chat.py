"""
/api/chat — AI Chat endpoint using Google Gemini (FREE)
Handles CORS, OPTIONS preflight, and POST for chat.
"""
import os
import json
from http.server import BaseHTTPRequestHandler
from http.client import HTTPSConnection


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        """CORS preflight — must respond before browser sends POST."""
        self.send_response(200)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        """Simple GET for testing the endpoint is alive."""
        self._json(200, {"status": "ok", "endpoint": "/api/chat"})

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
                self._json(500, {
                    "error": "GEMINI_API_KEY is not set on the server. Add it in Vercel → Settings → Environment Variables."
                })
                return

            reply = call_gemini(api_key, message, system_prompt)
            self._json(200, {"reply": reply})

        except Exception as e:
            self._json(500, {"error": f"AI server error: {str(e)}"})

    def _json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.send_header("Access-Control-Max-Age", "86400")

    def log_message(self, format, *args):
        """Suppress default request logging to keep Vercel logs clean."""
        pass


def call_gemini(api_key, message, system_prompt):
    """Call Google Gemini 2.0 Flash API (FREE tier)."""
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
        err = data.get("error", {})
        raise Exception(f"Gemini error {resp.status}: {err.get('message', 'Unknown error')}")

    candidates = data.get("candidates", [])
    if not candidates:
        return "I'm sorry, I couldn't generate a response."

    parts = candidates[0].get("content", {}).get("parts", [])
    return "".join(p.get("text", "") for p in parts) or "I'm sorry, I couldn't generate a response."
