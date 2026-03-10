import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/* ─── Assessment Data ────────────────────────────────────────────── */
const ASSESSMENTS = {
  aptitude: {
    title: 'Aptitude & Reasoning',
    icon: 'fas fa-brain',
    color: '#f59e0b',
    questions: [
      { q: 'If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?', options: ['120 km', '150 km', '180 km', '200 km'], ans: 1 },
      { q: 'What comes next in the sequence: 2, 4, 8, 16, __?', options: ['24', '28', '32', '36'], ans: 2 },
      { q: 'If 5 workers finish a job in 10 days, how many days will 10 workers take?', options: ['20 days', '5 days', '15 days', '2 days'], ans: 1 },
      { q: 'A shopkeeper buys an item for ₹200 and sells it for ₹250. What is the profit?', options: ['₹25', '₹50', '₹75', '₹100'], ans: 1 },
      { q: 'If APPLE is coded as 12213, how is PEN coded?', options: ['132', '312', '123', '231'], ans: 0 },
      { q: 'Find the odd one out: 2, 3, 5, 7, 9, 11', options: ['3', '5', '9', '11'], ans: 2 },
      { q: 'A is B\'s sister. C is B\'s mother. D is C\'s father. How is A related to D?', options: ['Granddaughter', 'Daughter', 'Niece', 'Sister'], ans: 0 },
      { q: 'What is 15% of 200?', options: ['20', '25', '30', '35'], ans: 2 },
      { q: 'Which number is divisible by both 4 and 6?', options: ['14', '20', '24', '28'], ans: 2 },
      { q: 'If today is Monday, what day will it be 100 days from now?', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], ans: 2 },
    ]
  },
  coding: {
    title: 'Coding & Algorithms',
    icon: 'fas fa-code',
    color: '#8b5cf6',
    questions: [
      { q: 'What is the time complexity of Binary Search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'], ans: 2 },
      { q: 'Which data structure uses LIFO (Last In First Out)?', options: ['Queue', 'Stack', 'Array', 'Tree'], ans: 1 },
      { q: 'What is the output of: print(2**3) in Python?', options: ['6', '8', '9', '16'], ans: 1 },
      { q: 'Which sorting algorithm has O(n log n) worst case?', options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Merge Sort'], ans: 3 },
      { q: 'What does SQL SELECT DISTINCT return?', options: ['All rows', 'Only duplicate rows', 'Only unique rows', 'Count of rows'], ans: 2 },
      { q: 'In object-oriented programming, what is encapsulation?', options: ['Inheriting methods', 'Hiding data and methods', 'Overriding functions', 'Multiple inheritance'], ans: 1 },
      { q: 'What is the index of the first element in most programming languages?', options: ['1', '0', '-1', 'Depends on language'], ans: 1 },
      { q: 'Which of these is NOT a type of loop in Python?', options: ['for', 'while', 'repeat', 'All are valid'], ans: 2 },
      { q: 'What does HTML stand for?', options: ['Hyper Text Makeup Language', 'Hyper Text Markup Language', 'High Text Markup Language', 'Hyper Transfer Markup Language'], ans: 1 },
      { q: 'Which is faster for searching in a large sorted array?', options: ['Linear Search', 'Binary Search', 'Both are same', 'Depends on size'], ans: 1 },
    ]
  },
  communication: {
    title: 'Communication Skills',
    icon: 'fas fa-comments',
    color: '#10b981',
    questions: [
      { q: 'Choose the correct sentence:', options: ['She don\'t like apples', 'She doesn\'t likes apples', 'She doesn\'t like apples', 'She not like apples'], ans: 2 },
      { q: 'Which word is a synonym of "eloquent"?', options: ['Silent', 'Articulate', 'Confused', 'Dull'], ans: 1 },
      { q: 'What is the plural of "criterion"?', options: ['Criterions', 'Criterias', 'Criteria', 'Criterion'], ans: 2 },
      { q: 'Which is the correct passive voice of "She is writing a letter"?', options: ['A letter was written by her', 'A letter is being written by her', 'A letter is written by she', 'A letter was being written by her'], ans: 1 },
      { q: 'Choose the correct preposition: "He is good ___ mathematics"', options: ['in', 'at', 'on', 'with'], ans: 1 },
      { q: 'What does the idiom "break a leg" mean?', options: ['Get injured', 'Good luck', 'Work hard', 'Quit'], ans: 1 },
      { q: 'Which sentence uses the correct article?', options: ['She is an university student', 'She is a university student', 'She is the university student', 'She is university student'], ans: 1 },
      { q: '"Despite of his illness, he attended class" — find the error:', options: ['Despite of', 'his illness', 'he attended', 'No error'], ans: 0 },
      { q: 'The word "perspicacious" means:', options: ['Sweaty', 'Having keen insight', 'Very tired', 'Extremely happy'], ans: 1 },
      { q: 'Which is a formal way to start an email?', options: ['Hey there!', 'Sup?', 'Dear Sir/Madam,', 'Yo!'], ans: 2 },
    ]
  }
};

