import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
/**
 * AI Chat Widget — reusable floating chatbot
 * Props:
 *   - systemPrompt: custom system prompt for the AI
 *   - accentColor: CSS color for button/header
 *   - title: chat window title
 *   - icon: FontAwesome icon class
 *   - welcomeMessage: initial AI greeting
 */
export default function ChatWidget({
    systemPrompt = 'You are an AI Tutor for the Tagore Learning Platform. Be helpful, concise, and educational.',
    accentColor = 'var(--primary)',
    title = 'AI Tutor',
    icon = 'fas fa-chalkboard-teacher',
    welcomeMessage = 'Hello! I\'m your AI Tutor. Need help with any subjects today?'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: welcomeMessage }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { getAccessToken } = useAuth();
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);
    const sendMessage = async () => {
        const text = input.trim();
        if (!text || isLoading) return;
        setMessages(prev => [...prev, { role: 'user', text }]);
        setInput('');
        setIsLoading(true);
        try {
            // Use env var, then hardcoded Vercel URL, then localhost for dev
            const apiBase = import.meta.env.VITE_API_BASE_URL
                || 'https://tagore-learning-platform.vercel.app';
            const token = await getAccessToken();
            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ message: text, systemPrompt })
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
            } else {
                throw new Error(data.error || 'Server error');
            }
        } catch (error) {
            const msg = error.message?.includes('Failed to fetch')
                ? 'Could not connect to the AI server. Please check your internet connection.'
                : error.message;
            setMessages(prev => [...prev, {
                role: 'ai',
                text: `⚠️ ${msg}`,
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };
    return (
        <div className="chat-widget">
            <button
                className="chat-button"
                id="chatBtn"
                onClick={() => setIsOpen(!isOpen)}
                style={{ background: accentColor }}
                aria-label="Open AI Chat"
            >
                <i className="fas fa-robot"></i>
            </button>
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div>
                        <i className={icon} style={{ color: accentColor, marginRight: '0.5rem' }}></i>
                        {title}
                    </div>
                    <i
                        className="fas fa-times"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setIsOpen(false)}
                    ></i>
                </div>
                <div className="chat-messages" id="chatMessages">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`message ${msg.role}`}
                            style={msg.isError ? { color: 'var(--error)' } : {}}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message ai">
                            <span className="chat-loading">Thinking...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading}
                        style={{ background: accentColor }}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
