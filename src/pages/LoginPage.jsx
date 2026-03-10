import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * LoginPage — Split 4-portal sign-in interface
 * Ported from original index.html
 */
export default function LoginPage() {
    const navigate = useNavigate();
    const { signIn, signUp, user } = useAuth();

    /* If already logged in, redirect to correct portal */
    React.useEffect(() => {
        if (user) {
            const type = localStorage.getItem('userType');
            if (type) navigate(`/${type === 'general' ? 'general' : type}`);
        }
    }, [user, navigate]);

    /* Modal state */
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPortal, setCurrentPortal] = useState('');
    const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hiChecked, setHiChecked] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanStatus, setScanStatus] = useState('Awaiting scan...');
    const [scanColor, setScanColor] = useState('var(--text-muted)');

    /* Portal definitions */
    const portals = [
        {
            id: 'bpl',
            icon: 'fas fa-book-reader',
            title: 'Content Access Plus',
            desc: 'For eligible students requiring specialized access to core subjects and extensive content library.',
            cssClass: 'portal-bpl',
            btnColor: 'var(--portal-bpl-start)'
        },
        {
            id: 'hi',
            icon: 'fas fa-hands-asl-interpreting',
            title: 'ISL Supported Learning',
            desc: 'Visual learning paths featuring Indian Sign Language videos and dictionary integration.',
            cssClass: 'portal-hi',
            btnColor: 'var(--portal-hi-start)'
        },
        {
            id: 'vi',
            icon: 'fas fa-eye-slash',
            title: 'Voice Navigated Portal',
            desc: 'Fully accessible interface with biometric login, voice navigation and Readable AI tutor.',
            cssClass: 'portal-vi',
            btnColor: 'var(--portal-vi-start)'
        },
        {
            id: 'general',
            icon: 'fas fa-users',
            title: 'General Studies',
            desc: 'Standard access to higher education courses, skill development, and multi-language tools.',
            cssClass: 'portal-common',
            btnColor: 'var(--portal-common-start)'
        },
        {
            id: 'staff',
            icon: 'fas fa-user-tie',
            title: 'Staff Portal',
            desc: 'For teachers and faculty to upload study materials, question papers, and resources for all students.',
            cssClass: 'portal-staff',
            btnColor: '#0ea5e9'
        }
    ];

    /* Open login modal for a specific portal */
    const openLogin = (portalId) => {
        setCurrentPortal(portalId);
        setModalOpen(true);
        setError('');
        setSuccess('');
        setEmail('');
        setPassword('');
        setHiChecked(false);
        setAuthMode('signin');
        setScanStatus('Awaiting scan...');
        setScanColor('var(--text-muted)');

        /* TTS for visually impaired */
        if (portalId === 'vi' && 'speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(
                'Biometric verification required. Please tap the fingerprint sensor to sign in.'
            );
            window.speechSynthesis.speak(msg);
        }
    };

    const closeLogin = () => {
        setModalOpen(false);
        window.speechSynthesis?.cancel();
    };

    /* Form titles per portal */
    const getFormTitle = () => {
        const titles = {
            bpl: 'Content Access Plus',
            hi: 'ISL Supported Login',
            general: 'General Studies',
            vi: 'Biometric Verification',
            staff: 'Staff Portal Login'
        };
        return titles[currentPortal] || 'Sign In';
    };

    /* Handle standard sign-in / sign-up */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (currentPortal === 'hi' && !hiChecked) {
            setError('Please confirm the hearing impaired checkbox to access ISL features.');
            return;
        }

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            if (authMode === 'signup') {
                await signUp(email, password, currentPortal);
                setSuccess('Account created! Check your email for verification, or sign in now.');
                setAuthMode('signin');
            } else {
                await signIn(email, password, currentPortal);
                navigate('/welcome');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /* Handle biometric simulation for VI */
    const simulateBiometric = async () => {
        setScanStatus('Scanning...');
        setScanColor('var(--portal-vi-start)');

        /* Simulate scanning delay */
        await new Promise(r => setTimeout(r, 1500));

        setScanStatus('Verified!');
        setScanColor('var(--success)');

        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance('Verification successful.');
            window.speechSynthesis.speak(msg);
        }

        /* Auto-login for VI user — uses a designated demo account or creates one */
        try {
            const viEmail = 'vi-user@tagore-learn.local';
            const viPass = 'tagore-vi-2024';

            try {
                await signIn(viEmail, viPass, 'vi');
            } catch {
                /* If sign-in fails, try sign-up */
                await signUp(viEmail, viPass, 'vi');
                await signIn(viEmail, viPass, 'vi');
            }

            setTimeout(() => navigate('/welcome'), 1000);
        } catch (err) {
            setScanStatus('Error — Please try again');
            setScanColor('var(--error)');
        }
    };

    return (
        <>
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>

            <div className="login-container">
                <div className="container text-center">
                    <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Tagore Learning Platform
                    </h1>
                    <p className="mb-5 text-muted" style={{ fontSize: '1.1rem' }}>
                        Select your portal — students or staff
                    </p>

                    <div className="login-grid">
                        {portals.map((portal) => (
                            <div
                                key={portal.id}
                                className={`glass-panel portal-card ${portal.cssClass}`}
                                onClick={() => openLogin(portal.id)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && openLogin(portal.id)}
                                aria-label={`Open ${portal.title} portal`}
                            >
                                <i className={`${portal.icon} portal-icon`}></i>
                                <h2 className="portal-title">{portal.title}</h2>
                                <p className="portal-desc">{portal.desc}</p>
                                <span className="btn btn-primary" style={{ background: portal.btnColor }}>
                                    Select Portal
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <div className={`form-popup ${modalOpen ? 'active' : ''}`}>
                <div className="glass-panel login-box">
                    <button className="close-popup" onClick={closeLogin} aria-label="Close login">
                        <i className="fas fa-times"></i>
                    </button>

                    {/* Standard login (BPL, HI, General) */}
                    {currentPortal !== 'vi' ? (
                        <div>
                            <h2 className="mb-4 text-center">{getFormTitle()}</h2>

                            {/* Auth mode tabs */}
                            <div className="auth-tabs">
                                <button
                                    className={`auth-tab ${authMode === 'signin' ? 'active' : ''}`}
                                    onClick={() => { setAuthMode('signin'); setError(''); setSuccess(''); }}
                                >
                                    Sign In
                                </button>
                                <button
                                    className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
                                    onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
                                >
                                    Create Account
                                </button>
                            </div>

                            {error && <div className="auth-error">{error}</div>}
                            {success && <div className="auth-success">{success}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                        minLength={6}
                                        autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                                    />
                                </div>

                                {/* HI checkbox */}
                                {currentPortal === 'hi' && (
                                    <label className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            checked={hiChecked}
                                            onChange={(e) => setHiChecked(e.target.checked)}
                                        />
                                        I am Hearing Impaired (Enable ISL Features)
                                    </label>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Please wait...' : (authMode === 'signup' ? 'Create Account' : 'Sign In to Portal')}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Biometric login for VI */
                        <div>
                            <h2 className="mb-4 text-center">Biometric Verification</h2>
                            <p className="text-center text-muted mb-4">
                                Please tap the fingerprint sensor below to sign in
                            </p>
                            <div className="biometric-scan">
                                <button className="fingerprint" onClick={simulateBiometric} aria-label="Biometric scan">
                                    <i className="fas fa-fingerprint"></i>
                                </button>
                                <p style={{ color: scanColor }}>{scanStatus}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
