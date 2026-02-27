import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("doctor");
    if (stored) setDoctor(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (doctorData) => {
    setDoctor(doctorData);
    localStorage.setItem("doctor", JSON.stringify(doctorData));
  };

  const logout = () => {
    setDoctor(null);
    localStorage.removeItem("doctor");
  };

  return (
    <AuthContext.Provider value={{ doctor, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
