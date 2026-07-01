import { mutation } from "./_generated/server";

// Idempotent seed helper you can adapt during migration.
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("doctors").first();
    if (existing) return { seeded: false };

    const now = Date.now();
    await ctx.db.insert("doctors", {
      id: "00000000-0000-0000-0000-000000000000",
      created_at: now,
      first_name: "Sample",
      last_name: "Doctor",
      email: "placeholder@example.com",
      specialization: "General Medicine",
      password: "replace-this",
    });

    return { seeded: true };
  },
});
