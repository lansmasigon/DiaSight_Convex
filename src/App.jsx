import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewAssessment from "./pages/NewAssessment";
import AuditLogs from "./pages/AuditLogs";
import DRInformation from "./pages/DRInformation";
import DashboardLayout from "./components/dashboard/DashboardLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dr-info" element={<DRInformation />} />
          
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<NewAssessment />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            {/* Future routes could go here like /patients, /settings */}
            <Route path="/patients" element={<div className="p-8">Patients view coming soon</div>} />
            <Route path="/settings" element={<div className="p-8">Settings view coming soon</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
