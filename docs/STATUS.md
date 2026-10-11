# Playkin project status

This is the authoritative delivery status for the repository. Feature lists in older documents describe product intent or historical work; they are not release-readiness evidence.

Last verified: 2026-10-11 on `phase0/foundation`, based on `main@acb4e893` plus the isolated typography fix from open PR #1.

## Current status

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Repository checkout | VERIFIED WORKING | Clean baseline was fetched and the open typography change was inspected. |
| Dependency installation | PARTIAL | Lockfile is being normalized to HTTPS; a clean install must run under Node 18.18.0/npm 9.8.1. |
| Typography blank-screen fix | VERIFIED WORKING | PR #1 adds the missing platform font token; its PR remains open and unmerged. |
| Onboarding persistence | PARTIAL | Completion is now read and written through one tested helper; full browser/device journey remains pending. |
| Onboarding navigation | PARTIAL | Gift stays on its stack route; creator/learning/explore routes now enter the nested tab navigator correctly. |
| Unit tests | PARTIAL | Existing legacy failures are being repaired or explicitly tracked; final Phase 0 result must come from the CI-equivalent run. |
| Type checking | BROKEN / TRACKED DEBT | The legacy surface has known diagnostics; `verify:types` prevents the count from increasing. |
| Lint | PARTIAL | Known blocking lint errors are being corrected; warnings remain legacy debt. |
| Web export | DEFERRED FOR COMPATIBLE RUNTIME | Expo SDK 49 requires the pinned Node 18.18.0 toolchain; Node 24 is not an accepted verification runtime. |
| Browser boot | NOT VERIFIED | CI now builds the export, scans it, and launches Chromium; no green CI result exists for this branch yet. |
| Client AI credentials | RETIRED | The client no longer reads provider keys or calls provider APIs; generation uses the existing local fallback until Phase 1 server work. |
| Payment | NOT IMPLEMENTED | No payment provider or entitlement backend is in this Phase 0 scope. |
| Server persistence / recipient links | NOT IMPLEMENTED | Reserved for the Phase 1 vertical slice. |
| Nightly agent publishing | DEFERRED | The current workflow remains a placeholder and retains no write authority in the Phase 0 target. |

## Phase 0 acceptance gates

- Clean install with `.nvmrc` and the committed lockfile.
- Lint succeeds; legacy warnings are visible.
- Tests pass, or any remaining failures are named and linked to an owner/retirement task.
- TypeScript diagnostics do not exceed `quality-baseline.json`.
- Web export succeeds under Node 18.18.0.
- Client bundle scan rejects provider keys, server payment keys, provider API URLs, and bearer headers.
- Chromium opens the exported app without page errors or console errors.
- Negative controls prove the type baseline and bundle scan fail when deliberately made worse.

## Phase 1 handoff queue

1. Establish the web-first shell and route model without importing the legacy navigator.
2. Extract shared domain models, theme tokens, and the `GameModule` contract.
3. Add a small server boundary for gift drafts, generated content, and server-only provider credentials.
4. Persist a gift, issue an opaque expiring recipient token, and render the recipient route without login.
5. Ship one complete creator-to-recipient game module with completion tracking.
6. Add premium visual assets, responsive states, accessibility, performance budgets, and mobile-browser acceptance tests from the first vertical slice.
