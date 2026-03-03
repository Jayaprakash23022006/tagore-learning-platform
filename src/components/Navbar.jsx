import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Reusable Navbar for all portal dashboards
 * Props:
 *   - brand: { icon, label, color } - Portal branding
 *   - links: [{ href, label, active? }] - Navigation links
 */
export default function Navbar({ brand, links = [] }) {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" style={{ color: brand?.color || 'var(--primary)' }}>
                <i className={brand?.icon || 'fas fa-graduation-cap'}></i>
                {brand?.label || 'Tagore Learning'}
            </div>
            <div className="nav-links">
                {links.map((link, i) => (
                    <a
                        key={i}
                        href={link.href}
                        className={`nav-link ${link.active ? 'active' : ''}`}
                    >
                        {link.label}
                    </a>
                ))}
                <button
                    onClick={handleLogout}
                    className="nav-link logout-btn"
                    style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
                >
                    <i className="fas fa-sign-out-alt" style={{ marginRight: '0.3rem' }}></i>
                    Exit
                </button>
            </div>
        </nav>
    );
}
