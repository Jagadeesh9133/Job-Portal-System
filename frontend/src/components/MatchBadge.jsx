import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const MatchScoreBadge = ({ score }) => {
  if (score === undefined || score === null) return null;

  let className = 'match-high';
  let label = 'Strong Match';

  if (score >= 85) {
    className = 'match-high';
    label = 'Excellent Match';
  } else if (score >= 65) {
    className = 'match-medium';
    label = 'Good Match';
  } else {
    className = 'match-low';
    label = 'Moderate Fit';
  }

  return (
    <div className={`match-score-pill ${className}`}>
      <Sparkles size={15} />
      <span>{score}% Match</span>
      <span style={{ opacity: 0.8, fontSize: '0.75rem', fontWeight: 500 }}>• {label}</span>
    </div>
  );
};

export const SkillMatchBreakdown = ({ matchingSkills = [], missingSkills = [] }) => {
  return (
    <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Matching Skills */}
      {matchingSkills.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <CheckCircle2 size={13} /> Matched Skills ({matchingSkills.length}):
          </span>
          {matchingSkills.map((skill, i) => (
            <span key={i} className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <AlertCircle size={13} /> Recommended to Learn ({missingSkills.length}):
          </span>
          {missingSkills.map((skill, i) => (
            <span key={i} className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
