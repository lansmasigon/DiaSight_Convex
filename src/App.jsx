import { BrowserRouter, Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewAssessment from "./pages/NewAssessment";
import AuditLogs from "./pages/AuditLogs";
import DRInformation from "./pages/DRInformation";

function Nav() {
  const { doctor, logout } = useAuth();
  return (
    <div className="app-nav-wrap">
      <div className="container app-nav">
        <Link to="/" className="brand">
          <span className="brand-dot" />
          <span>DiaSight Convex</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          {doctor && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/assessment"
                className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
              >
                New Assessment
              </NavLink>
              <NavLink
                to="/audit-logs"
                className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
              >
                Audit Logs
              </NavLink>
              <NavLink
                to="/dr-info"
                className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
              >
                DR Info
              </NavLink>
            </>
          )}
        </div>
        {doctor && (
          <div className="row">
            <span className="muted">Dr. {doctor.first_name || doctor.email}</span>
            <button className="secondary" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <NewAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dr-info"
            element={
              <ProtectedRoute>
                <DRInformation />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
