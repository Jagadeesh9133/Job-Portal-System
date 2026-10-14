import React, { useState } from 'react';
import api from '../services/api';
import { X, Plus, Building, Sparkles } from 'lucide-react';

const PostJobModal = ({ isOpen, onClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    location: 'Bengaluru, Karnataka',
    jobType: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹10,00,000 - ₹16,00,000 / yr',
    description: '',
    requirementsText: '',
    requiredSkillsText: 'React, Node.js, TypeScript, MongoDB',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.requiredSkillsText) {
      setError('Please fill in Job Title, Description, and Required Skills.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const skills = formData.requiredSkillsText.split(',').map((s) => s.trim()).filter(Boolean);
      const requirements = formData.requirementsText.split('\n').map((s) => s.trim()).filter(Boolean);

      const payload = {
        ...formData,
        requiredSkills: skills,
        requirements,
      };

      const res = await api.post('/jobs', payload);
      if (onJobCreated) onJobCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#67e8f9',
            }}>
              <Building size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Post a New Job Opportunity</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target top candidates with our automated resume skill matching engine.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Senior Full-Stack React & Node.js Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                className="input-field"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select
                className="input-field"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Executive">Lead / Executive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Bengaluru, KA or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. ₹10,00,000 - ₹16,00,000 / yr"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (Comma Separated) *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. React, Node.js, TypeScript, MongoDB, Docker, REST API"
              value={formData.requiredSkillsText}
              onChange={(e) => setFormData({ ...formData, requiredSkillsText: e.target.value })}
              required
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
              💡 These skills are matched directly against candidate resumes.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Describe the role, responsibilities, and team culture..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements (One per line)</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="5+ years experience with React and Node.js&#10;Strong understanding of REST APIs and system design"
              value={formData.requirementsText}
              onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Publishing Job...' : 'Publish Job Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;
