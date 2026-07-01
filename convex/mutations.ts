import { v } from "convex/values";
import { mutation } from "./_generated/server";

function makeSourceId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const createAssessment = mutation({
  args: {
    doctor_id: v.string(),
    lab_data: v.object({
      lab_id: v.string(),
      age: v.number(),
      sex: v.number(),
      duration: v.number(),
      sbp: v.number(),
      dbp: v.number(),
      hbp: v.number(),
      hba1c: v.number(),
      ldl: v.number(),
      hdl: v.number(),
      cholesterol: v.number(),
      triglycerides: v.number(),
      urea: v.number(),
      bun: v.number(),
      uric: v.number(),
      egfr: v.number(),
      ucr: v.number(),
      alt: v.number(),
      ast: v.number(),
    }),
    risk_class: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.insert("labs", {
      created_at: now,
      created_by: args.doctor_id,
      ...args.lab_data,
    });

    const riskId = makeSourceId("risk");
    await ctx.db.insert("risk_classification", {
      id: riskId,
      created_at: now,
      lab_id: args.lab_data.lab_id,
      risk_class: args.risk_class,
    });

    await ctx.db.insert("audit_logs", {
      id: makeSourceId("audit"),
      created_at: now,
      doctor_id: args.doctor_id,
      lab_id: args.lab_data.lab_id,
      all_lab_inputs: args.lab_data,
      risk_classification_id: riskId,
      risk_class: args.risk_class,
    });

    return { lab_id: args.lab_data.lab_id, risk_classification_id: riskId };
  },
});
