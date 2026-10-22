@AGENTS.md

## Styling
- Shared tokens, element defaults and reusable classes live in `packages/bndl/src/styles/`. `app/globals.css` only imports `bndl/styles.css` and holds app-only layout tokens (`--nav-width`, `--content-max-width`).
- Component-specific styling goes in that component's `.module.css`, built on the tokens.
