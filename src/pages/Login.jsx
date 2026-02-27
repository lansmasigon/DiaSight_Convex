import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const doctor = await convex.query(api.queries.getDoctorByEmail, { email });
      if (!doctor || doctor.password !== password) {
        setError("Invalid credentials");
        return;
      }
      login(doctor);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-fade">
      <div className="grid-2">
        <div className="hero">
          <h2 style={{ marginTop: 0 }}>Secure Clinical Access</h2>
          <p className="muted">
            Access patient risk assessments, trend analytics, and logs in one interface designed for
            day-to-day screening workflows.
          </p>
          <div className="legend" style={{ marginTop: 20 }}>
            <div className="legend-row">
              <span className="legend-tag">
                <span className="dot" style={{ background: "var(--accent)" }} />
                Real-time Convex sync
              </span>
            </div>
            <div className="legend-row">
              <span className="legend-tag">
                <span className="dot" style={{ background: "var(--warn)" }} />
                ML-powered DR stratification
              </span>
            </div>
            <div className="legend-row">
              <span className="legend-tag">
                <span className="dot" style={{ background: "var(--ok)" }} />
                Audit-ready records
              </span>
            </div>
          </div>
        </div>
        <div className="card card-strong">
          <h2 style={{ marginTop: 0 }}>Doctor Login</h2>
          <form onSubmit={handleSubmit} className="stack">
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p style={{ color: "var(--danger)", margin: 0 }} role="alert">
                {error}
              </p>
            )}
            <button disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
