import React from 'react';
import { MapPin, DollarSign, Briefcase, Clock, Building2, ChevronRight, Users, Trash2, Edit } from 'lucide-react';
import { MatchScoreBadge, SkillMatchBreakdown } from './MatchBadge';

const JobCard = ({
  job,
  matchScore,
  matchingSkills,
  missingSkills,
  onSelectJob,
  onApply,
  onEdit,
  onDelete,
  onViewApplicants,
  isOrgView = false,
  isApplied = false,
}) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {/* Logo */}
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Building2 size={24} color="#818cf8" />
            )}
          </div>

          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
              {job.companyName}
            </span>
            <h3
              onClick={() => onSelectJob && onSelectJob(job)}
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                marginTop: '2px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#818cf8')}
              onMouseLeave={(e) => (e.target.style.color = '#fff')}
            >
              {job.title}
            </h3>

            {/* Sub Meta Info */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={14} color="#06b6d4" /> {job.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Briefcase size={14} color="#a5b4fc" /> {job.jobType}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <DollarSign size={14} color="#34d399" /> {job.salaryRange}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Match score or applicant count */}
        {matchScore !== undefined && matchScore !== null && (
          <MatchScoreBadge score={matchScore} />
        )}

        {isOrgView && (
          <div className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
            <Users size={14} /> {job.applicantCount || 0} Applicants
          </div>
        )}
      </div>

      {/* Skill Match Breakdown if available */}
      {(matchingSkills?.length > 0 || missingSkills?.length > 0) && (
        <SkillMatchBreakdown matchingSkills={matchingSkills} missingSkills={missingSkills} />
      )}

      {/* Required Skills Tags */}
      {!matchingSkills && job.requiredSkills && job.requiredSkills.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
          {job.requiredSkills.slice(0, 6).map((skill, idx) => (
            <span key={idx} className="badge badge-indigo">
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 6 && (
            <span className="badge badge-indigo" style={{ opacity: 0.7 }}>
              +{job.requiredSkills.length - 6} more
            </span>
          )}
        </div>
      )}

      {/* Footer / Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Posted {new Date(job.createdAt).toLocaleDateString()} • {job.experienceLevel}
        </span>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {isOrgView ? (
            <>
              <button onClick={() => onViewApplicants(job)} className="btn btn-outline-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                <Users size={14} /> View Applicants ({job.applicantCount || 0})
              </button>
              <button onClick={() => onDelete(job._id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: '#fca5a5' }} title="Delete Job">
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onSelectJob(job)} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
                Details
              </button>
              {isApplied ? (
                <button className="btn btn-success" disabled style={{ opacity: 0.8, padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}>
                  ✓ Applied
                </button>
              ) : (
                <button onClick={() => onApply(job)} className="btn btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}>
                  Apply Now <ChevronRight size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
