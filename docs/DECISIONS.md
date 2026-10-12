# Phase 0 architecture decisions

## Web-first controlled migration

The existing Expo/React Native application remains available as migration reference material. New product work targets one web-first React/TypeScript application with creator, recipient, and admin route groups. Phase 0 does not introduce a second deployed application or a new backend service.

## Server boundary

Provider credentials, payment operations, gift persistence, recipient-token issuance, uploads, moderation, and analytics belong on the server. The client may receive public configuration such as an API base URL, but it must not receive provider secrets or payment server keys.

## GameModule contract

Each game experience will implement a small host-controlled contract:

```ts
interface GameModule {
  mount(context: GameModuleContext): Promise<void> | void;
  start(): void;
  pause(): void;
  resume(): void;
  complete(): void;
  abandon(): void;
  teardown(): void;
  subscribe(listener: (event: GameModuleEvent) => void): () => void;
}
```

The host owns identity, gift state, token access, persistence, sharing, payment state, accessibility, and analytics. A module owns presentation and game interaction, and reports lifecycle events rather than owning the product shell.

## Phase 1 implementation order

Start with DOM/React modules for the first story, quiz, or memory experience. Add a canvas engine only when the selected experience needs it. Defer Babylon, A-Frame, VR/AR, multiplayer, user-generated publishing, and autonomous publishing until a measured product need exists.

## Phase 1A web foundation

The corrected Phase 1A runtime is an independent Vite React/TypeScript application under `web/`. It uses browser-native DOM elements and CSS, owns route navigation and local development preview state, and builds to `web-build` without importing the Expo/React Native app or legacy engines. The existing Expo/React Native application remains intact in `App.tsx` and `src/` as migration reference and rollback surface. The web runtime does not claim to publish gifts, issue recipient links, process payments, or generate AI content.

Existing concepts deliberately reused or adapted: the seasonal Playkin colour direction, the Dodo companion identity as clearly temporary development artwork, the gift questionnaire concept and personalisation vocabulary from `src/types/giftforge.ts`, and the existing creator/recipient product direction. The new web theme and domain contracts are self-contained so the browser bundle does not inherit React Native, Expo, navigation, or legacy engine dependencies.

## Phase 1B first playable gift

The first end-to-end slice uses a small Node HTTP service in `server/` and a replaceable JSON persistence adapter. It is intentionally local and auditable while the product validates the creator-to-recipient journey; it is not a production database or deployment plan. The service validates gift input, stores only hashes of creator and recipient secrets, issues 256-bit opaque recipient tokens with seven-day expiry, rate-limits requests, isolates recipient responses from creator credentials, records progress/completion, and supports creator-authorized deletion.

The first experience is `dodos-memory-trail`, a DOM/React GameModule with three personalized clues, scoring, progression, completion events, subscriptions, and teardown. The host owns the gift token, server persistence, and completion write; the game owns only its interaction state. The Phase 1B runtime proves the journey in a separate browser context at a mobile viewport.

Server-side AI is represented by an explicit disabled `/api/ai/suggestions` boundary. Provider credentials are not present in the client or server configuration, and no live AI capability is claimed until the provider, privacy, cost, and product contract are approved.

## Phase 1B correctness boundaries

Gift completion is first-write-wins: the first persisted score and timestamp are immutable, and client-reported scores are not treated as independently verified gameplay results. Resolving a valid recipient link records `openedAt`; creator status is exposed only through the creator token. Creators can delete gifts through the web flow, invalidating their recipient links.

Gift records expire for delivery after seven days and remain eligible for creator recovery/deletion for a defined 30-day retention window. The local service purges records beyond that window during request processing. Corrupt JSON storage fails closed with a service error; it is never silently replaced with an empty database.

The first Memory Trail is intentionally a small, three-round vertical slice. It proves the GameModule and persistence journey but is not represented as a finished premium catalogue experience. The sender message is withheld until completion; final Dodo artwork, richer game design, and broader catalogue work remain future scope.

## Phase 1C product quality and reliability

Phase 1C remains a targeted improvement to the first vertical slice, not a Phase 1B rewrite or a commercial launch claim. Creator management recovers through browser-tab `sessionStorage`, which supports refresh without putting a bearer creator token into durable browser storage. Cross-device creator recovery is deferred until a real identity/session boundary exists; silently choosing `localStorage` would broaden token exposure without solving identity, revocation, or device recovery.

The server distinguishes passive recipient-link opening (`openedAt`) from recipient interaction (`interactedAt`), and completion remains first-write-wins. Republishing rotates the recipient token but preserves a completed gift's status. Creator updates preserve completion state. The recipient UI does not reveal the message until the completion write is confirmed by the server and offers a retry path on failure.

The local JSON adapter now carries schema version 1, accepts the known unversioned migration shape, and fails closed on malformed records or unsupported versions. This is a migration seam for a later durable database; it is not production persistence. The first durable replacement should preserve ownership, retention, deletion, token hashing, and immutable completion invariants through integration tests before any hosted service is configured.

The Memory Trail improvement adds explicit feedback and progression, score feedback, reveal gating, lightweight audio, and transition states. It remains temporary product-quality work with placeholder artwork and a small catalogue scope. Premium artwork, richer authored gameplay, identity, durable persistence, moderation, live AI, payments, uploads, and operational analytics remain launch dependencies.

## Phase 1D flagship experience

The corrective implementation keeps the existing Vite runtime, server gift APIs, protected reveal, and DOM/React GameModule contract. It does not introduce a game engine or change host ownership of gift identity, token access, persistence, completion, accessibility, or analytics boundaries.

Dodo's Lantern Trail is now a scene-led five-stage adventure rather than a sequence of multiple-choice questions. The recipient discovers hidden sparks, aims a lantern beam, traces a path in order, gathers keepsakes, and assembles the final star. Stage completion increases sparks and lantern power, while the layered scene changes its sky, path, hills, stars, and lantern treatment. Pause/resume, teardown, structured progress, and completion events remain module responsibilities; the host continues to persist the completion.

The recipient route is an immersive boundary with no ordinary application navigation or Admin link. The Dodo-with-lantern illustration is prominent within the scene rather than a decorative thumbnail. The finale brings Dodo and the fully lit scene back alongside the protected personalized message. A real `Play the trail again` action resets the module without overwriting the persisted completion record, and browser evidence covers replay after reload.

The visual direction remains a night-time lantern adventure with deep indigo, warm amber, coral, and lavender accents; responsive mobile-first layout; reduced-motion support; and an explicit sound control. `web/public/dodo-lantern-companion.png` is an original development asset generated for this branch, not a third-party or franchise asset. Commercial brand approval, licensing, final art/audio, richer content variation, tamper-resistant gameplay verification, identity, durable production persistence, and production hosting remain future requirements.

This correction intentionally does not add payment, live AI, customer accounts, a durable production database, branching content infrastructure, or a large catalogue. It is a stronger development milestone and should not be described as a finished commercial flagship solely because its tests pass.
