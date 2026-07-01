import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Database } from "lucide-react";

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
    <div className="relative min-h-screen w-full bg-[#030303] flex items-center overflow-hidden">
      
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center relative z-10 py-12 lg:py-0">
        
        {/* Left Side: Massive Typography */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 max-w-xl"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif leading-[0.9] tracking-tight text-white">
            DiaSight <br /> Portal
          </h1>
          

          <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center gap-3 text-sm text-secondary">
              <Activity className="text-accent-cyan" size={16} /> ML-powered DR stratification
            </div>
            <div className="flex items-center gap-3 text-sm text-secondary">
              <Database className="text-accent-blue" size={16} /> Real-time clinical synchronization
            </div>
            <div className="flex items-center gap-3 text-sm text-secondary">
              <ShieldCheck className="text-[#8ef6b4]" size={16} /> Encrypted audit-ready records
            </div>
          </div>
          
          <button onClick={() => navigate('/')} className="mt-8 text-sm font-mono text-white flex items-center gap-2 hover:text-accent-cyan transition-colors w-fit group">
            Learn more about the platform <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Right Side: Minimalist Login Form with Behind-the-card Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-[480px] mx-auto lg:ml-auto relative"
        >
          {/* Defined Grainy Circles behind the card */}
          <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none translate-y-12 lg:translate-x-12">
            {/* Main Blue Circle */}
            <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden blur-[10px] bg-[#0A1AFF]/80 mix-blend-screen translate-x-10 md:translate-x-20">
               <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>
            
            {/* Secondary Cyan Circle */}
            <div className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden blur-[10px] bg-[#00E5FF]/70 mix-blend-screen -translate-x-12 md:-translate-x-24 -translate-y-12 md:-translate-y-24">
               <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 md:p-12 shadow-2xl relative z-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/90 px-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@clinic.com"
                  required
                  className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/90 px-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 px-1 mt-2">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-[#141414] accent-accent-cyan" id="terms" required />
                <label htmlFor="terms" className="text-xs text-secondary">
                  I agree to the <span className="text-white hover:underline cursor-pointer">Terms of Service</span> and <span className="text-white hover:underline cursor-pointer">Privacy Policy</span>.
                </label>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm px-1" role="alert">
                  {error}
                </motion.p>
              )}

              <button 
                disabled={loading}
                className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white rounded-xl py-4 font-medium transition-colors border border-white/5"
              >
                {loading ? "Authenticating..." : "Access Dashboard"}
              </button>

            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
