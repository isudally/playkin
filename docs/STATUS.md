# Playkin project status

This is the authoritative delivery status for the repository. Feature lists in older documents describe product intent or historical work; they are not release-readiness evidence.

Last verified: 2026-10-12 on [PR #6](https://github.com/isudally/playkin/pull/6), head `656c9487b9d9049e8ba503212467107346bbdbc5`, based on merged `main@399d402a397befca0f53938331380ccc3cc9c5a3`, with the active `Protect main - CI required` ruleset. Local and GitHub Phase 1D verification passed; the PR remains open and production deployment remains deferred.

## Current status

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Repository checkout | VERIFIED WORKING | Phase 0 PR #2, Phase 1A PR #3, and Phase 1B PR #4 are merged into `main`; PR #1 is closed as superseded. |
| Dependency installation | VERIFIED WORKING | Plain `npm ci --no-audit --no-fund` completed with 1,730 packages and lifecycle scripts enabled. The local machine reported a Node 24 engine warning; GitHub CI used the pinned Node 18.18.0 toolchain. |
| Typography blank-screen fix | VERIFIED WORKING | The isolated typography repair is included once through PR #2; PR #1 was closed without merging. |
| Onboarding persistence | VERIFIED WORKING | Jest coverage and the GitHub Chromium smoke test cover first-run completion and returning-user bypass through the web storage adapter. |
| Onboarding navigation | VERIFIED WORKING | The GitHub Chromium smoke test completes first-time onboarding into the Templates tab and then navigates the returning-user shell to Templates. |
| Unit tests | VERIFIED WORKING | Phase 1C adds regression coverage for versioned storage, corrupt records, republishing, creator updates, and immutable completion; exact current count is recorded below. |
| Type checking | BROKEN / TRACKED DEBT | The legacy surface has known diagnostics; `verify:types` prevents the count from increasing. |
| Lint | VERIFIED WORKING | ESLint exits successfully with 0 errors and 228 legacy warnings. |
| Web export | VERIFIED WORKING | GitHub Actions CI completed `npm run build:web` in 41 seconds under the pinned Node 18.18.0 environment. |
| Browser boot | VERIFIED WORKING | GitHub Actions CI installed Chromium and completed the fresh-export browser smoke test, including first-time onboarding, returning-user bypass, and nested Templates navigation. |
| Client AI credentials | RETIRED | The client no longer reads provider keys, embeds provider endpoints, or calls provider APIs; generation uses the existing local fallback until Phase 1 server work. |
| Server-side AI replacement | PARTIAL | Phase 1B exposes a server-only `/api/ai/suggestions` boundary that is intentionally disabled until provider credentials and an approved product contract exist. No live AI claim is made. |
| Client bundle secret scan | VERIFIED WORKING | GitHub Actions scanned the same fresh `web-build` produced by CI; the scanner passed. The deliberate provider-key fixture failed the scanner locally and was removed. |
| Payment | NOT IMPLEMENTED | No payment provider or entitlement backend is in this Phase 0 scope. |
| Server persistence / recipient links | PARTIAL | Phase 1C adds a versioned/migratable JSON adapter, preserves completed status during republishing and creator updates, and distinguishes passive opens from interaction. It remains a replaceable local service, not a production database. |
| Nightly agent publishing | DEFERRED | The current workflow remains a placeholder and retains no write authority in the Phase 0 target. |
| Main branch governance | VERIFIED WORKING | Active ruleset `Protect main - CI required` targets `main`, requires pull requests and the `lint-and-test` GitHub Actions check, requires up-to-date branches, and blocks force pushes and deletion. |
| Production deployment | VERIFIED SAFE / DEFERRED | Post-merge deploy workflow passed with production and preview steps skipped because deployment credentials are unset and the workflow requires explicit authorization. No production deployment was authorized. Vercel account connectivity remains deferred. |

## Phase 1A status

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Independent web runtime | VERIFIED WORKING | PR #3 merged at `fdd1c53`; the Vite entrypoint in `web/` uses browser-native React DOM components and CSS; the web build imports neither the Expo app nor React Native runtime. |
| Web route shell | VERIFIED WORKING | GitHub Chromium smoke test completed discovery, creator, recipient, admin, local draft persistence, direct SPA fallback serving, and the 390x844 mobile viewport without page or console errors. |
| Shared domain model | VERIFIED WORKING | `web/domain/playkin-domain.ts` defines the draft and future integration interfaces without implementing server services; independent web type-check passed in CI. |
| GameModule contract | VERIFIED WORKING | `web/domain/game-module.ts` defines manifest, personalization, theme/assets, difficulty, lifecycle, structured events, subscriptions, and teardown; independent web type-check passed in CI. |
| Design foundation | VERIFIED WORKING | Browser-native CSS preserves the Playkin dark seasonal direction, responsive layouts, accessible focus states, and temporary artwork note; build and browser checks passed in CI. |
| Native migration safety | VERIFIED WORKING | `App.tsx` is restored to the legacy Expo/React Native application; the independent Vite runtime is started and built separately. |
| Production web export | VERIFIED WORKING | PR #3 post-merge CI run `38158616510` produced the Vite export under the pinned Node 18.18.0 toolchain; deployment workflow `38158616486` completed without deployment. |
| Initial JavaScript bundle | VERIFIED WORKING | The corrected Phase 1B export measured 162,037 raw JavaScript bytes, below the 300,000-byte budget, with no legacy runtime references. |

## Phase 1B status

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Server gift persistence | VERIFIED WORKING | `server/store.cjs` validates names, message, occasion, and theme; writes a server-side JSON record; supports creator-authorized deletion; and has passing persistence tests. This is a replaceable first-slice store, not a production database. |
| Secure recipient delivery | VERIFIED WORKING | Recipient links use 256-bit random opaque tokens; only SHA-256 hashes are persisted; links expire after seven days; invalid and expired links return explicit errors; rate limiting is applied at the HTTP boundary. |
| Playable experience | VERIFIED WORKING | `web/game/memory-trail.ts` implements Dodo's Memory Trail with three personalized clues, progression, scoring, completion events, teardown, and the typed GameModule contract. |
| Server-side AI | PARTIAL | The server exposes a disabled provider boundary without client credentials. Live provider integration is not implemented or claimed. |
| Completion persistence | VERIFIED WORKING | The first completion score and timestamp are immutable; conflicting repeat completion requests cannot overwrite them. Client-reported scores are stored as gameplay claims, not independently verified results. |
| Gift-open tracking | VERIFIED WORKING | Recipient-link resolution records `openedAt`; an authenticated creator status endpoint and UI expose opened/completed state. |
| Creator deletion and retention | VERIFIED WORKING | The creator UI can delete a gift and invalidate its link. Expired records are purged after a documented 30-day retention window; corrupt storage fails closed instead of resetting to an empty database. |
| Privacy and abuse boundaries | PARTIAL | Creator-token authorization, recipient-token isolation, deletion, input limits, bounded body parsing, expiry, retention, and socket-based bounded rate limiting are present. Identity, moderation, audit retention, and production database controls remain follow-up work. |
| Gameplay product accuracy | PARTIAL | The three-round Memory Trail is a substantive vertical-slice contract demonstration, not a commercially premium catalogue experience. The full sender message is now revealed only after completion; richer game design and final artwork remain follow-up work. |
| Phase 1B browser evidence | VERIFIED WORKING | Chromium at 390x844 proved creator save, secure-link generation, separate browser delivery, all three game rounds, persisted completion after reload, creator status refresh showing opened/completed, creator deletion, deleted-link handling, and no unexpected browser errors. |
| Phase 1B release state | READY TO MERGE | Targeted correction commit `bd507523f81380f1eaad674e67a17ea3f8d6e22d` is on PR #4; fresh GitHub CI and deployment-safety checks passed. This is not a production-readiness claim. |

## Phase 1C current implementation

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Branch | VERIFIED WORKING | `phase1c/product-quality` was merged into `main` at `399d402a397befca0f53938331380ccc3cc9c5a3`; Phase 1D starts from that verified baseline. |
| Creator recovery | PARTIAL | The creator form and authorization token recover after refresh in the same browser tab through `sessionStorage`. Cross-device recovery is intentionally deferred until account identity exists; the token is not moved to persistent browser storage. |
| Creator management | VERIFIED WORKING | Creator updates use an authenticated `PATCH` path; deletion remains available; status distinguishes passive link opens, interaction, and completion. |
| Republish integrity | VERIFIED WORKING | Republishing rotates the recipient token without regressing a completed gift to `published`; creator updates preserve completion state. |
| Completion messaging | VERIFIED WORKING | The recipient reveal remains closed until the server confirms the completion write; save failures expose a retry path. |
| Open versus interaction | VERIFIED WORKING | Link resolution records `openedAt`; progress or completion records `interactedAt`; the creator status UI labels them separately. |
| Storage evolution | PARTIAL | The JSON adapter now records schema version 1, accepts the unversioned migration shape, rejects unsupported or malformed records, and fails closed. A durable production database and migration runner remain deferred. |
| Interactive experience | PARTIAL | Memory Trail now has answer feedback, explicit progression, score feedback, a completion reveal, lightweight audio, and motion states. It remains a development vertical slice with temporary artwork, not a commercial catalogue experience. |
| Runtime evidence | VERIFIED WORKING | Local web types, server tests, production build, bundle guard, client-secret scan, and real Chromium at 390x844 passed. GitHub PR checks are required before merge. |
| Release boundary | READY TO MERGE | PR #5 is open and mergeable; local and GitHub verification passed. No production deployment, payment, live AI, hosted database, identity, or Phase 1C merge is claimed. |

## Phase 0 acceptance gates

- Clean install with `.nvmrc` and the committed lockfile.
- Lint succeeds; legacy warnings are visible.
- Tests pass, or any remaining failures are named and linked to an owner/retirement task.
- TypeScript diagnostics do not exceed `quality-baseline.json`.
- Web export succeeds under Node 18.18.0.
- Client bundle scan rejects provider keys, server payment keys, provider API URLs, and provider-style secret tokens. Legitimate creator bearer authorization is allowed and is tested through the authenticated application path.
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

- PR: [#3](https://github.com/isudally/playkin/pull/3), base `main`, head `phase1a/web-foundation`, merged into `main` as `fdd1c53` after approval.
- Independent runtime: `web/index.html`, `web/main.tsx`, `web/App.tsx`, `web/styles.css`, `web/vite.config.ts`, and `web/tsconfig.json`. The Vite build has no import path to the legacy Expo app, React Native, or legacy engines.
- Local verification: 10 Jest suites and 90 tests passed; `verify:types` passed against the existing 63-diagnostic legacy baseline; `verify:types:web` passed with zero diagnostics; ESLint passed with 0 errors and 228 legacy warnings.
- Web export: Vite 5.4.19 produced `web-build` with one 160,237-byte JavaScript file and 7.75 kB CSS; the independent bundle guard and client secret scanner passed.
- Browser evidence: Phase 1A's local preview checks passed before merge; the Phase 1B browser run additionally proved server save, secure link delivery, separate-browser gameplay, completion reload, invalid-link handling, and admin navigation at 390x844 without unexpected page or console errors.
- CI: [run `38157834134`](https://github.com/isudally/playkin/actions/runs/38157834134), required job `lint-and-test`, successful. It completed `npm ci`, legacy and independent web type checks, lint, 90 tests, Vite export, bundle guard, secret scan, Chromium installation, and the strengthened direct-route/persistence browser boot.
- Deployment workflow: [run `38157834177`](https://github.com/isudally/playkin/actions/runs/38157834177), successful. Production and preview deployment steps were not authorized or configured; no deployment occurred.
- Negative control: a temporary `react-native` reference in `web-build` caused `verify:web-bundle` to fail; the fixture was removed and the clean bundle guard passed again.
- Status: MERGED and verified. Phase 1B was merged into `main` at `842965a586041a020108953fb8d59cecee191f0c`; no production deployment has occurred.

## Phase 1B verification record

- Branch: `phase1b/first-complete-gift`, based on merged `main@fdd1c53b50d649e6d1d78783b24f0d2e2f1c3738`.
- Local checks: 10 Jest suites and 90 tests passed; server persistence tests passed (2 tests); `verify:types` passed against the tracked 63-diagnostic legacy baseline; `verify:types:web` passed with zero diagnostics; ESLint passed with 0 errors and 229 legacy warnings.
- Web export: Vite 5.4.19 produced one 160,237-byte JavaScript file; `verify:web-bundle` and `verify:client-bundle` passed.
- GitHub CI: [run `38160075550`](https://github.com/isudally/playkin/actions/runs/38160075550) passed in 1m56s, including `npm ci`, legacy and web type checks, lint, 90 Jest tests, 2 server tests, Vite export, bundle guard, secret scan, Chromium installation, and the full Phase 1B browser journey.
- Deployment workflow: [run `38160075496`](https://github.com/isudally/playkin/actions/runs/38160075496) passed; production and preview deployment steps were not authorized or configured, and no deployment occurred.
- Negative control: a temporary `react-native` reference in `web-build` caused `verify:web-bundle` to fail; the fixture was removed and the clean scan passed again.
- Runtime boundary: `npm run api:dev` serves the first-slice gift service on localhost; Vite proxies `/api` during local development. The production deployment workflow was not changed to deploy this service.
- Remaining dependencies: production database, identity, moderation/audit policy, final Dodo/game artwork, hosted API runtime, live server-side AI, payments, uploads, and analytics.
- PR: [#4](https://github.com/isudally/playkin/pull/4), base `main`, head `phase1b/first-complete-gift`, merged. Verified pre-merge implementation commit: `b029859fb198bd481ee03f9e7daeed8dbc42b736`; merge commit: `842965a586041a020108953fb8d59cecee191f0c`.

## Phase 1B correctness correction record

- Scope: targeted correction on PR #4 only. No merge, deployment, architecture migration, or Phase 1C work was performed.
- Completion: `server/store.test.cjs` now proves first-write-wins with conflicting repeat scores and timestamps; the server treats the score as a client-reported claim.
- Open/status: valid recipient resolution persists `openedAt`; `GET /api/gifts/:id` requires the creator token and the creator UI refreshes opened/completed status.
- Deletion/retention: the creator UI confirms deletion, deletion invalidates the recipient link, records older than seven days plus a 30-day retention window are purged during request processing, and corrupt JSON raises `STORE_CORRUPT` instead of resetting data.
- HTTP controls: `server/rate-limit.cjs` bounds key memory, the server uses the socket address rather than arbitrary forwarded headers, and body parsing stops accumulating after 32,000 bytes.
- Bundle scanner: generic bearer-header matching was removed because it rejected legitimate creator authorization; provider key names, provider URLs, payment server keys, and provider-style secret tokens remain blocked.
- Local evidence: web type check, production Vite build, web bundle guard, client bundle scan, six server tests, and the 390x844 Chromium journey passed. The journey included separate-browser delivery, completion reload, status refresh, creator deletion, and deleted-link handling.
- Web export: Vite 5.4.19 produced one 162,037-byte JavaScript file; the independent bundle budget and client secret scan passed on that same fresh export.
- GitHub verification after correction: CI run [`38161783569`](https://github.com/isudally/playkin/actions/runs/38161783569), job `114536043941`, passed in 1m45s; deployment-safety run [`38161783571`](https://github.com/isudally/playkin/actions/runs/38161783571), job `114536043970`, passed in 33s with no production deployment.
- Negative control: a temporary `EXPO_PUBLIC_OPENAI_API_KEY` fixture caused the client-bundle scan to fail, then was removed. The clean scan passed again.
- Product boundary: Memory Trail remains a small vertical slice rather than a commercially premium catalogue experience; the full message is revealed only after completion. Final artwork and richer game design remain deferred.

## Phase 1B merge record

- PR #4 was merged after the independent READY TO MERGE review. New `main` SHA: `842965a586041a020108953fb8d59cecee191f0c`.
- Post-merge CI: [run `38207099971`](https://github.com/isudally/playkin/actions/runs/38207099971), required job `114672897582`, passed. It completed dependency installation, lint, Jest, server tests, type checks, web build, bundle scans, Chromium, and browser boot.
- Post-merge deployment workflow: [run `38207099975`](https://github.com/isudally/playkin/actions/runs/38207099975), job `114672897185`, passed with production and preview deployment steps skipped. No unauthorized deployment occurred.
- Phase 1C starts from this verified merge and does not alter production configuration.

## Phase 1C verification record

- Branch: `phase1c/product-quality`, based on merged `main@842965a586041a020108953fb8d59cecee191f0c`.
- PR: [#5](https://github.com/isudally/playkin/pull/5), open and mergeable. The exact current head is kept in the linked pull request and final report; the checks below are for the latest pushed revision.
- GitHub CI: [run `38208622522`](https://github.com/isudally/playkin/actions/runs/38208622522), job `114677583331`, passed in 2m17s. It completed `npm ci`, ESLint, 90 Jest tests, 7 server tests, tracked legacy TypeScript verification, independent web TypeScript verification, Vite build, bundle guard, client-secret scan, Chromium installation, and browser boot.
- Deployment safety: [run `38208622489`](https://github.com/isudally/playkin/actions/runs/38208622489), job `114677582977`, passed in 49s. Production and preview deployment steps were skipped; no deployment occurred.
- Local runtime evidence: real Chromium at 390x844 passed creator refresh recovery, separate-browser delivery, three-round play, interaction/completion status, server-confirmed reveal, completion reload, creator deletion, invalid-link handling, admin navigation, and no unexpected page or console errors.
- Local product checks: 10 Jest suites / 90 tests, 7 server tests, web type check with zero diagnostics, legacy baseline at exactly 63 diagnostics, lint with 0 errors / 228 warnings, 164,883 raw JavaScript bytes, bundle guard, and client secret scan all passed.
- Negative controls: a reduced legacy type baseline and a provider-key fixture each caused their relevant check to fail; both were removed and clean checks passed again.
- Status: MERGED and verified as a development milestone. This is not a commercial launch or production-readiness claim.

## Phase 1D flagship experience

| Area | Status | Evidence / boundary |
| --- | --- | --- |
| Branch | VERIFIED WORKING | `phase1d/flagship-experience`, based on `main@399d402a397befca0f53938331380ccc3cc9c5a3`; [PR #6](https://github.com/isudally/playkin/pull/6) is open at `656c9487b9d9049e8ba503212467107346bbdbc5`. |
| Flagship concept | VERIFIED WORKING | Dodo's Lantern Trail is a five-chapter night adventure. The recipient wakes a lantern, follows five connected acts of attention, collects sparks, receives answer feedback, and unlocks the sender's message only after server-confirmed completion. |
| Personalisation | VERIFIED WORKING | Recipient and sender names, occasion, theme, and sender message shape the chapter copy, answer choices, visual identity, and final reveal. The current questionnaire remains intentionally small; interests and age brackets are deferred. |
| Visual delivery | PARTIAL | The independent Vite runtime now uses an original Dodo-with-lantern illustration, composed lantern scenes, star progression, responsive states, purposeful transitions, reduced-motion CSS, and an explicit sound toggle. Final brand art direction, asset review, and a broader art pack remain commercial dependencies. |
| Asset provenance | VERIFIED DOCUMENTED | `web/public/dodo-lantern-companion.png` is an original development illustration generated for this branch; it is not a third-party or franchise asset. Commercial licensing and brand approval are still required before launch. |
| Replayability | VERIFIED WORKING | Completed gifts remain completed after reload and can be revisited without destroying the persisted completion state. The current content path is deterministic; branching content is deferred. |
| Local verification | VERIFIED WORKING | Clean `npm ci` passed with the committed lockfile; 11 Jest suites / 93 tests, 7 server tests, web type check with zero diagnostics, legacy baseline exactly 63 diagnostics, lint 0 errors / 228 warnings, Vite export 168,055 raw JavaScript bytes, web bundle guard, client secret scan, and real Chromium journey passed. |
| Browser evidence | VERIFIED WORKING | `docs/evidence/phase1d/` contains opening desktop reduced-motion, opening/interaction/progression/reveal/replay mobile screenshots. The browser journey proved secure delivery, protected pre-completion message, five chapters, mute toggle, completion persistence, deletion, and invalid-link handling without unexpected browser errors. |
| Commercial assessment | PARTIAL | This is a materially more authored and visual development milestone, not a sellable production gift yet. Stronger content variation, final art/audio review, durable production persistence, identity, moderation, and production hosting remain launch blockers. |
| GitHub CI | VERIFIED WORKING | [Run 38215332944](https://github.com/isudally/playkin/actions/runs/38215332944) passed for head `656c9487b9d9049e8ba503212467107346bbdbc5`, including dependency install, tests, server tests, type checks, lint, web build, bundle scans, Chromium installation, and browser boot. |
| Deployment safety | VERIFIED SAFE / DEFERRED | [Run 38215333041](https://github.com/isudally/playkin/actions/runs/38215333041) passed; both Vercel production and preview steps were skipped. No deployment occurred. |
| Release state | READY TO MERGE | PR #6 is open and mergeable with local and GitHub checks green. This is a development milestone, not a commercial launch or production-readiness claim. |
