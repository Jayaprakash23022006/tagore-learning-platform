import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

/**
 * VIDashboard — Voice Navigated Portal for Visually Impaired students
 * Features: Speech Recognition, Text-to-Speech, Voice-controlled AI
 * Ported from original vi.html
 */
export default function VIDashboard() {
    const { getAccessToken } = useAuth();
    const [isListening, setIsListening] = useState(false);
    const [statusText, setStatusText] = useState('Tap to start speaking...');
    const [statusColor, setStatusColor] = useState('var(--text-main)');
    const [transcription, setTranscription] = useState('Your speech and the AI response will appear here.');
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    /* ─── Initialize Speech Recognition ──────────────── */
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setStatusText('Speech Recognition API not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setStatusText('Listening...');
            setStatusColor('var(--error)');
            stopSpeaking();
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                processVoiceCommand(finalTranscript);
            } else {
                setTranscription(`<em>${interimTranscript}</em>`);
            }
        };

        recognition.onerror = (event) => {
            setStatusText(`Error: ${event.error}`);
            stopListeningUI();
        };

        recognition.onend = () => {
            /* Only reset if we're not waiting for AI response */
            setIsListening(prev => {
                if (prev) stopListeningUI();
                return false;
            });
        };

        recognitionRef.current = recognition;

        /* Announce the page on load */
        if ('speechSynthesis' in window) {
            const welcome = new SpeechSynthesisUtterance(
                'Welcome to the Voice Navigated Portal. Tap the microphone button and speak your question.'
            );
            window.speechSynthesis.speak(welcome);
        }

        return () => {
            recognition.abort();
            window.speechSynthesis?.cancel();
        };
    }, []);

    /* ─── Helpers ────────────────────────────────────── */
    const stopListeningUI = () => {
        setIsListening(false);
        setStatusText('Tap to speak again');
        setStatusColor('var(--text-main)');
    };

    const stopSpeaking = () => {
        if (synthesisRef.current?.speaking) {
            synthesisRef.current.cancel();
        }
    };

    const readAloud = useCallback((text) => {
        stopSpeaking();
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => {
            setStatusText('Tap to speak again');
            setStatusColor('var(--text-main)');
        };
        synthesisRef.current.speak(utterance);
    }, []);

    /* ─── Toggle mic ─────────────────────────────────── */
    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error('Recognition start error:', e);
            }
        }
    };

    /* ─── Process voice command ──────────────────────── */
    const processVoiceCommand = async (transcript) => {
        setIsListening(false);
        setTranscription(`<strong>You said:</strong> ${transcript}<br><br><em>Waiting for AI response...</em>`);
        setStatusText('Processing...');
        setStatusColor('var(--warning)');

        /* Built-in navigation commands */
        const lower = transcript.toLowerCase();
        if (lower.includes('go back') || lower.includes('exit')) {
            readAloud('Exiting to main menu.');
            setTimeout(() => window.location.href = '/', 2000);
            return;
        }

        /* Send to AI backend */
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const token = await getAccessToken();

            const systemPrompt = "You are the 'Readable AI', an auditory assistant for Visually Impaired students on the Tagore Learning Platform. Provide exceptionally clear, concise, and structured answers without bullet points or complex markdown, as your output will be read aloud via Text-to-Speech. Answer directly.";

            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ message: transcript, systemPrompt })
            });

            const data = await response.json();

            if (response.ok) {
                setTranscription(`<strong>You said:</strong> ${transcript}<br><br><strong>AI:</strong> ${data.reply}`);
                setStatusText('Reading response...');
                setStatusColor('var(--success)');
                readAloud(data.reply);
            } else {
                throw new Error(data.error || 'Server Error');
            }
        } catch (error) {
            setTranscription(
                `<strong>You said:</strong> ${transcript}<br><br><span style="color: var(--error)">Error: ${error.message} — Make sure backend server is running</span>`
            );
            setStatusText('Error occurred');
            setStatusColor('var(--error)');
            readAloud('Sorry, I could not connect to the server. Please check your connection.');
        }
    };

    return (
        <>
            <div className="bg-shape shape-1" style={{ background: 'var(--portal-vi-start)' }}></div>
            <div className="bg-shape shape-2"></div>

            <Navbar
                brand={{ icon: 'fas fa-eye-slash', label: 'Voice Portal', color: 'var(--portal-vi-start)' }}
                links={[]}
            />

            <div className="container vi-container mt-5">
                <h1 className="gradient-text mb-4">Readable AI Assistant</h1>
                <p className="text-muted mb-5" style={{ maxWidth: '600px' }}>
                    Tap the microphone button and speak your question or command. The AI will listen and read the response back to you.
                    <br />
                    <strong>Commands:</strong> "Read History", "Read Science", "Go back", "Exit"
                </p>

                <button
                    className={`mic-btn ${isListening ? 'listening' : ''}`}
                    onClick={toggleListening}
                    aria-label={isListening ? 'Stop voice assistant' : 'Start voice assistant'}
                >
                    <i className="fas fa-microphone"></i>
                </button>

                <div className="status-text" style={{ color: statusColor }}>
                    {statusText}
                </div>

                <div
                    className="transcription"
                    dangerouslySetInnerHTML={{ __html: transcription }}
                ></div>

                <div className="nav-controls">
                    <button
                        className="btn btn-primary"
                        onClick={stopSpeaking}
                        style={{ background: 'var(--warning)' }}
                    >
                        <i className="fas fa-stop" style={{ marginRight: '0.5rem' }}></i>
                        Stop Audio
                    </button>
                </div>
            </div>
        </>
    );
}
