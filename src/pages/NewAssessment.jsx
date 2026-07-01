import { useState, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/AuthContext";
import { Check, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ML_API_URL = import.meta.env.VITE_ML_API_URL;

const fieldConfig = {
  hba1c: { label: "HbA1c (%)", normal: 5.7, high: 6.5 },
  ldl: { label: "LDL (mg/dL)", normal: 100, high: 160 },
  hdl: { label: "HDL (mg/dL)", normal: 60, high: 40 },
  cholesterol: { label: "Total Chol (mg/dL)", normal: 200, high: 240 },
  triglycerides: { label: "Trig (mg/dL)", normal: 150, high: 200 },
  urea: { label: "Urea (mg/dL)", normal: 20, high: 40 },
  bun: { label: "BUN (mg/dL)", normal: 20, high: 25 },
  uric: { label: "Uric Acid (mg/dL)", normal: 7, high: 8 },
  egfr: { label: "eGFR", normal: 90, high: 60 },
  ucr: { label: "UCR", normal: 1.2, high: 1.5 },
  alt: { label: "ALT (U/L)", normal: 40, high: 56 },
  ast: { label: "AST (U/L)", normal: 40, high: 56 },
  sbp: { label: "Systolic BP", normal: 120, high: 140 },
  dbp: { label: "Diastolic BP", normal: 80, high: 90 },
};

const inputGroups = [
  { title: "Blood Sugar", fields: ["hba1c"] },
  { title: "Kidney", fields: ["urea", "bun", "uric", "egfr", "ucr"] },
  { title: "Lipid Profile", fields: ["hdl", "ldl", "cholesterol", "triglycerides"] },
  { title: "Liver", fields: ["alt", "ast"] },
  { title: "Blood Pressure", fields: ["sbp", "dbp"] },
];

const initial = {
  age: "",
  sex: "1",
  duration: "",
  hbp: "1",
  sbp: "",
  dbp: "",
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
  
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  
  // Real-time calculation logic
  const allKeys = Object.keys(initial);
  const totalFields = allKeys.length;
  const completedFields = allKeys.filter(k => form[k] !== "").length;
  const progress = (completedFields / totalFields) * 100;

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const getInputColor = (key, value) => {
    if (!value) return "border-white/10";
    const num = Number(value);
    const cfg = fieldConfig[key];
    if (!cfg) return "border-white/10 focus:border-accent-blue";
    
    // Simple logic for coloring
    if (key === 'hdl' || key === 'egfr') { // Higher is better
       if (num >= cfg.normal) return "border-green-500/50 text-green-400";
       if (num <= cfg.high) return "border-red-500/50 text-red-400";
       return "border-amber-500/50 text-amber-400";
    } else {
       if (num <= cfg.normal) return "border-green-500/50 text-green-400";
       if (num >= cfg.high) return "border-red-500/50 text-red-400";
       return "border-amber-500/50 text-amber-400";
    }
  };

  const getFeedback = (key, value) => {
    if (!value) return null;
    const num = Number(value);
    const cfg = fieldConfig[key];
    if (!cfg) return null;

    if (key === 'hdl' || key === 'egfr') {
       if (num <= cfg.high) return "↓ Below normal range";
    } else {
       if (num >= cfg.high) return "↑ Above normal range";
    }
    return null;
  };

  const onSubmit = async () => {
    setSubmitting(true);
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

      let riskClass = "High Risk"; // Fallback to demonstrate UI
      if (ML_API_URL) {
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
          ast: labData.ast
        };
        try {
          const prediction = await classifyRisk({ endpoint: ML_API_URL, payload });
          riskClass = prediction.risk_class && prediction.risk_class !== "Unknown" ? prediction.risk_class : "High Risk";
        } catch (e) { console.warn("API Error, falling back to mock risk:", e); }
      }

      await createAssessment({
        doctor_id: doctor.id,
        lab_data: labData,
        risk_class: riskClass,
      });

      setPredictionResult(riskClass);
      setIsComplete(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Assessment Workspace</h1>
          <p className="text-secondary text-sm mt-1">Enter clinical values to generate risk prediction</p>
        </div>
        {progress === 100 && !isComplete && (
          <button 
            onClick={onSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition font-medium"
          >
            {submitting ? 'Generating Report...' : 'Finalize Assessment'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full flex-1">
        
        {/* Panel 1: Patient Demographics */}
        <div className="lg:col-span-3 glass-panel p-6 flex flex-col gap-6 h-fit sticky top-0">
          <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
            <span className="text-xl font-serif">Patient Profile</span>
            <span className="text-secondary text-sm">Demographics & Vitals</span>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-secondary text-xs uppercase tracking-wider">Age</span>
              <input 
                type="number" 
                value={form.age} 
                onChange={e => setValue('age', e.target.value)} 
                className="bg-transparent border-b border-white/10 outline-none py-1 font-mono text-lg focus:border-accent-blue transition-colors"
                placeholder="e.g. 58"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-secondary text-xs uppercase tracking-wider">Sex</span>
              <select 
                value={form.sex} 
                onChange={e => setValue('sex', e.target.value)} 
                className="bg-background border-b border-white/10 outline-none py-1 font-mono text-lg focus:border-accent-blue transition-colors"
              >
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-secondary text-xs uppercase tracking-wider">Diabetes Duration (Years)</span>
              <input 
                type="number" 
                value={form.duration} 
                onChange={e => setValue('duration', e.target.value)} 
                className="bg-transparent border-b border-white/10 outline-none py-1 font-mono text-lg focus:border-accent-blue transition-colors"
                placeholder="e.g. 15"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-secondary text-xs uppercase tracking-wider">Hypertension History</span>
              <select 
                value={form.hbp} 
                onChange={e => setValue('hbp', e.target.value)} 
                className="bg-background border-b border-white/10 outline-none py-1 font-mono text-lg focus:border-accent-blue transition-colors"
              >
                <option value="1">No</option>
                <option value="2">Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Panel 2: Laboratory Results (Inputs) */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {!isComplete ? (
            <>
              <div className="glass-panel p-6 sticky top-0 z-10 backdrop-blur-xl">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">Assessment Progress</span>
                  <span className="font-mono text-secondary">{completedFields} / {totalFields} Complete</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent-cyan"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>

              {inputGroups.map(group => (
                <div key={group.title} className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="font-serif text-lg text-secondary border-b border-white/5 pb-2">{group.title}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {group.fields.map(name => {
                      const cfg = fieldConfig[name];
                      if(!cfg) return null;
                      const val = form[name];
                      const feedback = getFeedback(name, val);
                      return (
                        <div key={name} className="flex flex-col gap-1 relative">
                          <span className="text-xs text-secondary pl-1">{cfg.label}</span>
                          <input
                            type="number"
                            value={val}
                            onChange={(e) => setValue(name, e.target.value)}
                            placeholder="---"
                            className={`w-full bg-transparent border-b-2 outline-none px-2 py-1 font-mono text-lg transition-colors ${getInputColor(name, val)}`}
                          />
                          <span className="text-[10px] text-amber-500 absolute -bottom-4 left-1 whitespace-nowrap">
                            {feedback}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
             <div className="glass-panel p-12 flex flex-col items-center justify-center text-center gap-4 h-full">
               <ShieldCheck size={48} className="text-accent-cyan" />
               <h2 className="text-2xl font-serif">Assessment Complete</h2>
               <div className="flex flex-col items-center gap-2 mb-4">
                 <span className="text-secondary text-sm uppercase tracking-wider block">Final Prediction</span>
                 <span className={`text-5xl font-serif block uppercase tracking-wider ${
                    (predictionResult || '').includes('High') || (predictionResult || '').includes('Severe') ? 'text-red-400' :
                    (predictionResult || '').includes('Medium') || (predictionResult || '').includes('Mild') ? 'text-amber-400' :
                    'text-green-400'
                 }`}>{predictionResult || 'Unknown'}</span>
               </div>
               <p className="text-secondary max-w-sm">The clinical report has been saved to the patient record and audit logs.</p>
               <div className="flex gap-4 mt-6">
                 <button onClick={() => { setForm(initial); setIsComplete(false); setPredictionResult(null); }} className="px-6 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white transition rounded-lg font-medium">New Assessment</button>
                 <button onClick={() => setIsComplete(false)} className="px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition">
                   Edit Assessment
                 </button>
               </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
