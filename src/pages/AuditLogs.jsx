import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/AuthContext";

function riskClassName(value) {
  const v = (value || "").toLowerCase();
  if (v.includes("no dr")) return "risk-chip risk-ok";
  if (v.includes("mild")) return "risk-chip risk-warn";
  if (v.includes("severe")) return "risk-chip risk-danger";
  return "risk-chip risk-neutral";
}

export default function AuditLogs() {
  const { doctor } = useAuth();
  const [search, setSearch] = useState("");
  const logs = useQuery(
    api.queries.getAuditLogsForDoctor,
    doctor?.id ? { doctor_id: doctor.id } : "skip"
  );

  const filtered = useMemo(() => {
    if (!logs) return [];
    const term = search.toLowerCase();
    return logs.filter((log) => {
      const doc = `${log.doctors?.first_name || ""} ${log.doctors?.last_name || ""}`.toLowerCase();
      return (
        doc.includes(term) ||
        (log.risk_class || "").toLowerCase().includes(term) ||
        (log.lab_id || "").toLowerCase().includes(term)
      );
    });
  }, [logs, search]);

  return (
    <div className="container page-fade">
      <div className="spaced">
        <div>
          <h2 style={{ margin: 0 }}>Audit Logs</h2>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            Trace completed assessments and their corresponding risk classification.
          </p>
        </div>
        <div style={{ minWidth: 280 }}>
          <input
            placeholder="Search doctor, risk, or lab id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 14 }} className="stack">
        {!logs && <div className="card">Loading logs...</div>}
        {logs && filtered.length === 0 && <div className="card">No logs found.</div>}
        {filtered.map((log, index) => (
          <div
            className="card card-strong"
            key={log._id}
            style={{ animation: `enter 0.35s ease both`, animationDelay: `${index * 0.03}s` }}
          >
            <div className="spaced">
              <strong>Lab {log.lab_id?.slice(0, 8) || "N/A"}</strong>
              <span className={riskClassName(log.risk_class)}>{log.risk_class || "Pending"}</span>
            </div>
            <p className="muted" style={{ marginBottom: 4 }}>
              {new Date(log.created_at).toLocaleString()}
            </p>
            <p className="muted" style={{ marginTop: 0 }}>
              Dr. {log.doctors?.first_name || ""} {log.doctors?.last_name || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
