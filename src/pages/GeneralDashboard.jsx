import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
import ChatWidget from '../components/ChatWidget';

/**
 * GeneralDashboard — General Studies portal for college-level students
 * Features: Tech courses, Data Science, AI/ML, assessments, Google Translate
 * Ported from original common.html
 */
export default function GeneralDashboard() {

    /* ─── Load Google Translate widget ──────────────── */
    useEffect(() => {
        /* Define the callback before loading the script */
        window.googleTranslateElementInit = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
                    autoDisplay: false
                }, 'google_translate_element');
            }
        };

        /* Dynamically load Google Translate script if not already loaded */
        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.type = 'text/javascript';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(script);
        } else {
            /* Script already loaded, re-init */
            window.googleTranslateElementInit?.();
        }
    }, []);

    return (
        <>
            <div className="bg-shape shape-1" style={{ background: 'var(--portal-common-start)' }}></div>
            <div className="bg-shape shape-2"></div>

            {/* Language Translator Bar */}
            <div className="translator-bar notranslate">
                <span className="translator-label">
                    <i className="fas fa-language"></i> Change Language:
                </span>
                <div id="google_translate_element"></div>
            </div>

            <Navbar
                brand={{ icon: 'fas fa-university', label: 'General Studies', color: 'var(--portal-common-start)' }}
                links={[
                    { href: '#college', label: 'College Courses', active: true },
                    { href: '#skills', label: 'Skill Development' }
                ]}
            />

            <div className="container mt-5">
                <header className="mb-5 text-center">
                    <h1 className="gradient-text mb-2">Higher Education & Skills</h1>
                    <p className="text-muted">
                        Advanced courses, AI, and Data Science. Switch language above as needed.
                    </p>
                </header>

                {/* ─── College Courses ─────────────────────────────── */}
                <section id="college" className="mb-5">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mb-4">
                        <h2>
                            <i className="fas fa-laptop-code" style={{ color: 'var(--portal-common-start)' }}></i> Tech & Engineering Courses
                        </h2>
                        <span className="badge badge-common notranslate">UG / PG</span>
                    </div>

                    <div className="grid-3">
                        <VideoCard
                            videoId="bAyrObl7TYE"
                            title="Big Data Analysis"
                            description="Hadoop, Spark, and large-scale data processing architectures."
                            chapters="12 Modules"
                            actionLabel="Take Assessment"
                            accentColor="var(--portal-common-start)"
                        />
                        <VideoCard
                            videoId="aA_b1qL-rGE"
                            title="Theory of Computation"
                            description="Automata theory, Turing machines, and language fundamentals."
                            chapters="8 Modules"
                            actionLabel="PDF Notes"
                            accentColor="var(--portal-common-start)"
                        />
                        <VideoCard
                            videoId="JMUxmLyrhSk"
                            title="AI & ML (AIDS)"
                            description="Neural networks, Deep Learning, and Artificial Intelligence overview."
                            chapters="15 Modules"
                            actionLabel="Resources & Assessment"
                            accentColor="var(--portal-common-start)"
                        />
                    </div>

                    <div className="grid-2 mt-5">
                        {/* DBMS & Data Warehouse */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--portal-common-end)' }}>
                                <i className="fas fa-database"></i> DBMS & Data Warehouse
                            </h3>
                            <ul className="subject-list notranslate">
                                <li className="subject-item">
                                    <span>SQL Fundamentals</span>
                                    <a href="#">Watch & Assess <i className="fas fa-arrow-right"></i></a>
                                </li>
                                <li className="subject-item">
                                    <span>OLAP vs OLTP Architecture</span>
                                    <a href="#">Download Notes <i className="fas fa-download"></i></a>
                                </li>
                            </ul>
                        </div>

                        {/* Data Structures */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>
                                <i className="fas fa-sitemap"></i> Data Structures
                            </h3>
                            <ul className="subject-list notranslate">
                                <li className="subject-item">
                                    <span>Trees & Graphs (Advanced)</span>
                                    <a href="#">Watch & Assess <i className="fas fa-arrow-right"></i></a>
                                </li>
                                <li className="subject-item">
                                    <span>Algorithm Complexity (Big O)</span>
                                    <a href="#">Assessments <i className="fas fa-check-circle"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ─── Skill Development ──────────────────────────── */}
                <section id="skills" className="mb-5">
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 className="mb-3">
                            <i className="fas fa-chart-line" style={{ color: 'var(--success)' }}></i> Skill Development & Assessments
                        </h2>
                        <p className="text-muted mb-4">
                            Prepare for industry roles. Launch assessments below.
                        </p>

                        <div className="grid-3 notranslate">
                            <div className="assessment-tile">
                                <h4>Aptitude & Reasoning</h4>
                                <p>Quant, logic, and puzzles.</p>
                                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    Start Test
                                </button>
                            </div>
                            <div className="assessment-tile">
                                <h4>Coding Interviews</h4>
                                <p>DS and Algo problem solving.</p>
                                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    Start Test
                                </button>
                            </div>
                            <div className="assessment-tile">
                                <h4>Communication Skills</h4>
                                <p>Verbal reasoning & emails.</p>
                                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    Start Test
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <ChatWidget
                systemPrompt="You are the Tech Assistant for college-level students on the Tagore Learning Platform. Help with Big Data, DBMS, Data Warehousing, Data Structures, Theory of Computation, AI & ML, and AIDS (Artificial Intelligence & Data Science). Be technical yet clear."
                accentColor="var(--portal-common-start)"
                title="Tech Assistant"
                icon="fas fa-microchip"
                welcomeMessage="Hello! I can help you understand advanced CS concepts like DBMS, AI/ML, and Theory of Computation."
            />
        </>
    );
}
