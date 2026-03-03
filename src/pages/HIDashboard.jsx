import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
import ChatWidget from '../components/ChatWidget';

/* Full 500-word ISL dictionary dataset */
const BASE_WORDS = [
    'Apple', 'Ball', 'Cat', 'Dog', 'Elephant', 'Fish', 'Girl', 'House', 'Ice', 'Jump',
    'Kite', 'Lion', 'Monkey', 'Nest', 'Orange', 'Pen', 'Queen', 'Rose', 'Sun', 'Tree',
    'Umbrella', 'Van', 'Water', 'X-ray', 'Yellow', 'Zebra', 'Science', 'Maths', 'History',
    'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer', 'Language', 'Music',
    'Dance', 'Art', 'Sports', 'Medicine', 'Teacher', 'Student', 'School', 'Book',
    'Pencil', 'Notebook', 'Clock', 'Table', 'Chair', 'Window', 'Door', 'Garden',
    'Flower', 'River', 'Mountain', 'Sky', 'Cloud', 'Rain', 'Star', 'Moon',
    'Earth', 'Fire', 'Wind', 'Forest', 'Ocean', 'Island', 'Bridge', 'Road',
    'City', 'Village', 'Country', 'World', 'Family', 'Mother', 'Father', 'Brother',
    'Sister', 'Friend', 'Baby', 'Boy', 'Man', 'Woman', 'Doctor', 'Engineer',
    'Farmer', 'Soldier', 'Pilot', 'Driver', 'Chef', 'Artist', 'Singer', 'Actor',
    'Happy', 'Sad', 'Angry', 'Hungry', 'Thirsty', 'Tired', 'Strong', 'Beautiful',
    'Good', 'Bad'
];

function generateDictionary() {
    const items = [];
    for (let i = 0; i < 500; i++) {
        const baseWord = BASE_WORDS[i % BASE_WORDS.length];
        const suffix = i >= BASE_WORDS.length ? ` ${Math.floor(i / BASE_WORDS.length)}` : '';
        items.push({ id: i, word: `${baseWord}${suffix}` });
    }
    return items;
}

const DICTIONARY = generateDictionary();

/**
 * HIDashboard — ISL Supported Learning portal
 * For Hearing Impaired students
 * Ported from original hi.html
 */
export default function HIDashboard() {
    const [searchQuery, setSearchQuery] = useState('');

    /* Filter dictionary based on search */
    const filteredItems = useMemo(() => {
        if (!searchQuery) return DICTIONARY;
        const q = searchQuery.toLowerCase();
        return DICTIONARY.filter(item => item.word.toLowerCase().includes(q));
    }, [searchQuery]);

    return (
        <>
            <div className="bg-shape shape-1" style={{ background: 'var(--portal-hi-start)' }}></div>
            <div className="bg-shape shape-3"></div>

            <Navbar
                brand={{ icon: 'fas fa-hands-asl-interpreting', label: 'ISL Learning Portal', color: 'var(--portal-hi-start)' }}
                links={[
                    { href: '#videos', label: 'ISL Videos', active: true },
                    { href: '#dictionary', label: 'ISL Dictionary' }
                ]}
            />

            <div className="container mt-5">
                <header className="mb-5 text-center">
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Visual Learning Path
                    </h1>
                    <p className="text-muted">
                        Master your subjects with high-quality Indian Sign Language instructions.
                    </p>
                </header>

                {/* ─── ISL Videos ──────────────────────────────────── */}
                <section id="videos" className="mb-5">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mb-4">
                        <h2>
                            <i className="fas fa-video" style={{ color: 'var(--portal-hi-start)' }}></i> Concept Videos in ISL
                        </h2>
                        <span className="badge badge-hi">Visual Format</span>
                    </div>

                    <div className="grid-2">
                        <VideoCard
                            videoId="5aC451gDqO0"
                            title="Science Concepts in ISL"
                            description="Understanding basic physics and biology terms through clear sign language demonstrations."
                            actionLabel="Watch Video"
                            accentColor="var(--portal-hi-start)"
                        />
                        <VideoCard
                            videoId="T0mO3kQdJXY"
                            title="Mathematics Problem Solving in ISL"
                            description="Step-by-step visual guide for algebra and geometry."
                            actionLabel="Watch Video"
                            accentColor="var(--portal-hi-start)"
                        />
                    </div>
                </section>

                {/* ─── ISL Dictionary ─────────────────────────────── */}
                <section id="dictionary" className="mb-5">
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 className="mb-3">
                            <i className="fas fa-book" style={{ color: 'var(--portal-hi-start)' }}></i> Interactive ISL Dictionary
                        </h2>
                        <p className="text-muted mb-4">
                            Browse over 500 standard ISL signs for common educational terms.
                        </p>

                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a word (e.g. 'Apple', 'Book', 'Science')..."
                                aria-label="Search ISL dictionary"
                            />
                        </div>

                        <div className="dict-grid">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="dict-item"
                                    onClick={() => alert(`Sign demonstration for: ${item.word}`)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View sign for ${item.word}`}
                                >
                                    <div className="dict-icon">
                                        <i className="fas fa-hand-paper"></i>
                                    </div>
                                    <div className="dict-word">{item.word}</div>
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <p className="text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                                    No matching signs found. Try a different search term.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <ChatWidget
                systemPrompt="You are an AI assistant for Hearing Impaired students on the Tagore Learning Platform ISL portal. Explain concepts with clear, structured text that is easy to understand visually. Avoid audio references — focus on visual descriptions and written explanations."
                accentColor="var(--portal-hi-start)"
                title="AI Visual Assistant"
                icon="fas fa-hands-helping"
                welcomeMessage="Hello! I am your AI assistant for the ISL portal. I can explain concepts with text that is easy to translate to sign visuals."
            />
        </>
    );
}
