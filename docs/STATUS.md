# Playkin project status

This is the authoritative delivery status for the repository. Feature lists in older documents describe product intent or historical work; they are not release-readiness evidence.

Last verified: 2026-10-11 on PR #2 (`phase0/foundation` at `5c7d5c4`), based on `main@acb4e893` plus the isolated typography fix from open PR #1.

## Current status

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Repository checkout | VERIFIED WORKING | Clean baseline was fetched and the open typography change was inspected. |
| Dependency installation | VERIFIED WORKING | Plain `npm ci --no-audit --no-fund` completed with 1,730 packages and lifecycle scripts enabled. The local machine reported a Node 24 engine warning; GitHub CI used the pinned Node 18.18.0 toolchain. |
| Typography blank-screen fix | VERIFIED WORKING | PR #1 adds the missing platform font token; its PR remains open and unmerged. |
| Onboarding persistence | VERIFIED WORKING | Jest coverage and the GitHub Chromium smoke test cover first-run completion and returning-user bypass through the web storage adapter. |
| Onboarding navigation | VERIFIED WORKING | The GitHub Chromium smoke test completes first-time onboarding into the Templates tab and then navigates the returning-user shell to Templates. |
| Unit tests | VERIFIED WORKING | 8 suites and 86 tests pass locally after the targeted fixes. |
| Type checking | BROKEN / TRACKED DEBT | The legacy surface has known diagnostics; `verify:types` prevents the count from increasing. |
| Lint | VERIFIED WORKING | ESLint exits successfully with 0 errors and 228 legacy warnings. |
| Web export | VERIFIED WORKING | GitHub Actions CI completed `npm run build:web` in 41 seconds under the pinned Node 18.18.0 environment. |
| Browser boot | VERIFIED WORKING | GitHub Actions CI installed Chromium and completed the fresh-export browser smoke test, including first-time onboarding, returning-user bypass, and nested Templates navigation. |
| Client AI credentials | RETIRED | The client no longer reads provider keys, embeds provider endpoints, or calls provider APIs; generation uses the existing local fallback until Phase 1 server work. |
| Client bundle secret scan | VERIFIED WORKING | GitHub Actions scanned the same fresh `web-build` produced by CI; the scanner passed. The deliberate provider-key fixture failed the scanner locally and was removed. |
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

## Phase 0 verification record

- PR: [#2](https://github.com/isudally/playkin/pull/2), base `main`, head `phase0/foundation`.
- GitHub CI: run `38130357982`, job `114443222822`, successful in 1m 41s on `5c7d5c4`. Steps completed: `npm ci`, ESLint, Jest (86 tests), tracked TypeScript baseline, web export, client-bundle scan, Chromium installation, and browser/onboarding smoke test.
- Vercel workflow: run `38130358044` succeeded in 1m 8s; the unconfigured PR preview step was skipped. The production step remains conditional on pushes to `main` and unchanged.
- Local exact install: `npm ci --no-audit --no-fund` completed with 1,730 packages. Local Node 24 emitted the repository's expected engine warning; this is not the CI runtime result.
- Negative controls: setting the TypeScript baseline below the observed 63 diagnostics failed `verify:types`; adding a provider-key fixture failed `verify:client-bundle`; both fixtures were removed/restored.

## Phase 1 handoff queue

1. Establish the web-first shell and route model without importing the legacy navigator.
2. Extract shared domain models, theme tokens, and the `GameModule` contract.
3. Add a small server boundary for gift drafts, generated content, and server-only provider credentials.
4. Persist a gift, issue an opaque expiring recipient token, and render the recipient route without login.
5. Ship one complete creator-to-recipient game module with completion tracking.
6. Add premium visual assets, responsive states, accessibility, performance budgets, and mobile-browser acceptance tests from the first vertical slice.
