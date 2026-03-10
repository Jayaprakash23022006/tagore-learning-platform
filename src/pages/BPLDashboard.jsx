import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/ChatWidget';
/* ─── Data: Videos per class per subject ──────────────────── */
const CLASS_DATA = {
  1: {
    label: 'Class 1',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nAYT2_FpLpk', title: 'Numbers 1–10', desc: 'Learn to count and write numbers.' },
        { id: 'C1RgMUFGDqU', title: 'Simple Addition', desc: 'Adding small numbers with pictures.' },
      ]},
      { name: 'English', icon: 'fas fa-spell-check', color: '#10b981', videos: [
        { id: 'hq3yfQnllfQ', title: 'Alphabet Song A–Z', desc: 'Fun alphabet learning with phonics.' },
        { id: '7S_tz1z_5bA', title: 'Short Words & Sentences', desc: 'Simple sight words for beginners.' },
      ]},
      { name: 'EVS', icon: 'fas fa-leaf', color: '#f59e0b', videos: [
        { id: 'b1t41Q3xRM8', title: 'My Family & Home', desc: 'Learning about family and surroundings.' },
      ]},
    ]
  },
  2: {
    label: 'Class 2',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nAYT2_FpLpk', title: 'Addition & Subtraction', desc: 'Two-digit addition and subtraction.' },
        { id: 'oV7VFBiugKY', title: 'Shapes & Patterns', desc: 'Recognising basic 2D shapes.' },
      ]},
      { name: 'English', icon: 'fas fa-spell-check', color: '#10b981', videos: [
        { id: 'LQFEYSjR5b8', title: 'Reading Short Stories', desc: 'Comprehension through simple stories.' },
        { id: 'VGpnAF9VMCU', title: 'Forming Sentences', desc: 'Subject-verb basics.' },
      ]},
      { name: 'EVS', icon: 'fas fa-leaf', color: '#f59e0b', videos: [
        { id: 'b1t41Q3xRM8', title: 'Plants Around Us', desc: 'Learning about plants and nature.' },
      ]},
    ]
  },
  3: {
    label: 'Class 3',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Multiplication Tables', desc: 'Times tables 2–10 with tricks.' },
        { id: 'oV7VFBiugKY', title: 'Division Basics', desc: 'Introduction to sharing equally.' },
      ]},
      { name: 'English', icon: 'fas fa-spell-check', color: '#10b981', videos: [
        { id: 'LQFEYSjR5b8', title: 'Nouns & Pronouns', desc: 'Identifying parts of speech.' },
      ]},
      { name: 'Science', icon: 'fas fa-flask', color: '#8b5cf6', videos: [
        { id: 'b1t41Q3xRM8', title: 'Animals & Habitats', desc: 'Where animals live and why.' },
      ]},
    ]
  },
  4: {
    label: 'Class 4',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Fractions Introduction', desc: 'Understanding halves, thirds, quarters.' },
        { id: 'oV7VFBiugKY', title: 'Geometry – Angles', desc: 'Types of angles and how to measure.' },
      ]},
      { name: 'English', icon: 'fas fa-spell-check', color: '#10b981', videos: [
        { id: 'LQFEYSjR5b8', title: 'Adjectives & Adverbs', desc: 'Describing words in sentences.' },
      ]},
      { name: 'Science', icon: 'fas fa-flask', color: '#8b5cf6', videos: [
        { id: 'b1t41Q3xRM8', title: 'Food & Nutrition', desc: 'Balanced diet and its importance.' },
      ]},
    ]
  },
  5: {
    label: 'Class 5',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Decimals & Percentages', desc: 'Understanding decimals in daily life.' },
        { id: 'oV7VFBiugKY', title: 'Area & Perimeter', desc: 'Calculating area of rectangles and squares.' },
      ]},
      { name: 'English', icon: 'fas fa-spell-check', color: '#10b981', videos: [
        { id: 'LQFEYSjR5b8', title: 'Tenses – Present & Past', desc: 'Using grammar tenses correctly.' },
      ]},
      { name: 'Science', icon: 'fas fa-flask', color: '#8b5cf6', videos: [
        { id: 'b1t41Q3xRM8', title: 'Solar System', desc: 'Planets, Sun and the universe.' },
      ]},
      { name: 'Social', icon: 'fas fa-globe', color: '#f59e0b', videos: [
        { id: '2_N1d1F6LzI', title: 'Indian States & Capitals', desc: 'Geography of India for class 5.' },
      ]},
    ]
  },
  6: {
    label: 'Class 6',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Integers & Number Line', desc: 'Positive and negative numbers.' },
        { id: 'oV7VFBiugKY', title: 'Ratio & Proportion', desc: 'Understanding ratios in real life.' },
      ]},
      { name: 'Science', icon: 'fas fa-flask', color: '#8b5cf6', videos: [
        { id: 'b1t41Q3xRM8', title: 'Food Chain & Ecosystem', desc: 'How energy flows in nature.' },
        { id: 'b1t41Q3xRM8', title: 'Motion & Measurement', desc: 'Distance, time and motion basics.' },
      ]},
      { name: 'Social', icon: 'fas fa-globe', color: '#f59e0b', videos: [
        { id: '2_N1d1F6LzI', title: 'Ancient Civilisations', desc: 'Indus Valley and early history.' },
      ]},
      { name: 'English', icon: 'fas fa-spell-check', color: '#10b981', videos: [
        { id: 'LQFEYSjR5b8', title: 'Comprehension Skills', desc: 'Reading and answering questions.' },
      ]},
    ]
  },
  7: {
    label: 'Class 7',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Algebra – Expressions', desc: 'Variables, constants and expressions.' },
        { id: 'oV7VFBiugKY', title: 'Lines & Angles', desc: 'Parallel, perpendicular and transversal.' },
      ]},
      { name: 'Science', icon: 'fas fa-flask', color: '#8b5cf6', videos: [
        { id: 'b1t41Q3xRM8', title: 'Nutrition in Plants', desc: 'Photosynthesis and mineral nutrition.' },
        { id: 'b1t41Q3xRM8', title: 'Heat & Temperature', desc: 'Conduction, convection, radiation.' },
      ]},
      { name: 'Social', icon: 'fas fa-globe', color: '#f59e0b', videos: [
        { id: '2_N1d1F6LzI', title: 'Medieval India', desc: 'Mughal Empire and medieval history.' },
      ]},
    ]
  },
  8: {
    label: 'Class 8',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Linear Equations', desc: 'Solving equations in one variable.' },
        { id: 'oV7VFBiugKY', title: 'Mensuration', desc: 'Area and volume of 3D shapes.' },
      ]},
      { name: 'Science', icon: 'fas fa-flask', color: '#8b5cf6', videos: [
        { id: 'b1t41Q3xRM8', title: 'Cell Structure', desc: 'Plant and animal cells explained.' },
        { id: 'b1t41Q3xRM8', title: 'Force & Pressure', desc: 'Pressure in fluids and gases.' },
      ]},
      { name: 'English', icon: 'fas fa-spell-check', color: '#10b981', videos: [
        { id: 'LQFEYSjR5b8', title: 'Essay Writing', desc: 'Paragraphs, structure and style.' },
      ]},
    ]
  },
  9: {
    label: 'Class 9',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Number Systems', desc: 'Real numbers, irrational numbers.' },
        { id: 'oV7VFBiugKY', title: 'Coordinate Geometry', desc: 'Plotting points on the cartesian plane.' },
        { id: 'nZ1mGqH8lGQ', title: 'Polynomials', desc: 'Degree, zeroes and factor theorem.' },
      ]},
      { name: 'Physics', icon: 'fas fa-atom', color: '#ef4444', videos: [
        { id: 'b1t41Q3xRM8', title: 'Motion – Laws', desc: 'Velocity, acceleration and Newton\'s laws.' },
        { id: 'b1t41Q3xRM8', title: 'Gravitation', desc: 'Universal law and free fall.' },
      ]},
      { name: 'Chemistry', icon: 'fas fa-vial', color: '#a78bfa', videos: [
        { id: 'b1t41Q3xRM8', title: 'Matter in Our Surroundings', desc: 'States of matter and changes.' },
      ]},
      { name: 'Biology', icon: 'fas fa-dna', color: '#10b981', videos: [
        { id: 'b1t41Q3xRM8', title: 'Tissues', desc: 'Plant and animal tissues.' },
      ]},
      { name: 'Social', icon: 'fas fa-globe', color: '#f59e0b', videos: [
        { id: '2_N1d1F6LzI', title: 'French Revolution', desc: 'Causes and impact of revolution.' },
      ]},
    ]
  },
  10: {
    label: 'Class 10',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Quadratic Equations', desc: 'Factorisation and quadratic formula.' },
        { id: 'oV7VFBiugKY', title: 'Trigonometry', desc: 'Sin, cos, tan and applications.' },
        { id: 'nZ1mGqH8lGQ', title: 'Surface Area & Volume', desc: 'Cone, sphere and cylinder problems.' },
      ]},
      { name: 'Physics', icon: 'fas fa-atom', color: '#ef4444', videos: [
        { id: 'b1t41Q3xRM8', title: 'Electricity', desc: 'Ohm\'s law, resistance and circuits.' },
        { id: 'b1t41Q3xRM8', title: 'Light – Refraction', desc: 'Lenses, mirrors and ray diagrams.' },
      ]},
      { name: 'Chemistry', icon: 'fas fa-vial', color: '#a78bfa', videos: [
        { id: 'b1t41Q3xRM8', title: 'Acids Bases & Salts', desc: 'pH scale and reactions.' },
        { id: 'b1t41Q3xRM8', title: 'Carbon & Compounds', desc: 'Organic chemistry basics.' },
      ]},
      { name: 'Biology', icon: 'fas fa-dna', color: '#10b981', videos: [
        { id: 'b1t41Q3xRM8', title: 'Life Processes', desc: 'Photosynthesis, respiration, nutrition.' },
        { id: 'b1t41Q3xRM8', title: 'Heredity & Evolution', desc: 'Genes and Mendel\'s laws.' },
      ]},
    ]
  },
  11: {
    label: 'Class 11',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Sets & Relations', desc: 'Set theory, types of sets.' },
        { id: 'oV7VFBiugKY', title: 'Limits & Derivatives', desc: 'Introduction to calculus.' },
      ]},
      { name: 'Physics', icon: 'fas fa-atom', color: '#ef4444', videos: [
        { id: 'b1t41Q3xRM8', title: 'Laws of Motion', desc: 'Newton\'s 3 laws in depth.' },
        { id: 'b1t41Q3xRM8', title: 'Work, Energy & Power', desc: 'Conservation of energy.' },
      ]},
      { name: 'Chemistry', icon: 'fas fa-vial', color: '#a78bfa', videos: [
        { id: 'b1t41Q3xRM8', title: 'Periodic Table & Trends', desc: 'Periodicity, groups and periods.' },
        { id: 'b1t41Q3xRM8', title: 'Chemical Bonding', desc: 'Ionic, covalent and metallic bonds.' },
      ]},
      { name: 'Biology', icon: 'fas fa-dna', color: '#10b981', videos: [
        { id: 'b1t41Q3xRM8', title: 'Cell Biology', desc: 'Cell division, mitosis, meiosis.' },
      ]},
    ]
  },
  12: {
    label: 'Class 12',
    subjects: [
      { name: 'Maths', icon: 'fas fa-calculator', color: '#3b82f6', videos: [
        { id: 'nZ1mGqH8lGQ', title: 'Integration & Applications', desc: 'Definite and indefinite integrals.' },
        { id: 'oV7VFBiugKY', title: 'Matrices & Determinants', desc: 'Operations and solving systems.' },
        { id: 'nZ1mGqH8lGQ', title: 'Probability', desc: 'Bayes theorem and distributions.' },
      ]},
      { name: 'Physics', icon: 'fas fa-atom', color: '#ef4444', videos: [
        { id: 'b1t41Q3xRM8', title: 'Electrostatics', desc: 'Coulomb\'s law, electric field.' },
        { id: 'b1t41Q3xRM8', title: 'Electromagnetic Induction', desc: 'Faraday\'s laws, AC and DC.' },
      ]},
      { name: 'Chemistry', icon: 'fas fa-vial', color: '#a78bfa', videos: [
        { id: 'b1t41Q3xRM8', title: 'Organic – Haloalkanes', desc: 'Reaction mechanisms in organic.' },
        { id: 'b1t41Q3xRM8', title: 'Electrochemistry', desc: 'Galvanic cells and electrolysis.' },
      ]},
      { name: 'Biology', icon: 'fas fa-dna', color: '#10b981', videos: [
        { id: 'b1t41Q3xRM8', title: 'Human Reproduction', desc: 'Reproductive system and development.' },
        { id: 'b1t41Q3xRM8', title: 'Genetics & Biotechnology', desc: 'DNA technology and applications.' },
      ]},
    ]
  },
};
/* ─── Teacher Resources (open-platform links) ──────────────── */
const TEACHER_RESOURCES = [
  {
    class: '1–5 (Primary)',
    icon: 'fas fa-child',
    color: '#3b82f6',
    materials: [
      { name: 'NCERT Class 1–5 Maths Textbooks', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?gemh1=0-14' },
      { name: 'NCERT Class 1–5 EVS Textbooks', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?gesc1=0-13' },
      { name: 'DIKSHA Primary Content Pack', type: 'pdf', url: 'https://diksha.gov.in/' },
    ],
    papers: [
      { name: 'Class 5 Maths Sample Paper (CBSE)', url: 'https://cbseacademic.nic.in/SQP_CLASSV.html' },
      { name: 'Class 5 EVS Sample Paper (CBSE)', url: 'https://cbseacademic.nic.in/SQP_CLASSV.html' },
    ]
  },
  {
    class: '6–8 (Middle)',
    icon: 'fas fa-school',
    color: '#10b981',
    materials: [
      { name: 'NCERT Class 6–8 Maths Textbooks', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?femh1=0-15' },
      { name: 'NCERT Class 6–8 Science Textbooks', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?fesc1=0-18' },
      { name: 'NCERT Class 6–8 Social Science', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?fess1=0-9' },
      { name: 'e-Pathshala Resources (6–8)', type: 'pdf', url: 'https://epathshala.nic.in/' },
    ],
    papers: [
      { name: 'Class 8 Maths Sample Paper (CBSE)', url: 'https://cbseacademic.nic.in/SQP_CLASSVIII.html' },
      { name: 'Class 8 Science Sample Paper (CBSE)', url: 'https://cbseacademic.nic.in/SQP_CLASSVIII.html' },
    ]
  },
  {
    class: '9–10 (Secondary)',
    icon: 'fas fa-graduation-cap',
    color: '#8b5cf6',
    materials: [
      { name: 'NCERT Class 9 Maths Textbook', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?iemh1=0-15' },
      { name: 'NCERT Class 9 Science Textbook', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?iesc1=0-15' },
      { name: 'NCERT Class 10 Maths Textbook', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?jemh1=0-15' },
      { name: 'NCERT Class 10 Science Textbook', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?jesc1=0-16' },
    ],
    papers: [
      { name: 'CBSE Class 10 Maths Previous Year Papers', url: 'https://cbseacademic.nic.in/PreviousYearQuestionPaper_class10.html' },
      { name: 'CBSE Class 10 Science Previous Year Papers', url: 'https://cbseacademic.nic.in/PreviousYearQuestionPaper_class10.html' },
    ]
  },
  {
    class: '11–12 (Senior Secondary)',
    icon: 'fas fa-university',
    color: '#f59e0b',
    materials: [
      { name: 'NCERT Class 11 Physics Textbook', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?keph1=0-9' },
      { name: 'NCERT Class 11 Chemistry Textbook', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?kech1=0-14' },
      { name: 'NCERT Class 12 Maths Textbook', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?lemh1=0-13' },
      { name: 'NCERT Class 12 Biology Textbook', type: 'pdf', url: 'https://ncert.nic.in/textbook.php?lebo1=0-16' },
    ],
    papers: [
      { name: 'CBSE Class 12 Physics Board Papers (2020–2024)', url: 'https://cbseacademic.nic.in/PreviousYearQuestionPaper_class12.html' },
      { name: 'CBSE Class 12 Chemistry Board Papers (2020–2024)', url: 'https://cbseacademic.nic.in/PreviousYearQuestionPaper_class12.html' },
      { name: 'CBSE Class 12 Maths Board Papers (2020–2024)', url: 'https://cbseacademic.nic.in/PreviousYearQuestionPaper_class12.html' },
    ]
  },
];
/**
 * BPLDashboard — Full class-wise content (1st–12th) with Teacher Resources
 */
export default function BPLDashboard() {
  const [selectedClass, setSelectedClass] = useState(9);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'teacher'
  const classData = CLASS_DATA[selectedClass];
  return (
    <>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <Navbar
        brand={{ icon: 'fas fa-book-reader', label: 'Content Access Plus', color: 'var(--portal-bpl-start)' }}
        links={[
          { href: '#', label: 'Content Library', active: activeTab === 'content', onClick: () => setActiveTab('content') },
          { href: '#', label: 'Teacher Resources', active: activeTab === 'teacher', onClick: () => setActiveTab('teacher') },
        ]}
      />
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* ─── Header ─────────────────────────────────────── */}
        <header className="mb-4 text-center">
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>
            {activeTab === 'content' ? 'Content Library' : 'Teacher Resources'}
          </h1>
          <p className="text-muted">
            {activeTab === 'content'
              ? 'Select your class and subject to access curated videos and materials.'
              : 'NCERT textbooks, CBSE sample papers and question papers — all free to download.'}
          </p>
        </header>
        {/* ─── Tab Switcher ────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div className="auth-tabs" style={{ maxWidth: '400px', width: '100%' }}>
            <button className={`auth-tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
              <i className="fas fa-play-circle" style={{ marginRight: '0.5rem' }}></i>Content Library
            </button>
            <button className={`auth-tab ${activeTab === 'teacher' ? 'active' : ''}`} onClick={() => setActiveTab('teacher')}>
              <i className="fas fa-chalkboard-teacher" style={{ marginRight: '0.5rem' }}></i>Teacher Resources
            </button>
          </div>
        </div>
        {/* ═══ CONTENT LIBRARY TAB ════════════════════════ */}
        {activeTab === 'content' && (
          <>
            {/* Class selector pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
              {Object.keys(CLASS_DATA).map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(Number(cls))}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '999px',
                    border: '2px solid',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: selectedClass === Number(cls) ? 'var(--portal-bpl-start)' : 'transparent',
                    borderColor: 'var(--portal-bpl-start)',
                    color: selectedClass === Number(cls) ? 'white' : 'var(--portal-bpl-start)',
                  }}
                >
                  Class {cls}
                </button>
              ))}
            </div>
            {/* Subjects for selected class */}
            <h2 className="mb-4" style={{ textAlign: 'center' }}>
              <span className="badge badge-bpl" style={{ fontSize: '1rem', padding: '0.5rem 1.5rem' }}>
                {classData.label}
              </span>
            </h2>
            {classData.subjects.map((subject, si) => (
              <section key={si} className="mb-5">
                <h3 className="mb-3" style={{ color: subject.color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className={subject.icon}></i> {subject.name}
                </h3>
                <div className="grid-3">
                  {subject.videos.map((video, vi) => (
                    <div key={vi} className="glass-panel" style={{ overflow: 'hidden' }}>
                      <div className="video-container">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={video.title}
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <h4 style={{ marginBottom: '0.4rem' }}>{video.title}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{video.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
        {/* ═══ TEACHER RESOURCES TAB ══════════════════════ */}
        {activeTab === 'teacher' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
            {TEACHER_RESOURCES.map((group, gi) => (
              <div key={gi} className="glass-panel" style={{ padding: '2rem', borderTop: `4px solid ${group.color}` }}>
                <h3 style={{ color: group.color, marginBottom: '1.5rem' }}>
                  <i className={group.icon} style={{ marginRight: '0.5rem' }}></i>
                  {group.class}
                </h3>
                <div className="grid-2">
                  {/* Material PDFs */}
                  <div>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <i className="fas fa-book" style={{ marginRight: '0.4rem' }}></i> Textbooks & Materials
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {group.materials.map((m, mi) => (
                        <li key={mi}>
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              color: group.color,
                              padding: '0.6rem 0.8rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid var(--card-border)',
                              transition: 'background 0.2s',
                              fontSize: '0.9rem',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                          >
                            <i className="fas fa-file-pdf"></i>
                            {m.name}
                            <i className="fas fa-external-link-alt" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.6 }}></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Question Papers */}
                  <div>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <i className="fas fa-scroll" style={{ marginRight: '0.4rem' }}></i> Question Papers & Past Exams
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {group.papers.map((p, pi) => (
                        <li key={pi}>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              color: '#f59e0b',
                              padding: '0.6rem 0.8rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(245,158,11,0.06)',
                              border: '1px solid rgba(245,158,11,0.2)',
                              transition: 'background 0.2s',
                              fontSize: '0.9rem',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(245,158,11,0.12)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(245,158,11,0.06)'}
                          >
                            <i className="fas fa-file-alt"></i>
                            {p.name}
                            <i className="fas fa-download" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            {/* Additional open resources banner */}
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>
                <i className="fas fa-external-link-alt" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                More Open Educational Resources
              </h4>
              <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                Access more free materials from these verified government platforms:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                {[
                  { label: 'NCERT Official', url: 'https://ncert.nic.in' },
                  { label: 'DIKSHA Platform', url: 'https://diksha.gov.in' },
                  { label: 'e-Pathshala', url: 'https://epathshala.nic.in' },
                  { label: 'CBSE Academic', url: 'https://cbseacademic.nic.in' },
                  { label: 'SWAYAM NPTEL', url: 'https://swayam.gov.in' },
                ].map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                  >
                    {r.label} <i className="fas fa-arrow-right" style={{ marginLeft: '0.3rem' }}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <ChatWidget
        systemPrompt="You are an AI Tutor for BPL students on the Tagore Learning Platform. Help with subjects from Class 1 to 12 including Maths, English, Science, Physics, Chemistry, Biology, Social Science, and Tamil. Be encouraging, use simple clear language, and give step-by-step explanations when needed."
        accentColor="var(--portal-bpl-start)"
        title="AI Tutor"
        icon="fas fa-chalkboard-teacher"
        welcomeMessage="Hello! I'm your AI Tutor. Tell me your class and subject, and I'll help you understand any topic!"
      />
    </>
  );
}
