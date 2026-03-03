"""
Tagore Learning Platform — Python FastAPI Backend
Deployed on Vercel as serverless functions.

Uses Google Gemini API (FREE tier — 15 RPM, 1M tokens/day)
Get your free API key at: https://aistudio.google.com/apikey

Endpoints:
  POST /api/chat   — AI chat via Google Gemini
  GET  /api/health — Health check
"""

import os
import json
from http.client import HTTPSConnection
from urllib.parse import urlencode

# ─── CORS Headers ───────────────────────────────────────────────
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}


def handler(event, context):
    """
    Vercel serverless function handler.
    Routes requests based on path and method.
    """
    path = event.get("path", "")
    method = event.get("httpMethod", "GET")

    # Handle CORS preflight
    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": "",
        }

    # Route: Health check
    if path == "/api/health":
        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"status": "ok", "service": "Tagore Learning Platform API"}),
        }

    # Route: AI Chat
    if path == "/api/chat" and method == "POST":
        return handle_chat(event)

    # 404
    return {
        "statusCode": 404,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"error": "Not found"}),
    }


def handle_chat(event):
    """
    Handle POST /api/chat
    Expects JSON body: { "message": str, "systemPrompt": str (optional) }
    Calls Google Gemini API and returns { "reply": str }
    """
    try:
        body = json.loads(event.get("body", "{}"))
        message = body.get("message", "").strip()
        system_prompt = body.get(
            "systemPrompt",
            "You are an AI Tutor for the Tagore Learning Platform. Be helpful, concise, and educational.",
        )

        if not message:
            return {
                "statusCode": 400,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Message is required"}),
            }

        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return {
                "statusCode": 500,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "Gemini API key is not configured on the server. Get a free key at https://aistudio.google.com/apikey"}),
            }

        # Call Google Gemini API
        reply = call_gemini(api_key, message, system_prompt)

        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"reply": reply}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"error": f"Failed to communicate with AI server: {str(e)}"}),
        }


def call_gemini(api_key, message, system_prompt):
    """
    Call Google Gemini API using Python stdlib (no pip dependencies).
    Uses gemini-2.0-flash model (free tier).
    
    API docs: https://ai.google.dev/gemini-api/docs
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

    # Gemini uses API key as query param
    path = f"/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    conn.request("POST", path, body=payload, headers=headers)
    response = conn.getresponse()
    data = json.loads(response.read().decode())

    if response.status != 200:
        error_msg = data.get("error", {}).get("message", "Unknown API error")
        raise Exception(f"Gemini API error ({response.status}): {error_msg}")

    # Extract text from response
    candidates = data.get("candidates", [])
    if not candidates:
        return "I'm sorry, I couldn't generate a response."

    parts = candidates[0].get("content", {}).get("parts", [])
    reply_text = ""
    for part in parts:
        reply_text += part.get("text", "")

    return reply_text or "I'm sorry, I couldn't generate a response."
