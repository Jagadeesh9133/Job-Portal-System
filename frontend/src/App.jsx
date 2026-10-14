import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SeekerDashboard from "./pages/SeekerDashboard";
import OrgDashboard from "./pages/OrgDashboard";
import LoginRegisterModal from "./components/LoginRegisterModal";
import ResumeUploaderModal from "./components/ResumeUploaderModal";
import PostJobModal from "./components/PostJobModal";
import JobDetailsModal from "./components/JobDetailsModal";
import api from "./services/api";

const AppContent = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [defaultAuthRole, setDefaultAuthRole] = useState("job_seeker");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobMatchData, setSelectedJobMatchData] = useState(null);

  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Fetch candidate applied jobs on load
  const fetchUserApplications = async () => {
    if (role === "job_seeker") {
      try {
        const res = await api.get("/applications/my-applications");
        const ids = res.data.map((app) => app.job?._id || app.job);
        setAppliedJobIds(ids);
      } catch (err) {
        console.error("Failed to fetch user applications:", err);
      }
    }
  };

  useEffect(() => {
    fetchUserApplications();
  }, [user, role]);

  const openAuth = (selectedRole = "job_seeker") => {
    setDefaultAuthRole(selectedRole);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (selectedRole) => {
    const targetTab =
      selectedRole === "organization" ? "org_dashboard" : "seeker_feed";
    setActiveTab(targetTab);
    fetchUserApplications();
  };

  const handleSelectJob = async (job) => {
    setSelectedJob(job);
    if (role === "job_seeker" && user) {
      try {
        const res = await api.post(`/matching/evaluate/${job._id}`, {
          skills: user.skills || [],
          resumeText: user.resumeText || "",
        });
        setSelectedJobMatchData(res.data);
      } catch (err) {
        setSelectedJobMatchData(null);
      }
    } else {
      setSelectedJobMatchData(null);
    }
  };

  const handleApplyJob = (job) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (role !== "job_seeker") {
      alert("Please log in as a Job Seeker to apply for jobs.");
      return;
    }
    handleSelectJob(job);
  };

  const handleJobAppliedSuccess = (jobId) => {
    setAppliedJobIds((prev) => [...prev, jobId]);
    fetchUserApplications();
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={openAuth}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        onOpenPostJobModal={() => setIsPostJobModalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {activeTab === "home" && (
          <Home
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
            isAppliedJob={(jobId) => appliedJobIds.includes(jobId)}
          />
        )}

        {activeTab === "seeker_feed" && (
          <SeekerDashboard
            activeSubTab="feed"
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
            isAppliedJob={(jobId) => appliedJobIds.includes(jobId)}
          />
        )}

        {activeTab === "my_applications" && (
          <SeekerDashboard
            activeSubTab="applications"
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
            isAppliedJob={(jobId) => appliedJobIds.includes(jobId)}
          />
        )}

        {activeTab === "org_dashboard" && (
          <OrgDashboard
            onOpenPostJobModal={() => setIsPostJobModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          background: "rgba(9, 13, 22, 0.95)",
          padding: "2rem 0",
          color: "var(--text-dim)",
          fontSize: "0.85rem",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            © 2026 NexusJobs. AI Resume Matching Platform. Built with React &
            Express + MongoDB.
          </div>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab("home")}
            >
              Explore
            </span>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setIsAuthOpen(true)}
            >
              Employer Portal
            </span>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setIsAuthOpen(true)}
            >
              Job Seeker Sign In
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginRegisterModal
        isOpen={isAuthOpen}
        defaultRole={defaultAuthRole}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <ResumeUploaderModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onResumeUpdated={() => {
          if (activeTab === "seeker_feed") {
            // refresh
          }
        }}
      />

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onJobCreated={() => {
          if (activeTab === "home") {
            window.location.reload();
          }
        }}
      />

      <JobDetailsModal
        job={selectedJob}
        matchData={selectedJobMatchData}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onApplied={handleJobAppliedSuccess}
        isApplied={
          selectedJob ? appliedJobIds.includes(selectedJob._id) : false
        }
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
