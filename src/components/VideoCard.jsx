import React from 'react';

/**
 * Reusable Video Card with embedded YouTube video
 * Props:
 *   - videoId: YouTube video ID
 *   - title: Video title
 *   - description: Short description
 *   - chapters: e.g., "12 Chapters"
 *   - actionLabel: Button text
 *   - onAction: Button click handler
 *   - accentColor: Button/accent color
 */
export default function VideoCard({
    videoId,
    title,
    description,
    chapters,
    actionLabel = 'View Course',
    onAction,
    accentColor = 'var(--primary)'
}) {
    return (
        <div className="glass-panel course-card">
            <div className="video-container">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="course-content">
                <h3 className="course-title">{title}</h3>
                <p className="course-desc">{description}</p>
                <div className="course-footer">
                    {chapters && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {chapters}
                        </span>
                    )}
                    <button
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', background: accentColor }}
                        onClick={onAction}
                    >
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
