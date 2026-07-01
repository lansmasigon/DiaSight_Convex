import { v } from "convex/values";
import { action } from "./_generated/server";

const RETRYABLE_STATUS = new Set([502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const classifyRisk = action({
  args: {
    endpoint: v.string(),
    payload: v.object({
      age: v.number(),
      sex: v.number(),
      sbp: v.number(),
      dbp: v.number(),
      hbp: v.number(),
      duration: v.number(),
      hb1ac: v.number(),
      ldl: v.number(),
      hdl: v.number(),
      chol: v.number(),
      urea: v.number(),
      bun: v.number(),
      uric: v.number(),
      egfr: v.number(),
      trig: v.number(),
      ucr: v.number(),
      alt: v.number(),
      ast: v.number(),
    }),
  },
  handler: async (_ctx, args) => {
    let lastStatus = 0;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await fetch(args.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args.payload),
      });

      if (res.ok) {
        const prediction = await res.json();
        return { risk_class: prediction?.prediction || "Unknown" };
      }

      lastStatus = res.status;
      if (!RETRYABLE_STATUS.has(res.status) || attempt === 3) {
        throw new Error(`Prediction API failed (${res.status})`);
      }
      await sleep(600 * attempt);
    }
    throw new Error(`Prediction API failed (${lastStatus})`);
  },
});
