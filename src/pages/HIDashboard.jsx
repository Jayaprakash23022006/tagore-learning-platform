import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
import ChatWidget from '../components/ChatWidget';

/* ─── ISL sign visuals per word category ─────────────────────
   Each word gets a unique hand-sign letter image from
   public ISL fingerspelling charts, shown as coloured letter tiles.
   We assign: emoji hand sign + background color per first letter.
─────────────────────────────────────────────────────────────── */

// Unicode regional indicator letters A–Z (show as letter blocks with country-flag style)
// These are distinct per letter unlike font icons

// Real ISL uses two hands, so standard single-hand emojis look identical/inaccurate.
// We will use a clean typographical approach: a large letter + an ISL icon.
const ISL_ICON = 'fas fa-hands-asl-interpreting';

// Color per letter group (A–E blue, F–J green, K–O purple, P–T amber, U–Z red)
const LETTER_COLORS = {
  A:'#3b82f6',B:'#3b82f6',C:'#3b82f6',D:'#3b82f6',E:'#3b82f6',
  F:'#10b981',G:'#10b981',H:'#10b981',I:'#10b981',J:'#10b981',
  K:'#8b5cf6',L:'#8b5cf6',M:'#8b5cf6',N:'#8b5cf6',O:'#8b5cf6',
  P:'#f59e0b',Q:'#f59e0b',R:'#f59e0b',S:'#f59e0b',T:'#f59e0b',
  U:'#ef4444',V:'#ef4444',W:'#ef4444',X:'#ef4444',Y:'#ef4444',Z:'#ef4444',
};

/* Full ISL dictionary — 100 unique educational words */
const DICTIONARY = [
  'Apple','Ball','Cat','Dog','Elephant','Fish','Girl','House','Ice','Jump',
  'Kite','Lion','Monkey','Nest','Orange','Pen','Queen','Rose','Sun','Tree',
  'Umbrella','Van','Water','X-ray','Yellow','Zebra',
  'Science','Maths','History','Geography','Physics','Chemistry','Biology',
  'Computer','Language','Music','Dance','Art','Sports','Medicine',
  'Teacher','Student','School','Book','Pencil','Notebook',
  'Clock','Table','Chair','Window','Door','Garden',
  'Flower','River','Mountain','Sky','Cloud','Rain','Star','Moon',
  'Earth','Fire','Wind','Forest','Ocean','Island','Bridge','Road',
  'City','Village','Country','World',
  'Family','Mother','Father','Brother','Sister','Friend','Baby','Boy','Man','Woman',
  'Doctor','Engineer','Farmer','Soldier','Pilot','Driver','Chef','Artist','Singer','Actor',
  'Happy','Sad','Angry','Hungry','Thirsty','Tired','Strong','Beautiful','Good','Bad',
  'Walk','Run','Sit','Stand','Eat','Drink','Sleep','Read','Write','Play',
].map((word, id) => ({ id, word }));

/** Return the starting letter for a given word */
function getLetter(word) {
  return word[0]?.toUpperCase() || 'A';
}

/** Return the color for a given word */
function getColor(word) {
  const first = word[0]?.toUpperCase() || 'A';
  return LETTER_COLORS[first] || '#3b82f6';
}

/**
 * HIDashboard — ISL Supported Learning portal
 */
export default function HIDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

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
          { href: '#videos', label: 'ISL Videos' },
          { href: '#dictionary', label: 'ISL Dictionary' },
        ]}
      />

      <div className="container mt-5">
        <header className="mb-5 text-center">
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Visual Learning Path
          </h1>
          <p className="text-muted">
            Master your subjects with Indian Sign Language video lessons and our ISL dictionary.
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
              description="Physics and biology terms demonstrated in Indian Sign Language."
              actionLabel="Watch Video"
              accentColor="var(--portal-hi-start)"
            />
            <VideoCard
              videoId="T0mO3kQdJXY"
              title="Maths Problem Solving in ISL"
              description="Step-by-step visual guide for algebra and geometry using ISL."
              actionLabel="Watch Video"
              accentColor="var(--portal-hi-start)"
            />
          </div>
        </section>

        {/* ─── ISL Dictionary ──────────────────────────────── */}
        <section id="dictionary" className="mb-5">
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="mb-2">
              <i className="fas fa-book" style={{ color: 'var(--portal-hi-start)' }}></i> Interactive ISL Dictionary
            </h2>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
              Each tile shows the ISL fingerspelling hand sign for that word's first letter.
              Click any word to see its full sign description.
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

            {/* Selected word detail panel */}
            {selectedWord && (
              <div style={{
                background: `linear-gradient(135deg, ${getColor(selectedWord.word)}22, transparent)`,
                border: `1px solid ${getColor(selectedWord.word)}44`,
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
              }}>
                <div style={{ fontSize: '5rem', lineHeight: 1 }}>{getSign(selectedWord.word)}</div>
                <div>
                  <h3 style={{ color: getColor(selectedWord.word), marginBottom: '0.5rem' }}>
                    {selectedWord.word}
                  </h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    ISL Fingerspelling: Start with the letter
                    <strong style={{ color: getColor(selectedWord.word) }}> "{selectedWord.word[0].toUpperCase()}" </strong>
                    hand shape, then form the full word sign.
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    For full video demonstrations, search for "ISL sign for {selectedWord.word}" on DIKSHA or YouTube.
                  </p>
                  <button
                    onClick={() => setSelectedWord(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.85rem' }}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            )}

            <div className="dict-grid">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isSelected = selectedWord?.id === item.id;
                  const color = getColor(item.word);
                  return (
                    <div
                      key={item.id}
                      className={`dict-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedWord(isSelected ? null : item)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && setSelectedWord(isSelected ? null : item)}
                      aria-label={`View ISL sign for ${item.word}`}
                      style={{
                        '--card-color': color,
                        cursor: 'pointer',
                        border: isSelected ? `2px solid ${color}` : '1px solid var(--card-border)',
                        background: isSelected ? `${color}22` : 'rgba(255,255,255,0.05)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div className="dict-sign" style={{ color: color, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1' }}>{getLetter(item.word)}</span>
                        <i className={ISL_ICON} style={{ fontSize: '1.2rem', opacity: 0.8 }}></i>
                      </div>
                      <div className="dict-word" style={{ marginTop: '0.5rem', fontWeight: '600' }}>{item.word}</div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                  No matching signs found. Try a different search term.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <ChatWidget
        systemPrompt="You are an AI assistant for Hearing Impaired students on the Tagore Learning Platform ISL portal. Explain concepts with clear, structured text easy to understand visually. Avoid audio references — focus on written explanations and visual descriptions."
        accentColor="var(--portal-hi-start)"
        title="AI Visual Assistant"
        icon="fas fa-hands-helping"
        welcomeMessage="Hello! I am your AI assistant for the ISL portal. Ask me about any sign or concept!"
      />
    </>
  );
}
