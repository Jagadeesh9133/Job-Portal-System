import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { X, MapPin, DollarSign, Briefcase, Building2, CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';
import { MatchScoreBadge, SkillMatchBreakdown } from './MatchBadge';

const JobDetailsModal = ({ job, matchData, isOpen, onClose, onApplied, isApplied = false }) => {
  const { user, role } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !job) return null;

  const handleApply = async () => {
    if (role !== 'job_seeker') {
      setMessage('Please log in as a Job Seeker to apply.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.post('/applications/apply', {
        jobId: job._id,
        coverLetter,
      });
      setMessage('🎉 Application submitted successfully!');
      if (onApplied) onApplied(job._id);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Building2 size={28} color="#818cf8" />
              )}
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{job.companyName}</span>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '2px' }}>{job.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Metadata Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem',
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Location</span>
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
              <MapPin size={14} color="#06b6d4" /> {job.location}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Job Type</span>
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
              <Briefcase size={14} color="#a5b4fc" /> {job.jobType}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Salary</span>
            <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
              <DollarSign size={14} /> {job.salaryRange}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Experience</span>
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginTop: '2px', display: 'block' }}>
              {job.experienceLevel}
            </span>
          </div>
        </div>

        {/* AI Resume Match Section */}
        {matchData && (
          <div style={{
            padding: '1.1rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '1.25rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="#818cf8" /> Resume Match Score Analysis
              </span>
              <MatchScoreBadge score={matchData.matchScore} />
            </div>

            <SkillMatchBreakdown
              matchingSkills={matchData.matchingSkills}
              missingSkills={matchData.missingSkills}
            />
          </div>
        )}

        {/* Description */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Job Overview</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Key Requirements</h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {job.requirements.map((req, idx) => (
                <li key={idx} style={{ marginBottom: '0.35rem' }}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Perks & Benefits</h4>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {job.benefits.map((b, idx) => (
                <span key={idx} className="badge badge-indigo">
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Form or Status */}
        {role === 'job_seeker' && (
          <div style={{
            padding: '1.25rem',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
          }}>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem' }}>
              Submit Application
            </h4>

            {message && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: message.includes('submitted') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: message.includes('submitted') ? '#34d399' : '#fca5a5',
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
              }}>
                {message}
              </div>
            )}

            {isApplied ? (
              <div style={{ textAlign: 'center', padding: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                ✓ You have already applied for this job listing.
              </div>
            ) : (
              <>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Optional note or short cover letter for the hiring manager..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}
                />
                <button
                  onClick={handleApply}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Send size={16} />
                  {loading ? 'Submitting Application...' : 'Submit Application With My Saved Resume'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
