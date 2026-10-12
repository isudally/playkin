# Contributing to Playkin

Playkin is an in-development **multi-game personalized gifting platform**. Begin with the [authoritative Product Vision](PRODUCT_INTENT.md), [Creative Direction](docs/CREATIVE_DIRECTION.md), [Verified Status](docs/STATUS.md) and [Documentation Guide](docs/DOCUMENTATION_INDEX.md).

This repository preserves a legacy Expo/React Native codebase as migration reference; new browser product work uses the independent Vite/React app in web/. Do not infer that historical GameForge instructions, template counts or past deployment documents represent the live product.

## Before proposing work

- Understand the distinction between the **platform vision**, verified first game and unfinished capabilities.
- Preserve genuinely different game mechanics; do not reduce Playkin to cosmetic versions of one adventure or to a generic card/quiz website.
- For artwork, supply relevant portfolio evidence, usable layered/source files, appropriate formats and full provenance and commercially required rights. See [Creative Direction](docs/CREATIVE_DIRECTION.md).
- Work only within your authorised scope. No freelancer or external reviewer has automatic access to private credentials, production accounts, repository write permissions or customer data.

## GitHub workflow

1. Open a narrowly scoped issue or discuss a proposal before significant changes.
2. Work on an isolated branch based on current main.
3. Submit a PR with a clear summary, observed tests, screenshots/recording if experience-related, and actual outstanding limitations.
4. Respect protected main and required lint-and-test CI; do not force push or bypass review.
5. Never deploy production, change secrets, configure live payments or enable AI providers without explicit authorisation.
6. Keep new web TypeScript clean and legacy diagnostic debt tracked, without hiding new errors.

## Development and verification

Refer to the [README](README.md) for local Vite web/API commands. Preserve gift creation, recipient-link privacy, completion state, replay, deletion/retention and security checks.

Run the checks relevant to your changes and distinguish local, CI and genuine browser evidence. For visually significant work, demonstrate it in the actual recipient flow on mobile and desktop; a standalone mockup is not acceptance.

**Build passing does not mean magical, fun, marketable or launch-ready.** Representative user testing and creative approval are separate gates.

## Documentation and licensing

Do not silently erase or redefine old product ideas during cleanup. Use [Documentation Guide](docs/DOCUMENTATION_INDEX.md) to distinguish legacy research from current decisions, and update current docs when facts change.

This is a public repository with a pre-existing MIT [LICENSE](LICENSE). Do not unilaterally change its licence, author credits, copyright attribution or rights to game art. Raise provenance and commercial ownership questions for owner review first.

Please report sensitive security concerns responsibly; do not publish live secrets or personal information in issues or pull requests.
