import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container page-fade">
      <div className="hero">
        <h1 style={{ marginTop: 0, marginBottom: 10 }}>Predict DR Risk Before Vision Loss</h1>
        <p className="muted" style={{ maxWidth: 760 }}>
          DiaSight transforms routine laboratory biomarkers into early diabetic retinopathy risk
          signals. This portal gives clinicians rapid risk classification, longitudinal tracking, and
          audit-ready records.
        </p>
        <div className="row" style={{ marginTop: 16 }}>
          <Link to="/login">
            <button>Enter Clinical Dashboard</button>
          </Link>
          <Link to="/dr-info">
            <button className="secondary">Clinical Background</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
