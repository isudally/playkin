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
