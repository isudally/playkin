# Playkin

**Create a game. Make someone's day magical.**

Playkin is a platform for **creating, personalizing and gifting playable games**, beginning with birthdays. A gift-giver chooses a game, adapts it for someone special and sends a private playable link. The recipient enters an illustrated world, plays, progresses and unlocks a personal reveal.

**Playkin is a multi-game platform in development—not a single Dodo game and not a generic birthday-card or quiz website.**

## Start here

- [Product Vision — authoritative](PRODUCT_INTENT.md): what we are ultimately building.
- [Creative Direction and Quality Standard](docs/CREATIVE_DIRECTION.md): exceptional game art, genuinely engaging play, magic, replayability, thoughtful personalization and reusable assets.
- [Verified Implementation Status](docs/STATUS.md): what works, what is incomplete and what remains a launch blocker.
- [Architecture Decisions](docs/DECISIONS.md): approved implementation boundaries and historical choices.
- [Documentation Guide](docs/DOCUMENTATION_INDEX.md): how to interpret legacy GameForge research and older plans.

These sources deliberately distinguish **ambition from verified implementation**. They supersede historical claims in old migration, feature, deployment or agent documents.

## What exists today

Playkin has a verified **browser-native React/TypeScript web application** (under web/) and a first-slice **Node gift service** (under server/). The developer-facing flow supports validated gift creation, opaque expiring recipient links, distinct open/interaction tracking, client-reported completion and replay. The first implemented game, **Dodo's Lantern Trail**, offers five interaction stages: discover sparks, aim a lantern, trace a path, collect keepsakes and assemble a star.

This is a **development milestone, not a commercially launched product**. The existing gift service uses a local versioned JSON store, not a production database. There is no production deployment or live AI/payment integration; cross-device account recovery, moderation and a multi-game catalogue remain outstanding. Dodo development art needs final commercial-quality review and asset-rights confirmation.

See [Phase 1D screenshots and recorded Chromium run](docs/evidence/phase1d/README.md) for real, recorded prototype behavior, **not finished marketing assets**.

The previous Expo / React Native GameForge implementation remains under App.tsx and src/ as **legacy migration reference**, not the target web architecture.

## Run locally (development only)

Use the pinned Node / npm toolchain from .nvmrc and package.json. Install dependencies with the checked-in lockfile:

    npm ci

In one terminal start the local API:

    npm run api:dev

In a second terminal start the independent Vite web app (which proxies /api to the local server):

    npm run web:dev

Checks used in the repository:

    npm test -- --runInBand
    npm run test:server
    npm run verify:types:web
    npm run verify:types
    npm run lint
    npm run build:web
    npm run verify:web-bundle
    npm run verify:client-bundle
    npm run verify:browser

Browser smoke testing requires a fresh web export and Chromium. The legacy TypeScript gate tracks known debt separately; new web code has a clean type check. No local development instructions here constitute production deployment approval.

## Building additional Playkin games

Do not copy Dodo's Lantern Trail five times with new colors or names. New games should offer **distinct, meaningful gameplay** and use the existing GameModule boundary where suitable.

Keep gift creation, secure delivery, customer data, entitlements and status as shared platform concerns. Preserve each game's own authored mechanics and art direction. Reuse high-quality animation, scene elements, accessibility patterns and appropriately licensed assets wherever that actually improves the result.

Before commissioning or merging creative work, refer to [Creative Direction](docs/CREATIVE_DIRECTION.md). An artist's deliverables must be explicit, game-ready and supported by suitable commercial rights and source files. A freelancer reviewing this public repository **has not been granted implementation authority or GitHub write access**.

## Working with historical documentation

This repository evolved from a project called GameForge. Many old files describe proposed features, older architectures and earlier completion claims (for example, multiple templates, live AI, VR/AR, automatic Vercel deployment). These are **not proof of current capability**.

They are retained for research and possible future reuse. Consult [Documentation Guide](docs/DOCUMENTATION_INDEX.md) and [Verified Status](docs/STATUS.md) instead of assuming old features are delivered.

## Public repository and licensing

The repository is public and currently carries an **MIT LICENSE**, with a historical GameForge copyright notice. That licence permits broad reuse of covered code subject to its terms. Public visibility or inclusion of an asset in this repository does not itself prove the right to sublicense every asset or confer exclusive commercial ownership.

**Commercial brand, contributor and artwork ownership/licensing require separate owner review.** Do not rewrite or remove existing copyright/license terms without a proper provenance and rights assessment.

## Project controls

Protected main branch, pull requests, CI verification and manual production deployment authorisation are part of the workflow. Passing CI or merging a milestone does not imply commercial launch readiness.

For contributions, read [CONTRIBUTING.md](CONTRIBUTING.md). For the actual verified baseline, use [STATUS.md](docs/STATUS.md).
