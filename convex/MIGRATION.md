# Convex Migration Notes

## Schema Mapping Applied
- `doctors` -> `doctors`
- `labs` -> `labs`
- `risk_classification` -> `risk_classification`
- `audit_logs` -> `audit_logs`
- `yakap_clinics` -> `yakap_clinics`

## Type Conventions Used
- Convex document `_id` is the internal primary identifier.
- Source SQL ID/FK columns are preserved as explicit string fields (`id`, `lab_id`, `doctor_id`, etc.).
- Supabase `timestamp with time zone` -> Convex `number` (epoch milliseconds)
- Supabase numeric columns (`bigint`, `double precision`) -> Convex `number`
- Supabase `jsonb` -> Convex `any`

## Remaining Inputs Needed
- RLS policies that must be preserved in app-level auth checks.
- Current frontend/backend code paths that read/write Supabase, so they can be replaced with Convex queries/mutations.
- Whether `yakap_clinics.id` should be treated as unique (it is not constrained in the provided SQL).

## Migration Plan
1. Run `npx convex dev` to generate `convex/_generated/*`.
2. Add import mutations/actions to ingest each Supabase table into Convex.
3. Execute one-time migration in dependency order: `doctors` -> `labs` -> `risk_classification` -> `audit_logs` -> `yakap_clinics`.
4. Replace Supabase client calls in app code with Convex queries/mutations.
