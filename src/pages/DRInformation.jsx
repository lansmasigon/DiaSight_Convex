const items = [
  {
    title: "Primary Risks",
    points: [
      "Longer diabetes duration",
      "Poor glycemic control (HbA1c)",
      "Hypertension and dyslipidemia",
      "Renal impairment markers",
    ],
  },
  {
    title: "Screening Focus",
    points: [
      "Routine biomarker monitoring",
      "Frequent checks for high-risk patients",
      "Early referral to ophthalmology",
      "Follow-up with repeat risk scoring",
    ],
  },
  {
    title: "Clinical Goal",
    points: [
      "Detect before symptoms escalate",
      "Prioritize severe-risk pathways",
      "Track progression longitudinally",
      "Standardize screening documentation",
    ],
  },
];

export default function DRInformation() {
  return (
    <div className="container page-fade">
      <div className="hero">
        <h2 style={{ marginTop: 0 }}>Diabetic Retinopathy Clinical Brief</h2>
        <p className="muted">
          DR can be asymptomatic early, making structured risk screening critical for prevention and
          timely intervention.
        </p>
      </div>
      <div className="grid-2" style={{ marginTop: 14 }}>
        {items.map((section) => (
          <div className="card card-strong" key={section.title}>
            <h3 style={{ marginTop: 0 }}>{section.title}</h3>
            <ul className="muted">
              {section.points.map((point) => (
                <li key={point} style={{ marginBottom: 8 }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
