# Phase 0 architecture decisions

## Web-first controlled migration

The existing Expo/React Native application remains available as migration reference material. New product work targets one web-first React/TypeScript application with creator, recipient, and admin route groups. Phase 0 does not introduce a second deployed application or a new backend service.

## Server boundary

Provider credentials, payment operations, gift persistence, recipient-token issuance, uploads, moderation, and analytics belong on the server. The client may receive public configuration such as an API base URL, but it must not receive provider secrets or payment server keys.

## GameModule contract

Each game experience will implement a small host-controlled contract:

```ts
interface GameModule {
  load(input: GameModuleInput): Promise<void>;
  start(): void;
  pause(): void;
  resume(): void;
  complete(): void;
  abandon(): void;
  destroy(): void;
}
```

The host owns identity, gift state, token access, persistence, sharing, payment state, accessibility, and analytics. A module owns presentation and game interaction, and reports lifecycle events rather than owning the product shell.

## Phase 1 implementation order

Start with DOM/React modules for the first story, quiz, or memory experience. Add a canvas engine only when the selected experience needs it. Defer Babylon, A-Frame, VR/AR, multiplayer, user-generated publishing, and autonomous publishing until a measured product need exists.

## Phase 1A web foundation

The web migration is incremental: `App.tsx` selects the new web shell only for the web platform, while the existing Expo/React Native navigator remains available on native targets as migration reference and rollback surface. The Phase 1A shell owns route navigation and local development preview state; it does not claim to publish gifts, issue recipient links, process payments, or generate AI content.

Existing concepts deliberately reused or adapted: seasonal theme tokens from `src/design-tokens/theme.ts`, the Dodo companion identity as clearly temporary development artwork, the gift questionnaire concept and personalisation vocabulary from `src/types/giftforge.ts`, and the existing creator/recipient product direction. Native screens and provider integrations were not copied into the web bundle.
