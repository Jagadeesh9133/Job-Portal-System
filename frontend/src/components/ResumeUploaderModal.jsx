import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { X, Upload, Sparkles, Plus, Check, FileText, AlertCircle } from 'lucide-react';

const ResumeUploaderModal = ({ isOpen, onClose, onResumeUpdated }) => {
  const { user, updateProfile, setUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('paste'); // 'upload' or 'paste'
  const [resumeText, setResumeText] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [extractedSkillsPreview, setExtractedSkillsPreview] = useState([]);

  // Sync state whenever user or modal opens
  useEffect(() => {
    if (user) {
      setSkills(user.skills || []);
      setResumeText(user.resumeText || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleTextParse = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/resume/parse-text', { resumeText });
      setExtractedSkillsPreview(res.data.extractedSkills);
      setSkills(res.data.userSkills);
      setMessage(`Success! Extracted ${res.data.extractedSkills.length} key skills from your resume.`);
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          resumeText,
          skills: res.data.userSkills,
        }));
      }
      if (onResumeUpdated) onResumeUpdated();
    } catch (err) {
      setMessage('Failed to parse resume text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeText(res.data.extractedText);
      setExtractedSkillsPreview(res.data.extractedSkills);
      setSkills(res.data.userSkills);
      setMessage(`Successfully uploaded "${uploadedFile.name}" and extracted ${res.data.extractedSkills.length} skills!`);
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          resumeText: res.data.extractedText,
          resumeFileName: uploadedFile.name,
          skills: res.data.userSkills,
        }));
      }
      if (onResumeUpdated) onResumeUpdated();
    } catch (err) {
      console.error('Upload Error:', err);
      setMessage(err.response?.data?.message || 'Error reading file. Try pasting your resume text below.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomSkill = async () => {
    if (!customSkill.trim()) return;
    const trimmed = customSkill.trim();
    if (!skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      try {
        const updatedProfile = await updateProfile({ skills: updated });
        if (updatedProfile && updatedProfile.skills) {
          setSkills(updatedProfile.skills);
        }
        setMessage(`Added skill "${trimmed}"!`);
        if (onResumeUpdated) onResumeUpdated();
      } catch (err) {
        console.error('Failed to add custom skill:', err);
        setMessage('Failed to save skill. Please try again.');
      }
    }
    setCustomSkill('');
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    try {
      const updatedProfile = await updateProfile({ skills: updated });
      if (updatedProfile && updatedProfile.skills) {
        setSkills(updatedProfile.skills);
      }
      if (onResumeUpdated) onResumeUpdated();
    } catch (err) {
      console.error('Failed to remove skill:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Resume & Skill Parser</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Upload or paste your resume to get instant AI job matching.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveSubTab('paste')}
            className="btn"
            style={{
              background: activeSubTab === 'paste' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeSubTab === 'paste' ? '#a5b4fc' : 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <FileText size={15} /> Paste Resume Text
          </button>

          <button
            onClick={() => setActiveSubTab('upload')}
            className="btn"
            style={{
              background: activeSubTab === 'upload' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeSubTab === 'upload' ? '#a5b4fc' : 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <Upload size={15} /> Upload Resume PDF / Doc
          </button>
        </div>

        {message && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: message.includes('Success') || message.includes('uploaded') || message.includes('Added') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${message.includes('Success') || message.includes('uploaded') || message.includes('Added') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: message.includes('Success') || message.includes('uploaded') || message.includes('Added') ? '#34d399' : '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Sparkles size={16} /> {message}
          </div>
        )}

        {/* Tab 1: Paste Text */}
        {activeSubTab === 'paste' && (
          <div className="form-group">
            <label className="form-label">Resume Content / Work Experience</label>
            <textarea
              className="input-field"
              rows={8}
              placeholder="Paste your resume text here (e.g., summary, technical skills, previous work roles, projects)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ fontSize: '0.88rem', fontFamily: 'monospace' }}
            />
            <button
              onClick={handleTextParse}
              disabled={loading || !resumeText.trim()}
              className="btn btn-primary"
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              {loading ? 'Analyzing & Extracting Skills...' : '✨ Parse Skills & Update Match Score'}
            </button>
          </div>
        )}

        {/* Tab 2: Upload File */}
        {activeSubTab === 'upload' && (
          <div style={{
            border: '2px dashed var(--border-highlight)',
            borderRadius: '14px',
            padding: '2.5rem 1rem',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.5)',
            marginBottom: '1rem',
          }}>
            <Upload size={36} color="#818cf8" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Upload Resume File</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Supports PDF, TXT, DOC, DOCX files up to 10MB
            </p>
            <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
              Choose File
              <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            {user?.resumeFileName && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#34d399' }}>
                Current File: {user.resumeFileName}
              </p>
            )}
          </div>
        )}

        {/* Extracted / Active Skills List */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>
              Your Extracted & Saved Skills ({skills.length}):
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {skills.map((skill, idx) => (
              <span key={idx} className="badge badge-emerald" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
                ✓ {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', marginLeft: '6px' }}
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                No skills detected yet. Paste your resume above or add custom skills manually below.
              </p>
            )}
          </div>

          {/* Add Custom Skill Manual Input */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Add skill (e.g. React, Python, Figma, Docker, AWS)..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSkill();
                }
              }}
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            />
            <button type="button" onClick={handleAddCustomSkill} className="btn btn-secondary">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Done Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '120px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploaderModal;
