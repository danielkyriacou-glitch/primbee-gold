# Primbee Gold v1

A completely offline, non-commercial five-reel play-credit game based on the MIT-licensed `HorrellTech/slots-js`. It uses the ten supplied Illawarra images and contains no payments, accounts, advertising, analytics, or network runtime.

## Inherited architecture and v1 refactor

The fork arrived as a single global `SlotMachine` class (`slot-machine.js`) combining Canvas rendering, theme/symbol data, probability controls, betting, audio, free spins, and UI callbacks; `index.html`, `styles.css`, and a separate help-modal pair supplied the presentation. V1 retains the foundation's five-by-three concept, staggered-stop timing, nine line patterns, and sequential win-display concept while replacing money/bet controls and generic themes.

The new architecture is separated into `src/config` (symbols, weights, paytable, nine fixed lines), `src/engine` (injectable RNG, outcomes, wild and feature rules), `src/render`/`src/app.js` (responsive DOM reels and animation), `src/audio` (local Web Audio hierarchy), and `src/storage` (versioned persistence). A future Hold and Spin feature should implement the same feature-state contract beside `GameEngine.feature` and be orchestrated by `src/app.js`, without changing base evaluation.

## Plan implemented

1. Preserve licence and attribute the foundation.
2. Separate deterministic engine/config/storage from the responsive UI.
3. Integrate and preload supplied art; implement blue base and gold free-game modes.
4. Add unit, simulation, build, browser-validation scaffolding and evidence reports.

## Commands

```bash
npm test
npm run simulate -- --spins 1000000 --seed 20260831
npm run build
npm run serve
# open http://localhost:4173
```

The game and generated build use the original tracked PNG artwork directly from `design-assets/`. `npm run build` copies that directory into ignored `dist/` output. The optional `scripts/optimise-assets.py` utility is retained for future asset work but its generated derivatives are not tracked or used by v1. Production randomness uses `crypto.getRandomValues`; only tests/simulation use seeded RNG. If Web Crypto is absent, the documented fallback is `Math.random`.

### Pay rule

All nine fixed lines pay left-to-right. Wild substitutes for regular symbols, never scatter. When leading wilds permit multiple results, the highest credit result wins (not symbol rank); five wilds pays 160. Line wins are added; feature line wins are doubled.
