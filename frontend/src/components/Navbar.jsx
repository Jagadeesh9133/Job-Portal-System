import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase,
  FileText,
  PlusCircle,
  LogIn,
  LogOut,
  User,
  Building,
  Sparkles,
} from "lucide-react";

const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenResumeModal,
  onOpenPostJobModal,
}) => {
  const { user, role, logout } = useAuth();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(9, 13, 22, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "74px",
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
            }}
          >
            <Briefcase size={22} />
          </div>
          <div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "800",
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              Nexus<span className="gradient-text">Jobs</span>
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                color: "var(--text-dim)",
                display: "block",
                marginTop: "-4px",
              }}
            >
              AI Resume-Based Job Portal
            </span>
          </div>
        </div>

        {/* Center Nav Items */}
        <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={() => setActiveTab("home")}
            className={`btn ${activeTab === "home" ? "btn-secondary" : ""}`}
            style={{
              background:
                activeTab === "home" ? "rgba(255,255,255,0.08)" : "transparent",
              color: activeTab === "home" ? "#fff" : "var(--text-muted)",
              border: "none",
            }}
          >
            Explore Jobs
          </button>

          {role === "job_seeker" && (
            <>
              <button
                onClick={() => setActiveTab("seeker_feed")}
                className="btn"
                style={{
                  background:
                    activeTab === "seeker_feed"
                      ? "rgba(99, 102, 241, 0.18)"
                      : "transparent",
                  color:
                    activeTab === "seeker_feed"
                      ? "#a5b4fc"
                      : "var(--text-muted)",
                  border:
                    activeTab === "seeker_feed"
                      ? "1px solid rgba(99,102,241,0.3)"
                      : "none",
                }}
              >
                <Sparkles size={16} color="#818cf8" />
                Matched For You
              </button>

              <button
                onClick={() => setActiveTab("my_applications")}
                className="btn"
                style={{
                  background:
                    activeTab === "my_applications"
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                  color:
                    activeTab === "my_applications"
                      ? "#fff"
                      : "var(--text-muted)",
                  border: "none",
                }}
              >
                My Applications
              </button>
            </>
          )}

          {role === "organization" && (
            <button
              onClick={() => setActiveTab("org_dashboard")}
              className="btn"
              style={{
                background:
                  activeTab === "org_dashboard"
                    ? "rgba(6, 182, 212, 0.18)"
                    : "transparent",
                color:
                  activeTab === "org_dashboard"
                    ? "#67e8f9"
                    : "var(--text-muted)",
                border:
                  activeTab === "org_dashboard"
                    ? "1px solid rgba(6,182,212,0.3)"
                    : "none",
              }}
            >
              <Building size={16} color="#06b6d4" />
              Org Dashboard
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user ? (
            <>
              {role === "job_seeker" && (
                <button
                  onClick={onOpenResumeModal}
                  className="btn btn-outline-primary"
                >
                  <FileText size={16} />
                  Resume & Skills
                </button>
              )}

              {role === "organization" && (
                <button
                  onClick={onOpenPostJobModal}
                  className="btn btn-primary"
                >
                  <PlusCircle size={16} />
                  Post a Job
                </button>
              )}

              {/* User Dropdown / Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.04)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "30px",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background:
                      role === "organization"
                        ? "var(--accent-cyan)"
                        : "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                  }}
                >
                  {role === "organization" ? (
                    <Building size={14} />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#fff",
                      lineHeight: 1.1,
                    }}
                  >
                    {user.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: role === "organization" ? "#67e8f9" : "#a5b4fc",
                      textTransform: "capitalize",
                    }}
                  >
                    {role === "organization" ? "Organization" : "Job Seeker"}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 0.75rem" }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => onOpenAuth("organization")}
                className="btn btn-secondary"
                style={{ borderColor: "rgba(6, 182, 212, 0.35)" }}
              >
                <Building size={16} />
                Employee Login
              </button>
              <button
                onClick={() => onOpenAuth("job_seeker")}
                className="btn btn-primary"
              >
                <LogIn size={16} />
                Job Seeker Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
