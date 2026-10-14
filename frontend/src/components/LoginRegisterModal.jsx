import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, User, Building, LogIn, UserPlus } from "lucide-react";

const LoginRegisterModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultRole = "job_seeker",
}) => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState(defaultRole);

  React.useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole, isOpen]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          role,
          companyName,
          companyWebsite,
          companyLocation,
        });
      }
      if (onSuccess) onSuccess(role);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "480px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {isLoginMode
                ? "Sign in to access your portal"
                : "Join NexusJobs today"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: "0.4rem" }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            marginBottom: "1.25rem",
            padding: "0.25rem",
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
          }}
        >
          <button
            type="button"
            onClick={() => setRole("job_seeker")}
            className="btn"
            style={{
              background:
                role === "job_seeker"
                  ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                  : "transparent",
              color: role === "job_seeker" ? "#fff" : "var(--text-muted)",
              fontSize: "0.82rem",
              border: "none",
            }}
          >
            <User size={15} /> Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("organization")}
            className="btn"
            style={{
              background:
                role === "organization"
                  ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                  : "transparent",
              color: role === "organization" ? "#fff" : "var(--text-muted)",
              fontSize: "0.82rem",
              border: "none",
            }}
          >
            <Building size={15} /> Employee
          </button>
        </div>

        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 0.9rem",
            borderRadius: "10px",
            background:
              role === "organization"
                ? "rgba(6, 182, 212, 0.08)"
                : "rgba(99, 102, 241, 0.08)",
            border: `1px solid ${role === "organization" ? "rgba(6, 182, 212, 0.25)" : "rgba(99, 102, 241, 0.25)"}`,
            color: "var(--text-muted)",
            fontSize: "0.8rem",
          }}
        >
          {role === "organization"
            ? "Employee portal: post roles, manage applicants, and review candidate pipelines."
            : "Job seeker portal: match with jobs, upload resume, and track applications."}
        </div>

        {error && (
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "10px",
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "#fca5a5",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label className="form-label">Full Name / Display Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder={
                  role === "organization" ? "TCS Admin" : "Rahul Sharma"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {!isLoginMode && role === "organization" && (
            <>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="TCS Digital Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Website</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://company-website.com"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {isLoginMode ? <LogIn size={16} /> : <UserPlus size={16} />}
            {loading
              ? "Processing..."
              : isLoginMode
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.25rem",
            textAlign: "center",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
          }}
        >
          {isLoginMode ? "Don't have an account? " : "Already registered? "}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            style={{
              background: "none",
              border: "none",
              color: "#818cf8",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isLoginMode ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterModal;
