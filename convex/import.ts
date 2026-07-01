import { v } from "convex/values";
import { mutation } from "./_generated/server";

const doctorRow = v.object({
  id: v.optional(v.string()),
  created_at: v.optional(v.string()),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  email: v.optional(v.string()),
  specialization: v.optional(v.string()),
  password: v.optional(v.string()),
});

function toMillis(createdAt?: string) {
  if (!createdAt) return Date.now();
  const parsed = Date.parse(createdAt);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export const importDoctors = mutation({
  args: {
    rows: v.array(doctorRow),
  },
  handler: async (ctx, args) => {
    let inserted = 0;
    let updated = 0;

    for (const row of args.rows) {
      const doctor = {
        id: row.id,
        created_at: toMillis(row.created_at),
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        specialization: row.specialization,
        password: row.password,
      };

      if (row.id) {
        const existingById = await ctx.db
          .query("doctors")
          .withIndex("by_source_id", (q) => q.eq("id", row.id))
          .first();

        if (existingById) {
          await ctx.db.patch(existingById._id, doctor);
          updated += 1;
          continue;
        }
      }

      if (row.email) {
        const existing = await ctx.db
          .query("doctors")
          .withIndex("by_email", (q) => q.eq("email", row.email))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, doctor);
          updated += 1;
          continue;
        }
      }

      await ctx.db.insert("doctors", doctor);
      inserted += 1;
    }

    return {
      total: args.rows.length,
      inserted,
      updated,
    };
  },
});
