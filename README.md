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

## Browser Preview

The GitHub Pages workflow tests and builds the kiosk, then publishes the generated `dist/` directory. Its deployment URL appears in the repository's **Deployments** area and in the workflow run's `github-pages` environment. Every merge to `main` republishes the preview.

This public preview is only for development inspection. The final Android build remains locally bundled and fully offline. Do not publish personal family photographs or videos through the preview.

### Pay rule

All nine fixed lines pay left-to-right. Wild substitutes for regular symbols, never scatter. When leading wilds permit multiple results, the highest credit result wins (not symbol rank); five wilds pays 200. Line wins are added; feature line wins are doubled.

## Final reel, feature, presentation and recovery rules

The approved regular-symbol order (common to rare) is rose, fishing boat, black swan, miner's lamp, lighthouse, pelican, sunset and steelworks. Their tuned base weights are respectively **19, 16, 15, 14, 9, 4, 1.5 and 0.4**; WILD is **0.3** and scatter is **2.7** (free games use WILD **0.45**). Approved 3/4/5 awards are: rose 1/2/5, boat 2/4/8, swan 2/5/10, lamp 3/8/15, lighthouse 5/12/25, pelican 8/20/40, sunset 12/30/60 and steelworks 20/50/100. Five WILDs pays 200.

Three scatters anywhere in the visible 5×3 grid award eight free games; they need not be adjacent or on a payline, and WILD never substitutes for scatter. Every free-game line total, including WILD-assisted wins, is multiplied exactly once by two. Scatters have no cash award. Retriggers remain five with an 18-game cap.

A result is calculated, credited and saved before the passing-symbol reel strips begin, then reels land left-to-right on that saved grid. Winning lines are shown sequentially and the already-credited total counts up with synchronised synthetic Web Audio coin ticks; large totals accelerate and cap at four seconds. Reduced motion lands directly and shortens presentation. SPIN skips presentation without changing credits.

Storage schema 3 adds the displayed grid, lines and positions, status, feature accumulated win, doubled-win details, and the calculated pending result. Version 2 is migrated while preserving credits, sound, volume, reduced-motion and family preferences, and feature progress.
