import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/AuthContext";

function buildMonthlyCounts(labs) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("default", { month: "short" }),
      count: 0,
    });
  }
  const map = new Map(buckets.map((b) => [b.key, b]));
  (labs || []).forEach((lab) => {
    const d = new Date(lab.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = map.get(key);
    if (bucket) bucket.count += 1;
  });
  return buckets;
}

export default function Dashboard() {
  const { doctor } = useAuth();
  const labs = useQuery(
    api.queries.getLabsByDoctorId,
    doctor?.id ? { doctor_id: doctor.id } : "skip"
  );
  const distribution = useQuery(
    api.queries.getRiskDistributionByDoctorId,
    doctor?.id ? { doctor_id: doctor.id } : "skip"
  );

  const todayLabs = useMemo(() => {
    if (!labs) return 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return labs.filter((x) => x.created_at >= d.getTime()).length;
  }, [labs]);

  const monthly = useMemo(() => buildMonthlyCounts(labs), [labs]);
  const maxCount = Math.max(...monthly.map((m) => m.count), 1);

  const risk = distribution || { nodr: 0, mild: 0, severe: 0 };
  const totalRisk = risk.nodr + risk.mild + risk.severe;
  const p1 = totalRisk ? (risk.nodr / totalRisk) * 100 : 34;
  const p2 = totalRisk ? ((risk.nodr + risk.mild) / totalRisk) * 100 : 67;

  return (
    <div className="container page-fade">
      <div className="hero">
        <h2 style={{ marginTop: 0 }}>Clinical Intelligence Dashboard</h2>
        <p className="muted" style={{ marginBottom: 0 }}>
          Welcome back, Dr. {doctor?.first_name || doctor?.email}. This view tracks your assessment
          activity and current DR risk trend.
        </p>
      </div>

      <div className="kpi-grid" style={{ marginTop: 14 }}>
        <div className="kpi">
          <h4>Total Assessments</h4>
          <p>{labs ? labs.length : "..."}</p>
        </div>
        <div className="kpi">
          <h4>Today</h4>
          <p>{labs ? todayLabs : "..."}</p>
        </div>
        <div className="kpi">
          <h4>Severe Cases</h4>
          <p>{distribution ? risk.severe : "..."}</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card card-strong">
          <div className="spaced">
            <h3 style={{ margin: 0 }}>Assessments (Last 6 Months)</h3>
            <Link to="/assessment">
              <button>New Assessment</button>
            </Link>
          </div>
          <div className="bar-chart">
            {monthly.map((m) => (
              <div className="bar-col" key={m.key}>
                <div
                  className="bar"
                  style={{
                    height: `${Math.max((m.count / maxCount) * 170, m.count ? 10 : 3)}px`,
                    animationDelay: `${0.06 * monthly.indexOf(m)}s`,
                  }}
                />
                <div className="bar-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-strong">
          <h3 style={{ marginTop: 0 }}>Risk Distribution</h3>
          <div className="donut" style={{ "--p1": p1, "--p2": p2 }} />
          <div className="legend">
            <div className="legend-row">
              <span className="legend-tag">
                <span className="dot" style={{ background: "var(--ok)" }} />
                No DR
              </span>
              <strong>{risk.nodr}</strong>
            </div>
            <div className="legend-row">
              <span className="legend-tag">
                <span className="dot" style={{ background: "var(--warn)" }} />
                Mild DR
              </span>
              <strong>{risk.mild}</strong>
            </div>
            <div className="legend-row">
              <span className="legend-tag">
                <span className="dot" style={{ background: "var(--danger)" }} />
                Severe DR
              </span>
              <strong>{risk.severe}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
