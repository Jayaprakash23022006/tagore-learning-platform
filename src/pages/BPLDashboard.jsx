import React from 'react';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
import ChatWidget from '../components/ChatWidget';

/**
 * BPLDashboard — Content Access Plus portal
 * For BPL (Below Poverty Level) students — 1st-12th standard content
 * Ported from original bpl.html
 */
export default function BPLDashboard() {
    return (
        <>
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>

            <Navbar
                brand={{ icon: 'fas fa-book-reader', label: 'Content Access Plus', color: 'var(--portal-bpl-start)' }}
                links={[
                    { href: '#library', label: 'Content Library', active: true },
                    { href: '#courses', label: 'Courses' }
                ]}
            />

            <div className="container mt-5">
                <header className="mb-5 text-center">
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Welcome, Student
                    </h1>
                    <p className="text-muted">
                        Access free high-quality education spanning 1st to 12th standard.
                    </p>
                </header>

                {/* ─── Content Library ──────────────────────────────── */}
                <section id="library" className="mb-5">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mb-4">
                        <h2>
                            <i className="fas fa-video" style={{ color: 'var(--primary)' }}></i> Featured Library
                        </h2>
                        <span className="badge badge-bpl">1st - 12th Standard</span>
                    </div>

                    <div className="grid-3">
                        <VideoCard
                            videoId="nZ1mGqH8lGQ"
                            title="Mathematics Fundamentals"
                            description="Core concepts from basic arithmetic to advanced calculus specifically tailored for school syllabus."
                            chapters="12 Chapters"
                            actionLabel="View PDF Notes"
                            accentColor="var(--portal-bpl-start)"
                        />
                        <VideoCard
                            videoId="b1t41Q3xRM8"
                            title="Physics - Mechanics"
                            description="Understand the laws of nature with visual demonstrations and simple explanations."
                            chapters="8 Chapters"
                            actionLabel="Take Assessment"
                            accentColor="var(--portal-bpl-start)"
                        />
                        <VideoCard
                            videoId="2_N1d1F6LzI"
                            title="Tamil Ilakkanam"
                            description="Learn Tamil grammar comprehensively. Essential for board exams."
                            chapters="15 Chapters"
                            actionLabel="Download Materials"
                            accentColor="var(--portal-bpl-start)"
                        />
                    </div>
                </section>

                {/* ─── Structured Courses ──────────────────────────── */}
                <section id="courses" className="mb-5">
                    <h2 className="mb-4">
                        <i className="fas fa-layer-group" style={{ color: 'var(--accent)' }}></i> Complete Subjects Breakdown
                    </h2>

                    <div className="grid-2">
                        {/* Chemistry */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>
                                <i className="fas fa-flask"></i> Chemistry (11th & 12th)
                            </h3>
                            <ul className="subject-list">
                                <li className="subject-item">
                                    <span>Organic Chemistry - Basics</span>
                                    <a href="#">Watch & Assess <i className="fas fa-arrow-right"></i></a>
                                </li>
                                <li className="subject-item">
                                    <span>Inorganic Periodicity</span>
                                    <a href="#">Watch & Assess <i className="fas fa-arrow-right"></i></a>
                                </li>
                            </ul>
                        </div>

                        {/* English */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>
                                <i className="fas fa-language"></i> English Comm. Skills
                            </h3>
                            <ul className="subject-list">
                                <li className="subject-item">
                                    <span>Grammar Essentials</span>
                                    <a href="#">Watch & Assess <i className="fas fa-arrow-right"></i></a>
                                </li>
                                <li className="subject-item">
                                    <span>Prose & Poetry Analysis</span>
                                    <a href="#">Watch & Assess <i className="fas fa-arrow-right"></i></a>
                                </li>
                            </ul>
                        </div>

                        {/* Social Science */}
                        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>
                                <i className="fas fa-globe"></i> Social Science
                            </h3>
                            <ul className="subject-list">
                                <li className="subject-item">
                                    <span>Indian History & Constitution</span>
                                    <a href="#">Watch & Assess <i className="fas fa-arrow-right"></i></a>
                                </li>
                                <li className="subject-item">
                                    <span>Geography - Maps & Resources</span>
                                    <a href="#">Download High-Res Maps <i className="fas fa-download"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <ChatWidget
                systemPrompt="You are the AI Tutor for BPL students on the Tagore Learning Platform. Help with subjects: Maths, English, Tamil, Physics, Chemistry, Social Science (1st-12th standard). Be helpful, concise, and educational. Use simple language."
                accentColor="var(--portal-bpl-start)"
                title="AI Tutor"
                icon="fas fa-chalkboard-teacher"
                welcomeMessage="Hello! I'm your AI Tutor. Need help with any subjects today?"
            />
        </>
    );
}
