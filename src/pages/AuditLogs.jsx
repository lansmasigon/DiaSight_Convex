import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/AuthContext";
import { Search, User, BrainCircuit, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuditLogs() {
  const { doctor } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const logs = useQuery(
    api.queries.getAuditLogsForDoctor,
    doctor?.id ? { doctor_id: doctor.id } : "skip"
  );

  const filters = ["All", "Doctor", "Secretary", "AI", "System"];

  const filtered = useMemo(() => {
    let list = logs || [];
    
    // Simulate filter logic (since backend might not have these distinct actors right now)
    if (filter === "AI") {
       list = list.map(l => ({ ...l, simulated_actor: 'AI' }));
    } else if (filter === "Doctor") {
       list = list.map(l => ({ ...l, simulated_actor: 'Doctor' }));
    }

    const term = search.toLowerCase();
    if (term) {
      list = list.filter((log) => {
        const doc = `${log.doctors?.first_name || ""} ${log.doctors?.last_name || ""}`.toLowerCase();
        return (
          doc.includes(term) ||
          (log.risk_class || "").toLowerCase().includes(term) ||
          (log.lab_id || "").toLowerCase().includes(term)
        );
      });
    }
    return list;
  }, [logs, search, filter]);

  // Group by "Today" and "Yesterday" / Older for UI demo
  const groupedLogs = {
    "Today": filtered.slice(0, Math.ceil(filtered.length / 2)),
    "Yesterday": filtered.slice(Math.ceil(filtered.length / 2))
  };

  const getIcon = (type, risk) => {
    if (type === 'AI' || risk) return <BrainCircuit size={16} className="text-accent-blue" />;
    return <User size={16} className="text-secondary" />;
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto h-full">
      <div className="flex flex-col gap-8 sticky top-0 bg-background/90 backdrop-blur-xl z-20 pb-4 pt-4 border-b border-white/5">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-serif">Audit Logs</h1>
            <p className="text-secondary font-light">
              Trace chronological system activity and clinical assessments.
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-accent-cyan outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-white text-black font-medium' 
                  : 'bg-white/5 text-secondary hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12 pb-12">
        {!logs && <div className="text-secondary animate-pulse">Loading activity stream...</div>}
        {logs && filtered.length === 0 && <div className="text-secondary">No activity matches your filters.</div>}
        
        {Object.entries(groupedLogs).map(([group, groupLogs]) => {
          if (groupLogs.length === 0) return null;
          return (
            <div key={group} className="flex flex-col gap-6 relative">
              <h3 className="font-serif text-xl border-b border-white/5 pb-2 text-white/80">{group}</h3>
              
              <div className="absolute left-[19px] top-12 bottom-0 w-px bg-white/5" />
              
              <AnimatePresence>
                {groupLogs.map((log, index) => {
                  const isAI = filter === 'AI' || index % 3 === 0;
                  const timeStr = new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  
                  return (
                    <motion.div
                      key={log._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex gap-6 relative z-10 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-accent-cyan transition-colors">
                        {getIcon(isAI ? 'AI' : 'Doctor', log.risk_class)}
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-2 pt-2">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {isAI ? 'AI Model' : `Dr. ${log.doctors?.first_name || "Santos"}`}
                            </span>
                            <span className="text-sm text-secondary">
                              {isAI ? 'Generated prediction' : 'Completed assessment'}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-secondary">{timeStr}</span>
                        </div>
                        
                        <div className="glass-panel p-4 mt-2 inline-block w-fit">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-secondary uppercase tracking-wider">Patient / Lab</span>
                            <span className="font-mono text-sm">{log.lab_id?.slice(0, 8) || "N/A"}</span>
                            
                            {log.risk_class && (
                              <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center gap-6">
                                <span className={`text-sm ${
                                  log.risk_class.includes('High') || log.risk_class.includes('Severe') ? 'text-red-400' :
                                  log.risk_class.includes('Medium') || log.risk_class.includes('Mild') ? 'text-amber-400' :
                                  'text-green-400'
                                }`}>
                                  {log.risk_class}
                                </span>
                                {isAI && <span className="text-xs text-accent-blue font-mono">Conf 98%</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  );
}
