import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * StaffDashboard — Staff portal for uploading teaching resources
 * Resources uploaded here appear in Teacher Resources sections of all portals
 */
export default function StaffDashboard() {
  const { user, signOut } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'material',       // 'material' or 'question_paper'
    class_group: '1-5',    // '1-5', '6-8', '9-10', '11-12'
    subject: 'Maths',
    url: '',
  });

  const SUBJECTS = ['Maths', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Tamil', 'Social Science', 'Computer Science', 'Other'];
  const CLASS_GROUPS = ['1-5 (Primary)', '6-8 (Middle)', '9-10 (Secondary)', '11-12 (Senior Secondary)'];

  /* ─── Load existing resources ──────────────────────────── */
  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_resources')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      setError('Could not load resources. Make sure the Supabase table is set up (see instructions below).');
    } finally {
      setLoading(false);
    }
  }

  /* ─── Submit new resource ──────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.url.trim()) {
      setError('Title and URL are required.');
      return;
    }

    // Basic URL validation
    try { new URL(form.url); } catch {
      setError('Please enter a valid URL (starting with https://).');
      return;
    }

    setUploading(true);
    try {
      const { error } = await supabase.from('staff_resources').insert([{
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        class_group: form.class_group,
        subject: form.subject,
        url: form.url.trim(),
        uploaded_by: user?.email || 'staff',
      }]);
      if (error) throw error;

      setSuccess(`✅ "${form.title}" uploaded successfully! It will appear in Teacher Resources for all portals.`);
      setForm({ title: '', description: '', type: 'material', class_group: '1-5', subject: 'Maths', url: '' });
      await loadResources();
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  /* ─── Delete resource ──────────────────────────────────── */
  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from('staff_resources').delete().eq('id', id);
    if (!error) {
      setResources(prev => prev.filter(r => r.id !== id));
      setSuccess(`Deleted "${title}"`);
    } else {
      setError(`Delete failed: ${error.message}`);
    }
  }

  return (
    <>
      <div className="bg-shape shape-1" style={{ background: '#0ea5e9' }}></div>
      <div className="bg-shape shape-2"></div>

      <Navbar
        brand={{ icon: 'fas fa-user-tie', label: 'Staff Portal', color: '#0ea5e9' }}
        links={[
          { href: '#upload', label: 'Upload Resource' },
          { href: '#my-resources', label: 'All Resources' },
        ]}
      />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <header className="mb-5 text-center">
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Staff Resource Portal</h1>
          <p className="text-muted">
            Resources you upload are instantly accessible from Teacher Resources in all student portals.
          </p>
          <span style={{ fontSize: '0.85rem', color: '#0ea5e9' }}>
            <i className="fas fa-user-circle" style={{ marginRight: '0.4rem' }}></i>
            Logged in as: {user?.email}
          </span>
        </header>

        {/* ─── Supabase Setup Notice ───────────────────────── */}
        <div className="glass-panel mb-5" style={{ padding: '1.5rem', borderTop: '4px solid #f59e0b' }}>
          <h4 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>
            <i className="fas fa-database" style={{ marginRight: '0.5rem' }}></i>
            One-time Supabase Setup Required
          </h4>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            Run this SQL once in your Supabase dashboard → SQL Editor to create the resources table:
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            overflowX: 'auto',
            color: '#a5f3fc',
            lineHeight: 1.6,
          }}>
{`CREATE TABLE IF NOT EXISTS staff_resources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'material',
  class_group text NOT NULL,
  subject text NOT NULL,
  url text NOT NULL,
  uploaded_by text,
  created_at timestamptz DEFAULT now()
);

-- Allow anyone to read, authenticated staff to write
ALTER TABLE staff_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON staff_resources FOR SELECT USING (true);
CREATE POLICY "auth_insert" ON staff_resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON staff_resources FOR DELETE USING (auth.role() = 'authenticated');`}
          </pre>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
          {/* ─── Upload Form ───────────────────────────── */}
          <section id="upload">
            <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #0ea5e9' }}>
              <h2 className="mb-4">
                <i className="fas fa-upload" style={{ color: '#0ea5e9', marginRight: '0.5rem' }}></i>
                Upload New Resource
              </h2>

              {error && <div className="auth-error">{error}</div>}
              {success && <div className="auth-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Resource Title *</label>
                  <input className="form-control" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Class 10 Physics Notes" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-control" value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of the resource" />
                </div>

                <div className="form-group">
                  <label className="form-label">Resource URL (PDF / Google Drive / etc.) *</label>
                  <input className="form-control" type="url" value={form.url}
                    onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                    placeholder="https://drive.google.com/..." required />
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-control" value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="material">📚 Study Material / Textbook</option>
                      <option value="question_paper">📝 Question Paper / Test</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-control" value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Class Group</label>
                  <select className="form-control" value={form.class_group}
                    onChange={e => setForm(f => ({ ...f, class_group: e.target.value }))}>
                    {CLASS_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#0ea5e9' }} disabled={uploading}>
                  {uploading
                    ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>Uploading...</>
                    : <><i className="fas fa-upload" style={{ marginRight: '0.5rem' }}></i>Upload Resource</>}
                </button>
              </form>
            </div>
          </section>

          {/* ─── All Resources List ─────────────────────── */}
          <section id="my-resources">
            <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #10b981' }}>
              <h2 className="mb-4">
                <i className="fas fa-list" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                All Uploaded Resources ({resources.length})
              </h2>

              {loading && <p className="text-muted text-center">Loading...</p>}

              {!loading && resources.length === 0 && (
                <p className="text-muted text-center" style={{ padding: '2rem' }}>
                  No resources uploaded yet. Use the form to add your first resource!
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
                {resources.map(r => (
                  <div key={r.id} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{r.type === 'question_paper' ? '📝' : '📚'}</span>
                        <strong style={{ fontSize: '0.95rem' }}>{r.title}</strong>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          background: '#0ea5e920',
                          color: '#0ea5e9',
                          border: '1px solid #0ea5e940',
                        }}>
                          {r.class_group}
                        </span>
                      </div>
                      {r.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>{r.description}</p>}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {r.subject} • By {r.uploaded_by} • {new Date(r.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                      <a href={r.url} target="_blank" rel="noreferrer"
                        style={{ background: '#0ea5e9', color: 'white', padding: '0.35rem 0.7rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', textDecoration: 'none' }}>
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                      <button onClick={() => handleDelete(r.id, r.title)}
                        style={{ background: 'var(--error)', color: 'white', border: 'none', padding: '0.35rem 0.7rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
