import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * WelcomePage — Animated transition screen after login
 * Ported from original welcome.html
 */
export default function WelcomePage() {
    const navigate = useNavigate();
    const { user, userType } = useAuth();

    useEffect(() => {
        if (!user || !userType) {
            navigate('/');
            return;
        }

        const portalPath = `/${userType}`;

        /* TTS welcome for visually impaired users */
        if (userType === 'vi' && 'speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance('Welcome to Tagore Learning Platform.');
            msg.onend = () => {
                setTimeout(() => navigate(portalPath), 500);
            };
            window.speechSynthesis.speak(msg);
        } else {
            /* Redirect after 2.5s for other portals */
            const timer = setTimeout(() => navigate(portalPath), 2500);
            return () => clearTimeout(timer);
        }
    }, [user, userType, navigate]);

    return (
        <>
            <div className="bg-shape shape-1" style={{ width: '600px', height: '600px' }}></div>
            <div className="bg-shape shape-2"></div>

            <div className="welcome-screen">
                <div className="welcome-container">
                    <h1 className="welcome-title">Welcome</h1>
                    <p className="welcome-subtitle">
                        Preparing your specialized learning environment...
                    </p>
                    <div className="loading-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
