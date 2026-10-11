# Playkin project status

This is the authoritative delivery status for the repository. Feature lists in older documents describe product intent or historical work; they are not release-readiness evidence.

Last verified: 2026-10-11 on merged `main@f8e71af9ca244850a5f99cfa021888cb734f3fc4` and open PR [#3](https://github.com/isudally/playkin/pull/3) at `phase1a/web-foundation@1e5c6e3`, with the active `Protect main - CI required` ruleset. Phase 1A remains unmerged.

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
| Web route shell | VERIFIED WORKING | PR #3's required GitHub CI completed the fresh-export Chromium smoke test across discovery, creator, recipient, admin, local draft persistence, and the 390x844 mobile viewport. |
| Shared domain model | VERIFIED WORKING | `src/web/domain/playkin-domain.ts` defines the draft and future integration interfaces without implementing server services; type verification passed in CI. |
| GameModule contract | VERIFIED WORKING | `src/web/domain/game-module.ts` defines manifest, personalization, theme/assets, difficulty, lifecycle, structured events, subscriptions, and teardown; type verification passed in CI. |
| Design foundation | VERIFIED WORKING | Web theme adapts the existing `creator-wave` seasonal tokens and documents temporary artwork; fresh web export and browser boot passed in CI. |
| Native migration safety | VERIFIED WORKING | `App.tsx` keeps the existing native navigator and selects the new shell only for `Platform.OS === 'web'`; CI retained the Phase 0 verification suite. |
| Production web export | VERIFIED WORKING | PR #3 CI run `38154738978` completed the fresh `npm run build:web` under Node 18.18.0. Local Node 24 remains non-authoritative and still fails Expo 49's Metro external shim. |
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

1. Replace the retired client-side AI path with a small server boundary for gift drafts, generated content, and server-only provider credentials.
2. Persist a gift, issue an opaque expiring recipient token, and render the recipient route without login.
3. Ship one complete creator-to-recipient game module with completion tracking.
4. Add premium visual assets, responsive states, accessibility, performance budgets, and mobile-browser acceptance tests from the first vertical slice.

## Phase 1A verification record

- PR: [#3](https://github.com/isudally/playkin/pull/3), base `main`, head `phase1a/web-foundation`, initial implementation commit `1e5c6e3`.
- GitHub CI: run [`38154738978`](https://github.com/isudally/playkin/actions/runs/38154738978), required job `lint-and-test`, successful. It completed dependency installation, lint, Jest, the tracked TypeScript baseline, Node 18.18.0 web export, same-export client-bundle secret scan, Chromium installation, and browser smoke test.
- Browser evidence: the fresh export rendered at 390x844; the smoke test covered the discovery route, creator fields and local draft, recipient development preview, return to discovery, and admin boundary without page or console errors.
- Deployment workflow: run [`38154739057`](https://github.com/isudally/playkin/actions/runs/38154739057), job `deploy`, successful. No Vercel preview was configured and no production deployment was authorized; production remains manual-only.
- Local verification: route tests passed (2 tests), `verify:types` passed against the existing 63-diagnostic legacy baseline with zero new web diagnostics, and ESLint passed with 0 errors and 228 warnings. The local worktree was clean before PR creation.
- Status: Phase 1A is ready for review, not merged. Phase 1B services remain not implemented.
