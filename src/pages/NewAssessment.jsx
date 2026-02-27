import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/AuthContext";

const ML_API_URL = import.meta.env.VITE_ML_API_URL;

const groups = [
  {
    title: "Demographics & Vitals",
    fields: ["age", "sex", "duration", "sbp", "dbp", "hbp"],
  },
  {
    title: "Glycemic & Lipid Panel",
    fields: ["hba1c", "ldl", "hdl", "cholesterol", "triglycerides"],
  },
  {
    title: "Renal & Liver Markers",
    fields: ["urea", "bun", "uric", "egfr", "ucr", "alt", "ast"],
  },
];

const fieldConfig = {
  age: { label: "Age", type: "number" },
  sex: { label: "Sex (1 male, 2 female)", type: "select" },
  duration: { label: "Diabetes Duration (years)", type: "number" },
  sbp: { label: "SBP", type: "number" },
  dbp: { label: "DBP", type: "number" },
  hbp: { label: "Hypertension (1 no, 2 yes)", type: "select" },
  hba1c: { label: "HbA1c", type: "number" },
  ldl: { label: "LDL", type: "number" },
  hdl: { label: "HDL", type: "number" },
  cholesterol: { label: "Cholesterol", type: "number" },
  triglycerides: { label: "Triglycerides", type: "number" },
  urea: { label: "Urea", type: "number" },
  bun: { label: "BUN", type: "number" },
  uric: { label: "Uric Acid", type: "number" },
  egfr: { label: "eGFR", type: "number" },
  ucr: { label: "UCR", type: "number" },
  alt: { label: "ALT", type: "number" },
  ast: { label: "AST", type: "number" },
};

const initial = {
  age: "",
  sex: "1",
  duration: "",
  sbp: "",
  dbp: "",
  hbp: "1",
  hba1c: "",
  ldl: "",
  hdl: "",
  cholesterol: "",
  triglycerides: "",
  urea: "",
  bun: "",
  uric: "",
  egfr: "",
  ucr: "",
  alt: "",
  ast: "",
};

export default function NewAssessment() {
  const { doctor } = useAuth();
  const createAssessment = useMutation(api.mutations.createAssessment);
  const classifyRisk = useAction(api.predict.classifyRisk);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [form, setForm] = useState(initial);

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const lab_id = crypto.randomUUID();
      const labData = {
        lab_id,
        age: Number(form.age),
        sex: Number(form.sex),
        duration: Number(form.duration),
        sbp: Number(form.sbp),
        dbp: Number(form.dbp),
        hbp: Number(form.hbp),
        hba1c: Number(form.hba1c),
        ldl: Number(form.ldl),
        hdl: Number(form.hdl),
        cholesterol: Number(form.cholesterol),
        triglycerides: Number(form.triglycerides),
        urea: Number(form.urea),
        bun: Number(form.bun),
        uric: Number(form.uric),
        egfr: Number(form.egfr),
        ucr: Number(form.ucr),
        alt: Number(form.alt),
        ast: Number(form.ast),
      };

      if (!ML_API_URL) throw new Error("Missing VITE_ML_API_URL in environment.");

      const payload = {
        age: labData.age,
        sex: labData.sex,
        sbp: labData.sbp,
        dbp: labData.dbp,
        hbp: labData.hbp,
        duration: labData.duration,
        hb1ac: labData.hba1c,
        ldl: labData.ldl,
        hdl: labData.hdl,
        chol: labData.cholesterol,
        urea: labData.urea,
        bun: labData.bun,
        uric: labData.uric,
        egfr: labData.egfr,
        trig: labData.triglycerides,
        ucr: labData.ucr,
        alt: labData.alt,
        ast: labData.ast,
      };

      let riskClass = "Unknown";
      try {
        const prediction = await classifyRisk({
          endpoint: ML_API_URL,
          payload,
        });
        riskClass = prediction.risk_class || "Unknown";
      } catch (predictionError) {
        console.error("Prediction API unavailable, saving with Unknown risk.", predictionError);
      }

      await createAssessment({
        doctor_id: doctor.id,
        lab_data: labData,
        risk_class: riskClass,
      });

      setResult({ lab_id, riskClass });
    } catch (err) {
      setError(err.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-fade">
      <div className="hero">
        <h2 style={{ marginTop: 0 }}>New Assessment</h2>
        <p className="muted" style={{ marginBottom: 0 }}>
          Enter biomarker values to generate diabetic retinopathy risk classification.
        </p>
      </div>

      {result && (
        <div className="card card-strong" style={{ marginTop: 14, animation: "enter 0.4s ease both" }}>
          <div className="spaced">
            <h3 style={{ margin: 0 }}>Assessment Complete</h3>
            <span
              className={
                result.riskClass.toLowerCase().includes("severe")
                  ? "risk-chip risk-danger"
                  : result.riskClass.toLowerCase().includes("mild")
                  ? "risk-chip risk-warn"
                  : result.riskClass.toLowerCase().includes("no dr")
                  ? "risk-chip risk-ok"
                  : "risk-chip risk-neutral"
              }
            >
              {result.riskClass}
            </span>
          </div>
          <p className="muted">Lab ID: {result.lab_id}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="stack" style={{ marginTop: 14 }}>
        {groups.map((group) => (
          <div key={group.title} className="card card-strong">
            <h3 style={{ marginTop: 0 }}>{group.title}</h3>
            <div className="grid-2">
              {group.fields.map((name) => {
                const cfg = fieldConfig[name];
                return (
                  <div key={name}>
                    <label>{cfg.label}</label>
                    {cfg.type === "select" ? (
                      <select
                        value={form[name]}
                        onChange={(e) => setValue(name, e.target.value)}
                        required
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    ) : (
                      <input
                        value={form[name]}
                        onChange={(e) => setValue(name, e.target.value)}
                        required
                        type="number"
                        step="any"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {error && (
          <div className="card" style={{ borderColor: "rgba(255, 107, 123, 0.6)" }}>
            <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>
          </div>
        )}

        <div className="spaced">
          <button
            className="secondary"
            type="button"
            onClick={() => {
              setForm(initial);
              setError("");
              setResult(null);
            }}
          >
            Reset
          </button>
          <button disabled={submitting}>{submitting ? "Submitting..." : "Submit Assessment"}</button>
        </div>
      </form>
    </div>
  );
}
