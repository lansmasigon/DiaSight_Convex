import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/AuthContext";
import { Activity, Clock, ShieldCheck, ArrowRight, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { doctor } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Real convex logic retained
  const logs = useQuery(
    api.queries.getAuditLogsForDoctor,
    doctor?.id ? { doctor_id: doctor.id } : "skip"
  );

  const labs = useQuery(
    api.queries.getLabsByDoctorId,
    doctor?.id ? { doctor_id: doctor.id } : "skip"
  );

  const distribution = useQuery(
    api.queries.getRiskDistributionByDoctorId,
    doctor?.id ? { doctor_id: doctor.id } : "skip"
  );

  const risk = distribution || { nodr: 0, mild: 0, severe: 0 };
  const totalRisk = risk.nodr + risk.mild + risk.severe || 1;
  const p1 = (risk.nodr / totalRisk) * 100;
  const p2 = ((risk.nodr + risk.mild) / totalRisk) * 100;

  const paginatedLogs = useMemo(() => {
    if (!logs) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return logs.slice(startIndex, startIndex + itemsPerPage);
  }, [logs, currentPage]);

  const totalPages = logs ? Math.ceil(logs.length / itemsPerPage) : 0;

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-serif">Dashboard</h1>
        <p className="text-secondary font-light">
          Good Morning, Dr. {doctor?.first_name || doctor?.email || 'Santos'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Assessments', value: labs ? labs.length : '...', delta: '' },
          { label: "Today's Assessments", value: labs ? labs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length : '...' },
          { label: 'High Risk Patients', value: risk.severe !== undefined ? risk.severe : '...', delta: '', color: 'text-red-400' },
          { label: 'Low Risk Patients', value: risk.nodr !== undefined ? risk.nodr : '...', delta: '', color: 'text-green-400' },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-secondary text-sm font-mono uppercase tracking-wider">{kpi.label}</span>
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-serif ${kpi.color || 'text-white'}`}>{kpi.value}</span>
              {kpi.delta && <span className="text-accent-blue text-sm font-mono pb-1">{kpi.delta}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Distribution - Centerpiece */}
        <div className="lg:col-span-2 glass-panel p-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6 w-full">
            <h3 className="text-xl font-serif">Risk Distribution</h3>
            
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-secondary text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" /> Low Risk / No DR
                  </span>
                  <span className="text-white font-mono">{risk.nodr !== undefined ? risk.nodr : '...'} Patients</span>
                </div>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-secondary text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" /> Medium / Mild DR
                  </span>
                  <span className="text-white font-mono">{risk.mild !== undefined ? risk.mild : '...'} Patients</span>
                </div>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-secondary text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" /> High / Severe DR
                  </span>
                  <span className="text-white font-mono">{risk.severe !== undefined ? risk.severe : '...'} Patients</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center items-center">
            {/* Modern Donut Chart (CSS) */}
            <div className="relative w-64 h-64">
              <div 
                className="absolute inset-0 rounded-full transition-transform hover:scale-105 duration-500"
                style={{
                  background: `conic-gradient(
                    #22c55e 0 ${p1 || 0}%,
                    #f59e0b ${p1 || 0}% ${p2 || 0}%,
                    #ef4444 ${p2 || 0}% 100%
                  )`
                }}
              />
              <div className="absolute inset-[15%] bg-background rounded-full flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <span className="block text-3xl font-serif">{totalRisk !== 1 ? totalRisk : '...'}</span>
                  <span className="block text-secondary text-xs uppercase tracking-widest mt-1">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Activity Timeline moved here */}
        <div className="glass-panel p-8 flex flex-col gap-6 lg:col-span-1">
          <h3 className="text-xl font-serif">Activity Timeline</h3>
          
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />
            
            {logs?.length === 0 && <span className="text-secondary text-sm italic">No recent activity.</span>}
            
            {logs?.slice(0, 4).map((act, i) => {
              const timeStr = act.created_at ? new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now';
              return (
                <div key={act._id || i} className="flex gap-6 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-background border border-white/20 mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1 pb-6 border-b border-white/5 w-full">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Patient #{act.lab_id ? act.lab_id.slice(0, 4) : 'N/A'}</span>
                      <span className="text-xs font-mono text-secondary">{timeStr}</span>
                    </div>
                    <span className="text-sm text-secondary">Assessment Completed</span>
                    {act.risk_class && <span className={`text-xs mt-1 ${
                      (act.risk_class || '').includes('High') || (act.risk_class || '').includes('Severe') ? 'text-red-400' : 
                      (act.risk_class || '').includes('Medium') || (act.risk_class || '').includes('Mild') ? 'text-amber-400' : 'text-green-400'
                    }`}>{act.risk_class}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Recent Patients spanning full row */}
        <div className="glass-panel p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif">Recent Patients</h3>
            <Link to="/patients" className="text-sm text-accent-blue flex items-center gap-1 hover:text-white transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex flex-col">
            <div className="grid grid-cols-3 text-xs font-mono text-secondary uppercase tracking-wider pb-4 border-b border-white/5">
              <span>Patient</span>
              <span>Risk</span>
              <span>Status</span>
            </div>
            
            {logs?.length === 0 && <span className="text-secondary text-sm italic py-4">No recent patients.</span>}

            {paginatedLogs.map((log, i) => (
              <div key={log._id || i} className="grid grid-cols-3 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors cursor-pointer rounded-lg px-2 -mx-2">
                <span className="font-medium flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <User size={14} className="text-secondary" />
                  </div>
                  Patient #{log.lab_id ? log.lab_id.slice(0, 8) : 'N/A'}
                </span>
                <span className={
                  (log.risk_class || '').includes('High') || (log.risk_class || '').includes('Severe') ? 'text-red-400' : 
                  (log.risk_class || '').includes('Medium') || (log.risk_class || '').includes('Mild') ? 'text-amber-400' : 'text-green-400'
                }>{log.risk_class || 'Pending'}</span>
                <span className="text-sm">Completed</span>
              </div>
            ))}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-2 border-t border-white/5">
                <span className="text-sm text-secondary">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, logs?.length || 0)} of {logs?.length} patients
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                          currentPage === page 
                            ? 'bg-accent-blue text-white' 
                            : 'hover:bg-white/5 text-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