export default function AssessmentPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const quiz = ASSESSMENTS[type];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  if (!quiz) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <h2>Assessment not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/general')}>Go Back</button>
      </div>
    );
  }

  const question = quiz.questions[current];
  const isLast = current === quiz.questions.length - 1;
  const score = answers.filter((a, i) => a === quiz.questions[i].ans).length;

  function handleSelect(idx) {
    if (submitted) return;
    setSelected(idx);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSubmitted(true);

    setTimeout(() => {
      if (isLast) {
        setShowResult(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
        setSubmitted(false);
      }
    }, 1000);
  }

  if (showResult) {
    const percent = Math.round((score / quiz.questions.length) * 100);
    const grade = percent >= 80 ? '🏆 Excellent!' : percent >= 60 ? '👍 Good Job!' : percent >= 40 ? '📚 Keep Practicing' : '💪 Try Again';
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{score >= quiz.questions.length / 2 ? '🎉' : '📖'}</div>
          <h2 style={{ color: quiz.color, marginBottom: '0.5rem' }}>{grade}</h2>
          <h3 style={{ marginBottom: '0.5rem' }}>Your Score</h3>
          <div style={{ fontSize: '4rem', fontWeight: 800, color: quiz.color, margin: '1rem 0' }}>
            {score}/{quiz.questions.length}
          </div>
          <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {percent}% correct
          </div>

          {/* Score bar */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '12px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ width: `${percent}%`, background: quiz.color, height: '100%', borderRadius: '999px', transition: 'width 1s ease' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{ background: quiz.color }}
              onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setSubmitted(false); setShowResult(false); }}>
              <i className="fas fa-redo" style={{ marginRight: '0.5rem' }}></i> Try Again
            </button>
            <button className="btn btn-primary" style={{ background: 'var(--surface-glass)' }}
              onClick={() => navigate('/general')}>
              <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '650px', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: quiz.color }}>
            <i className={quiz.icon} style={{ marginRight: '0.5rem' }}></i>{quiz.title}
          </h2>
          <span className="badge" style={{ background: `${quiz.color}22`, color: quiz.color, border: `1px solid ${quiz.color}44` }}>
            {current + 1} / {quiz.questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '6px', marginBottom: '2rem' }}>
          <div style={{ width: `${((current + 1) / quiz.questions.length) * 100}%`, background: quiz.color, height: '100%', borderRadius: '999px', transition: 'width 0.4s ease' }}></div>
        </div>

        {/* Question */}
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Q{current + 1}. {question.q}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {question.options.map((opt, i) => {
            let bg = 'rgba(255,255,255,0.05)';
            let border = 'var(--card-border)';
            let textColor = 'var(--text-main)';
            if (selected === i) { bg = `${quiz.color}22`; border = quiz.color; }
            if (submitted) {
              if (i === question.ans) { bg = 'rgba(16,185,129,0.2)'; border = '#10b981'; textColor = '#34d399'; }
              else if (selected === i && i !== question.ans) { bg = 'rgba(239,68,68,0.2)'; border = '#ef4444'; textColor = '#fca5a5'; }
            }
            return (
              <div key={i} onClick={() => handleSelect(i)} style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: bg,
                border: `2px solid ${border}`,
                cursor: submitted ? 'default' : 'pointer',
                color: textColor,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: selected === i ? 600 : 400,
              }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {submitted && i === question.ans && <i className="fas fa-check" style={{ marginLeft: 'auto', color: '#10b981' }}></i>}
                {submitted && selected === i && i !== question.ans && <i className="fas fa-times" style={{ marginLeft: 'auto', color: '#ef4444' }}></i>}
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', background: quiz.color }} onClick={handleNext} disabled={selected === null || submitted}>
          {isLast ? 'Submit Test' : 'Next Question'} <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
        </button>
      </div>
    </div>
  );
}
