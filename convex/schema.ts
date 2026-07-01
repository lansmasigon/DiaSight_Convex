import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  doctors: defineTable({
    id: v.optional(v.string()),
    created_at: v.number(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    email: v.optional(v.string()),
    specialization: v.optional(v.string()),
    password: v.optional(v.string()),
  })
    .index("by_source_id", ["id"])
    .index("by_email", ["email"]),

  labs: defineTable({
    created_at: v.number(),
    age: v.optional(v.number()),
    sex: v.optional(v.number()),
    dbp: v.optional(v.number()),
    hbp: v.optional(v.number()),
    duration: v.optional(v.number()),
    hba1c: v.optional(v.number()),
    ldl: v.optional(v.number()),
    hdl: v.optional(v.number()),
    cholesterol: v.optional(v.number()),
    urea: v.optional(v.number()),
    bun: v.optional(v.number()),
    uric: v.optional(v.number()),
    egfr: v.optional(v.number()),
    triglycerides: v.optional(v.number()),
    ucr: v.optional(v.number()),
    alt: v.optional(v.number()),
    ast: v.optional(v.number()),
    created_by: v.optional(v.string()),
    lab_id: v.string(),
    sbp: v.optional(v.number()),
  })
    .index("by_lab_id", ["lab_id"])
    .index("by_created_by", ["created_by"]),

  risk_classification: defineTable({
    id: v.optional(v.string()),
    created_at: v.number(),
    risk_class: v.optional(v.string()),
    lab_id: v.optional(v.string()),
  })
    .index("by_source_id", ["id"])
    .index("by_lab_id", ["lab_id"]),

  audit_logs: defineTable({
    id: v.optional(v.string()),
    created_at: v.number(),
    doctor_id: v.optional(v.string()),
    lab_id: v.optional(v.string()),
    all_lab_inputs: v.optional(v.any()),
    risk_classification_id: v.optional(v.string()),
    risk_class: v.optional(v.string()),
  })
    .index("by_source_id", ["id"])
    .index("by_doctor_id", ["doctor_id"])
    .index("by_lab_id", ["lab_id"])
    .index("by_risk_classification_id", ["risk_classification_id"]),

  yakap_clinics: defineTable({
    id: v.optional(v.string()),
    facility_name: v.optional(v.string()),
    tel_no: v.optional(v.string()),
    email: v.optional(v.string()),
    street: v.optional(v.string()),
    municipality: v.optional(v.string()),
    province: v.optional(v.string()),
    expire_date: v.optional(v.string()),
    sec: v.optional(v.string()),
  })
    .index("by_source_id", ["id"])
    .index("by_email", ["email"]),
});
