# Playkin project status

This is the authoritative delivery status for the repository. Feature lists in older documents describe product intent or historical work; they are not release-readiness evidence.

Last verified: 2026-10-11 on merged `main@f8e71af9ca244850a5f99cfa021888cb734f3fc4`, with the active `Protect main - CI required` ruleset. Phase 1A work is currently on `phase1a/web-foundation` and remains unmerged.

## Current status

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Repository checkout | VERIFIED WORKING | Phase 0 PR #2 is merged into `main`; PR #1 is closed as superseded. |
| Dependency installation | VERIFIED WORKING | Plain `npm ci --no-audit --no-fund` completed with 1,730 packages and lifecycle scripts enabled. The local machine reported a Node 24 engine warning; GitHub CI used the pinned Node 18.18.0 toolchain. |
| Typography blank-screen fix | VERIFIED WORKING | The isolated typography repair is included once through PR #2; PR #1 was closed without merging. |
| Onboarding persistence | VERIFIED WORKING | Jest coverage and the GitHub Chromium smoke test cover first-run completion and returning-user bypass through the web storage adapter. |
| Onboarding navigation | VERIFIED WORKING | The GitHub Chromium smoke test completes first-time onboarding into the Templates tab and then navigates the returning-user shell to Templates. |
| Unit tests | VERIFIED WORKING | 8 suites and 86 tests pass locally after the targeted fixes. |
| Type checking | BROKEN / TRACKED DEBT | The legacy surface has known diagnostics; `verify:types` prevents the count from increasing. |
| Lint | VERIFIED WORKING | ESLint exits successfully with 0 errors and 228 legacy warnings. |
| Web export | VERIFIED WORKING | GitHub Actions CI completed `npm run build:web` in 41 seconds under the pinned Node 18.18.0 environment. |
| Browser boot | VERIFIED WORKING | GitHub Actions CI installed Chromium and completed the fresh-export browser smoke test, including first-time onboarding, returning-user bypass, and nested Templates navigation. |
| Client AI credentials | RETIRED | The client no longer reads provider keys, embeds provider endpoints, or calls provider APIs; generation uses the existing local fallback until Phase 1 server work. |
| Server-side AI replacement | DEFERRED | Phase 1 must replace the retired client-side provider path with a server-side AI boundary, server-only credentials, and an explicit product/API contract. |
| Client bundle secret scan | VERIFIED WORKING | GitHub Actions scanned the same fresh `web-build` produced by CI; the scanner passed. The deliberate provider-key fixture failed the scanner locally and was removed. |
| Payment | NOT IMPLEMENTED | No payment provider or entitlement backend is in this Phase 0 scope. |
| Server persistence / recipient links | NOT IMPLEMENTED | Reserved for the Phase 1 vertical slice. |
| Nightly agent publishing | DEFERRED | The current workflow remains a placeholder and retains no write authority in the Phase 0 target. |
| Main branch governance | VERIFIED WORKING | Active ruleset `Protect main - CI required` targets `main`, requires pull requests and the `lint-and-test` GitHub Actions check, requires up-to-date branches, and blocks force pushes and deletion. |
| Production deployment | VERIFIED SAFE / DEFERRED | Post-merge deploy workflow passed with the production step gated behind explicit manual dispatch authorization. No production deployment was authorized. Vercel account connectivity remains deferred. |

## Phase 1A status

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Web route shell | PARTIAL | New web-only shell implements home/discovery, creator, recipient, and admin boundaries on `phase1a/web-foundation`; CI browser verification is pending. |
| Shared domain model | VERIFIED LOCALLY | `src/web/domain/playkin-domain.ts` defines the draft and future integration interfaces without implementing server services. |
| GameModule contract | VERIFIED LOCALLY | `src/web/domain/game-module.ts` defines manifest, personalization, theme/assets, difficulty, lifecycle, structured events, subscriptions, and teardown. |
| Design foundation | VERIFIED LOCALLY | Web theme adapts the existing `creator-wave` seasonal tokens and documents temporary artwork. |
| Native migration safety | VERIFIED LOCALLY | `App.tsx` keeps the existing native navigator and selects the new shell only for `Platform.OS === 'web'`. |
| Production web export | BLOCKED LOCALLY / PENDING CI | The local machine has Node 24 while the pinned project toolchain is Node 18.18.0; Expo 49 fails locally in Metro's Node 24 external shim. The authoritative check is the GitHub Node 18 job. |
| Phase 1B services | NOT IMPLEMENTED | Persistence, secure recipient links, server AI, payments, uploads, and analytics are interfaces only. |

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

1. Complete CI and fresh-export browser verification for `phase1a/web-foundation`.
2. Replace the retired client-side AI path with a small server boundary for gift drafts, generated content, and server-only provider credentials.
3. Persist a gift, issue an opaque expiring recipient token, and render the recipient route without login.
4. Ship one complete creator-to-recipient game module with completion tracking.
5. Add premium visual assets, responsive states, accessibility, performance budgets, and mobile-browser acceptance tests from the first vertical slice.
