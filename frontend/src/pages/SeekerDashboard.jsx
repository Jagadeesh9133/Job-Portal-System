import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import JobCard from "../components/JobCard";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Sliders,
  Briefcase,
  Plus,
  Search,
} from "lucide-react";

const SeekerDashboard = ({
  onSelectJob,
  onApplyJob,
  onOpenResumeModal,
  isAppliedJob,
  activeSubTab = "feed", // 'feed' or 'applications'
}) => {
  const { user } = useAuth();
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [subTab, setSubTab] = useState(activeSubTab);
  const [search, setSearch] = useState("");

  const fetchMatchedJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/matching/feed", {
        params: { minScore, search },
      });
      setMatchedJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch matched jobs feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/my-applications");
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch my applications:", err);
    }
  };

  useEffect(() => {
    fetchMatchedJobs();
    fetchApplications();
  }, [minScore, user?.skills]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMatchedJobs();
  };

  return (
    <div className="container" style={{ padding: "2rem 1.5rem 4rem 1.5rem" }}>
      {/* Resume Status & Profile Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "1.5rem",
          marginBottom: "2rem",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: 800,
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)",
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
            </div>

            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <h2 style={{ fontSize: "1.4rem" }}>{user?.name}</h2>
                <span className="badge badge-emerald">Candidate</span>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                }}
              >
                {user?.title || "Job Seeker Profile"} •{" "}
                {user?.skills?.length || 0} Registered Skills
              </p>
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <button onClick={onOpenResumeModal} className="btn btn-primary">
              <FileText size={16} /> Update Resume / Skills
            </button>
          </div>
        </div>

        {/* User Skills Pills preview */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              color: "var(--text-dim)",
              fontWeight: 600,
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            YOUR ACTIVE RESUME SKILLS ({user?.skills?.length || 0}):
          </span>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {user?.skills?.map((skill, i) => (
              <span
                key={i}
                className="badge badge-emerald"
                style={{ fontSize: "0.75rem" }}
              >
                ✓ {skill}
              </span>
            ))}
            {(!user?.skills || user.skills.length === 0) && (
              <span style={{ fontSize: "0.82rem", color: "#fbbf24" }}>
                ⚠️ No skills extracted yet. Click "Update Resume" to upload your
                resume and generate AI job recommendations.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => setSubTab("feed")}
            className={`btn ${subTab === "feed" ? "btn-primary" : "btn-secondary"}`}
          >
            <Sparkles size={16} /> AI Matched Jobs Feed ({matchedJobs.length})
          </button>

          <button
            onClick={() => setSubTab("applications")}
            className={`btn ${subTab === "applications" ? "btn-primary" : "btn-secondary"}`}
          >
            <Briefcase size={16} /> My Applications ({applications.length})
          </button>
        </div>

        {/* Match Filter Controls */}
        {subTab === "feed" && (
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Sliders size={14} /> Filter Match Fit:
            </span>
            <select
              className="input-field"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              style={{
                width: "auto",
                padding: "0.4rem 0.85rem",
                fontSize: "0.82rem",
              }}
            >
              <option value={0}>All Job Fits (0%+)</option>
              <option value={60}>Moderate Fits (60%+)</option>
              <option value={75}>Good Matches (75%+)</option>
              <option value={85}>Strongest Matches (85%+)</option>
            </select>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: AI MATCHED JOBS FEED */}
      {subTab === "feed" && (
        <div>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-muted)",
              }}
            >
              Calculating resume match scores...
            </div>
          ) : matchedJobs.length === 0 ? (
            <div
              className="glass-panel"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <Sparkles
                size={40}
                color="#818cf8"
                style={{ marginBottom: "0.75rem" }}
              />
              <h3>No jobs matched your current criteria</h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                Try lowering your match fit filter threshold or add more skills
                to your profile.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.25rem",
              }}
            >
              {matchedJobs.map(
                ({ job, matchScore, matchingSkills, missingSkills }) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    matchScore={matchScore}
                    matchingSkills={matchingSkills}
                    missingSkills={missingSkills}
                    onSelectJob={onSelectJob}
                    onApply={onApplyJob}
                    isApplied={isAppliedJob(job._id)}
                  />
                ),
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MY APPLICATIONS TRACKER */}
      {subTab === "applications" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}
        >
          {applications.length === 0 ? (
            <div
              className="glass-panel"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <Briefcase
                size={40}
                color="#64748b"
                style={{ marginBottom: "0.75rem" }}
              />
              <h3>You haven't applied to any jobs yet</h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                Browse your AI Matched Jobs feed and submit your first
                application!
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="glass-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    {app.job?.companyName || app.organization?.companyName}
                  </span>
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      color: "#fff",
                      marginTop: "2px",
                    }}
                  >
                    {app.job?.title || "Position"}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-dim)",
                      marginTop: "4px",
                    }}
                  >
                    Applied on {new Date(app.createdAt).toLocaleDateString()} •
                    Recorded Resume Match: {app.matchScore}%
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    className={`badge ${
                      app.status === "Shortlisted" || app.status === "Hired"
                        ? "badge-emerald"
                        : app.status === "Rejected"
                          ? "badge-rose"
                          : "badge-indigo"
                    }`}
                    style={{ padding: "0.45rem 0.95rem", fontSize: "0.85rem" }}
                  >
                    Status: {app.status}
                  </div>

                  {app.interviewDateTime && (
                    <div
                      className="badge badge-cyan"
                      style={{
                        padding: "0.45rem 0.95rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      Interview:{" "}
                      {new Date(app.interviewDateTime).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
