import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import JobCard from "../components/JobCard";
import {
  Building,
  PlusCircle,
  Users,
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
} from "lucide-react";
import { MatchScoreBadge, SkillMatchBreakdown } from "../components/MatchBadge";

const OrgDashboard = ({ onOpenPostJobModal }) => {
  const { user } = useAuth();
  const [orgJobs, setOrgJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("pipeline"); // 'pipeline' or 'jobs'
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewDrafts, setInterviewDrafts] = useState({});

  const fetchOrgJobs = async () => {
    try {
      const res = await api.get("/jobs/organization/my-jobs");
      setOrgJobs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch org jobs:", err);
    }
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications/org-applicants");
      setApplicants(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgJobs();
    fetchApplicants();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?"))
      return;
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchOrgJobs();
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  const toDateTimeLocalValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleUpdateStatus = async (
    appId,
    newStatus,
    interviewDateTime = null,
  ) => {
    try {
      const payload = { status: newStatus };
      if (interviewDateTime) {
        payload.interviewDateTime = interviewDateTime;
      }
      await api.put(`/applications/${appId}/status`, payload);
      fetchApplicants();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update applicant status.",
      );
    }
  };

  return (
    <div className="container" style={{ padding: "2rem 1.5rem 4rem 1.5rem" }}>
      {/* Employer Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "1.5rem",
          marginBottom: "2rem",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(8, 145, 178, 0.15) 100%)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
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
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 6px 20px rgba(6, 182, 212, 0.35)",
              }}
            >
              <Building size={28} />
            </div>

            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <h2 style={{ fontSize: "1.4rem" }}>
                  {user?.companyName || user?.name}
                </h2>
                <span className="badge badge-cyan">Organization Portal</span>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                }}
              >
                Manage listings, review candidate match rankings, and evaluate
                applicant resumes.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPostJobModal}
            className="btn btn-primary"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            }}
          >
            <PlusCircle size={18} /> Post New Opportunity
          </button>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              Active Job Listings
            </span>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#fff",
                marginTop: "2px",
              }}
            >
              {orgJobs.length}
            </div>
          </div>

          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              Total Applicants Received
            </span>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#67e8f9",
                marginTop: "2px",
              }}
            >
              {applicants.length}
            </div>
          </div>

          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              High Fit Applicants (&gt;80% Match)
            </span>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#34d399",
                marginTop: "2px",
              }}
            >
              {applicants.filter((a) => a.matchScore >= 80).length}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActiveSubTab("pipeline")}
          className={`btn ${activeSubTab === "pipeline" ? "btn-primary" : "btn-secondary"}`}
          style={{
            background:
              activeSubTab === "pipeline"
                ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                : "",
          }}
        >
          <Users size={16} /> Candidate Pipeline ({applicants.length})
        </button>

        <button
          onClick={() => setActiveSubTab("jobs")}
          className={`btn ${activeSubTab === "jobs" ? "btn-primary" : "btn-secondary"}`}
          style={{
            background:
              activeSubTab === "jobs"
                ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                : "",
          }}
        >
          <Briefcase size={16} /> Active Job Postings ({orgJobs.length})
        </button>
      </div>

      {/* TAB 1: CANDIDATE PIPELINE */}
      {activeSubTab === "pipeline" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.25rem",
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-muted)",
              }}
            >
              Loading candidate pipeline...
            </div>
          ) : applicants.length === 0 ? (
            <div
              className="glass-panel"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <Users
                size={40}
                color="#06b6d4"
                style={{ marginBottom: "0.75rem" }}
              />
              <h3>No candidate applications yet</h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                Post a new job opportunity or share your job listings to start
                receiving applicants.
              </p>
            </div>
          ) : (
            applicants.map((app) => (
              <div
                key={app._id}
                className="glass-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "12px",
                        background: "rgba(6, 182, 212, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#67e8f9",
                        fontWeight: 800,
                        fontSize: "1.2rem",
                      }}
                    >
                      {app.jobSeeker?.name
                        ? app.jobSeeker.name.charAt(0).toUpperCase()
                        : "C"}
                    </div>

                    <div>
                      <h4 style={{ fontSize: "1.15rem", color: "#fff" }}>
                        {app.jobSeeker?.name || "Applicant"}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Applied for{" "}
                        <span style={{ color: "#67e8f9", fontWeight: 600 }}>
                          {app.job?.title || "Job Listing"}
                        </span>{" "}
                        • {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <MatchScoreBadge score={app.matchScore} />

                    {/* Status Select Box */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-dim)",
                        }}
                      >
                        Status:
                      </span>
                      <select
                        className="input-field"
                        value={app.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            app._id,
                            e.target.value,
                            interviewDrafts[app._id] || app.interviewDateTime,
                          )
                        }
                        style={{
                          padding: "0.35rem 0.65rem",
                          fontSize: "0.8rem",
                          width: "auto",
                          borderRadius: "8px",
                        }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">
                          Interview Scheduled
                        </option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <label
                    style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}
                  >
                    Interview slot:
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={
                        interviewDrafts[app._id] ??
                        toDateTimeLocalValue(app.interviewDateTime) ??
                        ""
                      }
                      onChange={(e) =>
                        setInterviewDrafts((prev) => ({
                          ...prev,
                          [app._id]: e.target.value,
                        }))
                      }
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.45rem 0.7rem",
                        width: "auto",
                        minWidth: "220px",
                      }}
                    />
                  </label>

                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      handleUpdateStatus(
                        app._id,
                        "Interview Scheduled",
                        interviewDrafts[app._id] || app.interviewDateTime,
                      )
                    }
                    style={{ padding: "0.5rem 0.8rem", fontSize: "0.78rem" }}
                  >
                    Save Interview Time
                  </button>
                </div>

                {/* Candidate Skill Breakdown */}
                <SkillMatchBreakdown
                  matchingSkills={app.matchingSkills}
                  missingSkills={app.missingSkills}
                />

                {/* Cover Letter or Resume Text Preview */}
                {app.coverLetter && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(15, 23, 42, 0.6)",
                      borderRadius: "8px",
                      borderLeft: "3px solid #06b6d4",
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <strong style={{ color: "#fff" }}>Applicant Note: </strong>{" "}
                    "{app.coverLetter}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE JOB POSTINGS */}
      {activeSubTab === "jobs" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.25rem",
          }}
        >
          {orgJobs.length === 0 ? (
            <div
              className="glass-panel"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <Briefcase
                size={40}
                color="#64748b"
                style={{ marginBottom: "0.75rem" }}
              />
              <h3>No active job listings</h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                Click "Post New Opportunity" above to publish your first job
                listing.
              </p>
            </div>
          ) : (
            orgJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isOrgView={true}
                onDelete={handleDeleteJob}
                onViewApplicants={() => setActiveSubTab("pipeline")}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrgDashboard;
