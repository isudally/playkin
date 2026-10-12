# Playkin — Creative Direction and Quality Standard

**Authority:** This document is the creative quality standard for the Playkin platform. Read it with [PRODUCT_INTENT.md](../PRODUCT_INTENT.md) (the product vision) and [docs/STATUS.md](STATUS.md) (verified implementation). It sets aspirations and acceptance criteria; it does not claim that all capabilities already exist.

## Creative north star

**Every Playkin gift should feel like entering a magical game world made especially for the recipient.** It should be visually exceptional, joyful to interact with, rewarding to replay and emotionally memorable to give. A recipient should want to show the experience voluntarily to friends or family.

Playkin is **a platform for many personalized games**. Dodo's Lantern Trail is the first implemented experience and a reference for the platform; it is not the product's limit and must not be confused with a finished game catalogue.

## Non-negotiable experience pillars

1. **Professional game art:** Cohesive illustration, atmosphere, lighting, environmental depth, high-quality characters, distinctive composition and consistent treatments across a game. Reject mismatched stock art, generic-looking visual templates, crude effects and cheap-feeling graphics, regardless of whether they were made by a person or an AI tool.
2. **Magical interactions:** The world responds to the player through purposeful animation, sound, character reactions, tactile feedback, surprise and visible environmental transformation. Decorative motion alone is insufficient.
3. **Real gameplay:** Different games should offer genuinely different mechanics, purposeful challenge, discoverable surprises and satisfying progression. Avoid equating a series of obvious questions or repetitive clicks with a compelling game.
4. **Meaningful personalization:** Recipient name, occasion, sender's message and—when properly supported—age bracket, interests, selected theme, preferences and optional media should affect scenes, challenges, narrative and reveal. Merely substituting names is insufficient.
5. **Replayability:** Variations, alternate routes, challenges, difficulty, secrets or creative outcomes should reward replay. A replay button that repeats exactly the same content is only the starting point.
6. **Gift-worthy finale:** Build anticipation and a satisfying personalized reveal. The sender should be proud of what they are gifting; the recipient should feel it was made for them.
7. **Organic sharing:** Design delightful moments worth voluntarily sharing and natural pathways to create another gift. Sharing must be opt-in, age-appropriate and privacy-preserving; no manipulative compulsion, pressure to share, or public exposure of a child's information.
8. **Cross-game reuse:** Design systems, game-ready art, character rigs, animation components and interaction patterns should support future titles and themes without making every game feel identical.

## Quality is both artistic and interactive

A visually magnificent static illustration is not enough. Likewise, a technically playable interaction with weak visuals is not enough.

Review both the **recipient experience** and the **creator experience**: choosing a game, personalizing it, previewing, gifting, opening on a mobile device, exploring, completing, replaying and optionally inspiring another gift. The whole journey should feel premium.

Accessibility is part of craft: touch-first and keyboard-operable interactions, readable text, sufficient contrast, reduced-motion alternatives, explicit sound controls and graceful performance on ordinary mobile devices.

## Platform-wide art direction

Establish a recognizable Playkin identity without forcing a single character or art style into every game. Dodo can be a recurring companion, mascot or guide where appropriate. Different games may use other worlds, characters and mechanic families while sharing a consistent level of execution.

Game examples for future exploration include illustrated adventure, skill/reaction, puzzle, exploration, creative and educational play. **These are possible game families, not a claim that a catalogue exists today and not a frozen implementation order.**

Any broadening of age or content themes should be grounded in audience research and appropriate child safety considerations. Do not use unlicensed franchise characters, likenesses or artwork.

## Creative commission and freelancer handoff

We may ask artists, animators, game designers or studios for suggestions. Do **not** assume we are commissioning a complete platform redesign, a replacement frontend or only artwork for Dodo's Lantern Trail.

For each proposed engagement, require:

- A concise explanation of the specific existing weakness being addressed and how it advances the **multi-game platform**.
- Clearly bounded deliverables and a plausible production timeline at the quoted price, including any stronger optional package priced separately.
- Actual relevant portfolio evidence, not generic promises or unsupported technical/creative claims.
- Editable native source files **and** game-ready exported assets as appropriate (e.g., separate foreground/background layers, transparent character poses, sprite sheets or approved animation format). A single flat image is not enough where interactivity requires separate layers.
- Mobile/desktop composition guidance, dimensions, performance considerations and animation states where relevant.
- An explicit statement of asset provenance, third-party dependencies, generative-AI involvement, permissible commercial use and the rights/license provided. Obtain the necessary agreement **before** commissioning or incorporating work.
- Reviewable acceptance criteria and a reasonable revision arrangement.

Pay for **quality and usable reuse value**, not merely asset count or the lowest quote. A small excellent demonstrator can justify further work; high prices alone are not proof of quality. The internal development team remains responsible for engineering/integration unless explicitly agreed otherwise.

## Acceptance tests for a creative milestone

1. Does the actual integrated game feel magical and professionally produced on mobile, not just in promotional mockups?
2. Are visuals, character movement, feedback, audio and scene transitions coherent?
3. Does the player **do** something enjoyable that changes the experience, beyond tapping through scripted text?
4. Is the gift materially personalized, age-appropriate and emotionally satisfying?
5. Is there authentic replay or share-worthy value, without coercive engagement tricks?
6. Can usable, correctly licensed creative assets be reused across relevant future Playkin games?
7. Do browser recordings, screenshots and representative human playtests support the claimed quality?
8. Are any unfinished placeholders explicitly labelled as such?

**A successful build or a green CI run proves technical behavior, not commercial-grade artwork, delight or willingness to pay.**

## Current evidence versus target

See [Phase 1D evidence](evidence/phase1d/README.md) for the existing Dodo's Lantern Trail. The five distinct mechanics, gifting flow and replay demonstrate the platform's first development milestone. The current game still needs richer variation, final commercial art/audio review and human validation before it can satisfy all of the standards above.

No single creative milestone should silently downgrade, replace or narrow the broader Playkin vision.
