# Playkin — Documentation Guide and Source of Truth

The repository contains historical GameForge plans, prototypes, migration records and more recent Playkin implementation evidence. These have **different purposes**. Do not treat an old implementation guide or a past completion claim as the current product direction.

## Authoritative documents (read in this order)

| Document | Purpose |
| --- | --- |
| [Product Vision](../PRODUCT_INTENT.md) | **What Playkin is being built to become:** a premium platform for many personalized gaming gifts. Product intent must not be narrowed to one game or a generic app. |
| [Creative Direction](CREATIVE_DIRECTION.md) | **Required product quality:** magical, professional visuals, real gameplay, meaningful personalization, replayability, reuse and ethical organic sharing. Also freelancer/art handoff principles. |
| [Verified Status](STATUS.md) | **What actually works today**, what is only a development prototype, and what remains unimplemented or commercially blocked. |
| [Decisions](DECISIONS.md) | Established technical choices, boundaries and the record of why earlier options were chosen. |
| [README](../README.md) | Accurate public overview, basic local development and links to the documents above. |

If an older document contradicts the current vision, status or approved decisions, do not silently accept the older claim. Preserve potentially valuable ideas and propose explicit changes for owner review.

## Historical / reference material

Legacy documents may contain valuable research, game concepts, aesthetic references, art styles and product ideas. They are **retained as reference**, not silently discarded.

Examples include:
- The earlier GameForge product, feature and ecosystem plans (ALCHEMIST_FEATURES.md, FORGE_CHIEF_PRODUCT_ANALYSIS.md, UNIFIED_ECOSYSTEM.md, GAMEFORGE-era architecture and proposal documents).
- Earlier visual ideas in [design/aesthetic-brief.md](../design/aesthetic-brief.md) and [docs/ART_STYLES.md](ART_STYLES.md). These are inspiration, not proof that every style or animation is implemented.
- Older setup, deployment, VR/AR, AI, marketing and agent documentation. Statements such as “fully implemented”, “automatically deployed”, “15 complete templates”, or “AI enabled” must be re-verified against active code and CI, not repeated as current facts.
- [Phase 1D visual evidence](evidence/phase1d/README.md), which documents a verified development experience but is not a commercial-quality sign-off.

**Retaining the historical files does not restore old architectures or authorize implementation of every proposed feature.** Use them to discover ideas that serve the current vision.

## Current engineering boundary (high level)

- Browser-native React/TypeScript Vite application: web/.
- Current gift service and replaceable local JSON persistence: server/.
- Older Expo/React Native implementation: App.tsx and src/ (migration reference and regression baseline).
- Current first experience: web/game/memory-trail.ts (Dodo's Lantern Trail).
- The hosting, durable database, real customer accounts, payments, live AI, moderation and a multi-game catalogue are **not** commercially ready; see STATUS.md for precise boundaries.

## Public repository and rights review

This repository is presently public and has an existing MIT LICENSE with a historical “GameForge Team” copyright notice. MIT grants broad reuse rights over covered material and is **not equivalent to a confidentiality agreement, exclusive ownership or a guarantee of rights to every asset**.

The owner must separately review software and asset provenance, copyright attribution, contributors' rights, and the desired commercial licensing/ownership policy. **Do not edit, replace or remove the LICENSE or retroactively claim exclusivity as part of routine documentation work.**

Freelancers may inspect public material without receiving credentials or GitHub write access. New commissioned assets need clearly documented rights, editable source deliverables and provenance before integration.

## Governance

- Product vision and commercial scope changes require the owner's approval.
- Technical implementation work follows branch protection and CI; no automatic production deployment.
- A coding milestone marked complete is not the same as product-market validation or launch approval.
- Do not delete or rewrite historical documentation at scale merely to make the repository look cleaner.
