import { v } from "convex/values";
import { query } from "./_generated/server";

export const listDoctors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("doctors").collect();
  },
});

export const getDoctorById = query({
  args: {
    id: v.id("doctors"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listLabs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("labs").collect();
  },
});

export const getLabByLabId = query({
  args: {
    lab_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labs")
      .withIndex("by_lab_id", (q) => q.eq("lab_id", args.lab_id))
      .unique();
  },
});

export const getDoctorByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("doctors")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getLabsByDoctorId = query({
  args: {
    doctor_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labs")
      .withIndex("by_created_by", (q) => q.eq("created_by", args.doctor_id))
      .collect();
  },
});

export const getRiskDistributionByDoctorId = query({
  args: {
    doctor_id: v.string(),
  },
  handler: async (ctx, args) => {
    const labs = await ctx.db
      .query("labs")
      .withIndex("by_created_by", (q) => q.eq("created_by", args.doctor_id))
      .collect();

    const labIds = new Set(labs.map((l) => l.lab_id));
    const riskRows = await ctx.db.query("risk_classification").collect();

    const distribution = { nodr: 0, mild: 0, severe: 0 };
    for (const row of riskRows) {
      if (!row.lab_id || !labIds.has(row.lab_id)) continue;
      const value = (row.risk_class || "").toLowerCase();
      if (value.includes("no dr") || value === "no dr") distribution.nodr += 1;
      else if (value.includes("mild")) distribution.mild += 1;
      else if (value.includes("severe")) distribution.severe += 1;
    }

    return distribution;
  },
});

export const getAuditLogsForDoctor = query({
  args: {
    doctor_id: v.string(),
  },
  handler: async (ctx, args) => {
    const doctor = await ctx.db
      .query("doctors")
      .withIndex("by_source_id", (q) => q.eq("id", args.doctor_id))
      .first();

    const logs = await ctx.db
      .query("audit_logs")
      .withIndex("by_doctor_id", (q) => q.eq("doctor_id", args.doctor_id))
      .collect();

    logs.sort((a, b) => b.created_at - a.created_at);

    const expanded = await Promise.all(
      logs.map(async (log) => {
        const lab = log.lab_id
          ? await ctx.db
              .query("labs")
              .withIndex("by_lab_id", (q) => q.eq("lab_id", log.lab_id!))
              .first()
          : null;

        const risk = log.risk_classification_id
          ? await ctx.db
              .query("risk_classification")
              .withIndex("by_source_id", (q) => q.eq("id", log.risk_classification_id!))
              .first()
          : null;

        return {
          ...log,
          doctors: doctor
            ? {
                first_name: doctor.first_name,
                last_name: doctor.last_name,
                email: doctor.email,
              }
            : null,
          labs: lab,
          risk_classification: risk ? { risk_class: risk.risk_class } : null,
        };
      })
    );

    return expanded;
  },
});

export const listRiskClassifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("risk_classification").collect();
  },
});

export const listAuditLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("audit_logs").collect();
  },
});

export const listYakapClinics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("yakap_clinics").collect();
  },
});
