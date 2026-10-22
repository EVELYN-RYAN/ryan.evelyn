# BNDL

## Package
- BNDL never imports from `@/` or anything else in the app; it must stay self-contained so it can move to its own repo.
- Components do not import global CSS. The consuming app imports `bndl/styles.css` once at its root (`app/globals.css`).
- Public API is whatever `src/index.ts` exports; add new components and types there.

## Styles (`src/styles/`)
- `index.css` import order is the cascade: tokens → base → utilities → rim → glass → state effects. State effects must come after `glass.css` so they win at equal specificity.
- Every `-rgb` token (`--accent-green-rgb`, `--danger-rgb`, `--neutral-rgb`, …) is an `r, g, b` triplet for `rgba(var(--x), a)` and must match its hex counterpart in both the dark `:root` and `[data-theme="light"]` blocks.
- Light theme is opt-in via `<html data-theme="light">`. Font tokens read `--font-orbitron` / `--font-space-grotesk` / `--font-jetbrains-mono`, which the app provides through next/font in `app/layout.tsx`.
- `--bg`, `--bg-2`, `--bg-3` step up in opacity so stacked surfaces read as thicker glass; nest higher steps inside lower ones. `--bg-solid` is also the text color on accent fills.
- `rim.css` owns `::before` on `.rim`, `.glass` and every state class. A new border-state class must be added to both selector lists in `rim.css`, and these classes can't use `::before` for anything else.
- `--glass-mint` / `--glass-lime` are registered with `@property` (`<number>#`) so they interpolate. State effects recolor glass by overriding these two variables, not by restyling glass.
- The `@supports (background-image: paint(id))` block in `glass.css` is a Chromium-only proxy: only Chromium supports `url()` filters in `backdrop-filter`, and elsewhere the whole declaration would drop, losing the blur. The refraction needs `<LiquidGlassFilter />` rendered once in the app.
- State effects (`.loading`, `.error`, `.pulse`, `.canceled`) are triggered by class only, never `[aria-busy]`, so unrelated busy regions don't get borders.
- No per-effect reduced-motion rules: `base.css` already stops all animations under `prefers-reduced-motion`, and each effect must still read correctly as a static frame.
- `.loading` chases counter-clockwise (the angle animates to a negative value). `.canceled` is deliberately neutral grey, not red — the user chose it; it isn't a failure.
- `.pulse` sets `animation` on the element itself, replacing any animation the element already has.

## Button
- `status` is controlled by the parent. The button only displays `'ready'` after the `resetAfter` timer fires for the current status; any new status from the parent clears that.
- While loading, the button uses `aria-disabled` instead of `disabled` so keyboard focus isn't lost; clicks are swallowed (or call `onCancel`).
- All labels are stacked in one grid cell (inactive ones `visibility: hidden`) so the width never jumps between statuses.
- The cancel overlay toggles `opacity`, not `visibility`, so "Cancel" stays in the accessible name while loading.
- Status announcements live in a visually hidden `aria-live` region beside the button; live regions inside a button are read unreliably.
- Variants and sizes are intentionally commented out until they're designed.
