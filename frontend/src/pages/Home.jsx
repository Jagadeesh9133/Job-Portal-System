import React, { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { Search, MapPin, Sparkles, Briefcase, Zap, ShieldCheck, ArrowRight, Target } from 'lucide-react';

const Home = ({ onSelectJob, onApplyJob, onOpenResumeModal, isAppliedJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (jobType) params.jobType = jobType;
      if (location) params.location = location;

      const res = await api.get('/jobs', { params });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch public jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, jobType, location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Banner */}
      <section style={{
        padding: '4.5rem 0 3.5rem 0',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div className="badge badge-indigo" style={{ padding: '0.4rem 1rem', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
          <Sparkles size={14} color="#818cf8" /> AI-Powered Resume Matching Engine
        </div>

        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, maxWidth: '850px', margin: '0 auto 1.25rem auto' }}>
          Find Opportunities Matched <br />
          To Your <span className="gradient-text">Exact Resume Skills</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 2.25rem auto' }}>
          NexusJobs parses your candidate resume, analyzes tech & soft skill overlaps, and ranks job openings by your personalized fit percentage.
        </p>

        {/* Hero Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="glass-panel"
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.75rem' }}>
            <Search size={18} color="#818cf8" />
            <input
              type="text"
              placeholder="Job title, skills (e.g. React, Python), or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ width: '1px', height: '28px', background: 'var(--border-color)' }} />

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="#06b6d4" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <option value="" style={{ background: '#0f172a' }}>All Locations</option>
              <option value="Remote" style={{ background: '#0f172a' }}>Remote</option>
              <option value="San Francisco" style={{ background: '#0f172a' }}>San Francisco, CA</option>
              <option value="New York" style={{ background: '#0f172a' }}>New York, NY</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Search Jobs
          </button>
        </form>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1000px',
          margin: '3.5rem auto 0 auto',
          textAlign: 'left',
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', marginBottom: '0.75rem' }}>
              <Target size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Algorithmic Resume Match</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Instant match scoring algorithm highlighting matched skills vs missing skills for every job listing.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#67e8f9', marginBottom: '0.75rem' }}>
              <Zap size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Automated Skill Extractor</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Upload your PDF resume or paste raw experience text to auto-populate your skill inventory in seconds.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Employer Candidate Pipeline</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Organizations inspect applicants ranked by resume fit score with direct applicant management.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area: Job Feed & Filters */}
      <section className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>Featured Job Opportunities</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {jobs.length} active positions across top tech companies & design studios.
            </p>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              <option value="">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Data & AI">Data & AI</option>
            </select>

            <select
              className="input-field"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading job opportunities...
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No jobs found matching your criteria</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Try adjusting your search terms or clearing filters.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onSelectJob={onSelectJob}
                onApply={onApplyJob}
                isApplied={isAppliedJob(job._id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
