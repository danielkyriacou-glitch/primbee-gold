# Exact build prompt: Primbee Gold v1

Copy everything below this line into the coding agent that will build the first game.

---

## Role and outcome

You are a senior HTML5 game engineer and Android packaging engineer. Build a polished, completely offline, non-commercial poker-machine simulator called **Primbee Gold** for an older Australian player. It must feel recognisably contemporary and enjoyable, but it must not reproduce manipulative gambling mechanics.

The final outcome is one production-quality game that:

- runs smoothly in landscape fullscreen on an Android tablet of at least 11 inches;
- works with no internet connection after installation;
- uses only play credits and can never accept, purchase, withdraw or represent real money;
- has one obvious player action during normal play: a large `SPIN` button;
- uses the supplied Primbee, Lake Illawarra and Wollongong artwork;
- is statistically validated, visually tested and packaged for a real tablet test.

Do not merely create a mock-up. Implement the working game, test it, package it and report evidence against every acceptance criterion.

## Authorised open-source foundation

Use the MIT-licensed project below as the starting foundation:

- Repository: `https://github.com/HorrellTech/slots-js`
- Live reference: `https://horrelltech.github.io/slots-js/`
- Relevant existing components: HTML5 Canvas reel rendering, five-reel and three-row configuration, staggered reel stops, multiple paylines, win highlighting, configurable symbols and probabilities.

Before modifying anything:

1. Clone or copy the repository into a new project folder named `primbee-gold`.
2. Inspect its current code and licence.
3. Confirm that the repository still contains an MIT licence.
4. Preserve its `LICENSE` file and add a short source attribution to `THIRD_PARTY_NOTICES.md`.
5. Reuse its useful reel animation and payline logic, but replace its existing interface, symbols, betting controls and game mathematics.

Do not use assets, sounds or code from commercial poker machines. Do not scrape artwork from Aristocrat, Light & Wonder or another manufacturer.

## Supplied artwork

Use these ten supplied transparent PNG assets. Copy them into a clearly named project asset directory and generate optimised WebP derivatives for runtime use. Keep the PNG originals.

| File | Game role | Accessible label |
|---|---|---|
| `steelworks.png` | Highest regular symbol | Port Kembla steelworks |
| `lake-illawarra-sunset.png` | High regular symbol | Lake Illawarra sunset |
| `pelican.png` | High regular symbol | Lake Illawarra pelican |
| `wollongong-lighthouse.png` | Medium regular symbol | Wollongong lighthouse |
| `miners-lamp.png` | Medium regular symbol | Miner's lamp |
| `black-swan.png` | Lower regular symbol | Black swan |
| `fishing-boat.png` | Lower regular symbol | Lake Illawarra fishing boat |
| `red-rose.png` | Lowest regular symbol | Red rose |
| `wild-molten-steel.png` | Wild symbol | Molten steel wild |
| `free-three-pelicans.png` | Scatter and free-games trigger | Three pelicans free-games symbol |

Runtime derivatives must:

- be 512 by 512 pixels;
- preserve transparency;
- use WebP unless the target WebView fails a verified compatibility test;
- use `object-fit: contain` or the Canvas equivalent so no symbol is cropped;
- be preloaded before the start screen is enabled;
- have no words baked into the bitmap. Add `WILD` and `FREE` as crisp interface overlays.

## Theme and art direction

The game theme is **Primbee Gold**. It should evoke looking from Primbee across Lake Illawarra toward the industrial and natural landscape.

Use:

- deep lake blue and teal for normal play;
- warm gold and molten orange for highlights;
- a subtle Illawarra escarpment silhouette;
- Lake Illawarra reflections and restrained water movement;
- the steelworks glow in the distance;
- high contrast cream reel panels so every transparent symbol remains readable.

Avoid clutter behind the reels. The artwork must remain legible at speed and at arm's length on an 11-inch screen.

## Eight design requirements

Implement the seven contemporary design pillars below, plus the accessibility control in requirement eight.

### 1. Five reels, three rows and fixed paylines

- Display exactly five reels and three visible symbols per reel.
- Use nine fixed paylines: three horizontal, two diagonals, two V shapes and two shallow zigzags.
- All nine lines are always active.
- Do not expose line selection, denomination selection or bet-per-line controls.
- A normal spin costs exactly one play credit in total.
- Winning symbols must brighten and pulse while all non-winning symbols dim slightly.
- If several lines win, highlight them sequentially and then together.

### 2. Coherent familiar theme

- Use only the supplied Primbee Gold symbols.
- Make the steelworks, lake and pelicans the central identity.
- Use the lighthouse and miner's lamp as supporting Wollongong and Illawarra references.
- Do not introduce generic fruit, playing cards, dollar signs, banknotes or casino imagery.

### 3. Anticipatory reel movement

- Determine the complete result before animation starts.
- Reels must accelerate quickly and stop from left to right.
- Initial target stop timings are 650, 820, 990, 1,160 and 1,330 milliseconds.
- Add small natural easing and a clean stop bounce without making the interaction slow.
- A final-reel slowdown may occur only when that spin will genuinely trigger free games.
- Do not manufacture or repeatedly display false near misses.
- Ignore input while a spin is resolving so rapid taps cannot create overlapping spins.

### 4. Truthful audiovisual hierarchy

Use four clearly different response levels:

1. No win: quiet reel-stop sounds only.
2. Standard win of 1 to 4 credits: short chime, winning line and gentle symbol pulse.
3. Strong win of 5 to 19 credits: brighter animation, short count-up and a richer musical phrase.
4. Major win of at least 20 credits or a free-games trigger: fullscreen but time-limited celebration, gold particles and distinctive music.

Rules:

- Never celebrate a return lower than the one-credit spin cost as a win.
- Prefer a paytable where the smallest winning outcome returns at least one credit.
- Do not use a jackpot display, fake progressive amount or life-changing-prize language.
- Create original sound with the Web Audio API or bundle locally stored, appropriately licensed sound files with attribution.
- No sound may depend on a network request.
- Provide one visible sound on/off control.

### 5. Free games as a distinct second mode

- Three or more `free-three-pelicans` scatter symbols anywhere on the visible grid trigger eight free games.
- Scatter symbols do not need to sit on a payline.
- Show a clear `8 FREE GAMES` overlay and require one press of `START`.
- During free games, change the whole screen from lake blue to a rich sunset-gold palette.
- Display `FREE GAME X OF 8` prominently.
- Increase the wild-symbol probability moderately during free games.
- Multiply line wins by two during free games.
- Three or more scatter symbols during the feature add five more games.
- Cap the total feature at 18 games so the sequence cannot become open-ended.
- Free games may run automatically one at a time, with at least 1.2 seconds to understand each result and a visible `PAUSE` control.
- Return clearly to the normal blue game after the feature summary.

### 6. Contemporary feature architecture, with Hold and Spin deferred

Do not implement Hold and Spin in version one. Version one must first prove the base game and free-games experience.

However, separate the game engine, renderer and feature state cleanly so a future Hold and Spin module can be added without rewriting the base game. Add a short architectural note to the README identifying the extension point.

### 7. Frequent but understandable results

The mathematical target is based on complete spins, not individual paylines.

- Target paid-spin hit frequency: 22% to 26%, with a design target of 24%.
- A hit means the spin returns at least one credit or starts free games.
- Target free-games trigger frequency: between 1.2% and 2.0% of paid spins, approximately once every 50 to 80 spins.
- Target simulated return to player: 93.5% to 96.5%, including the expected value of free games.
- Target volatility: low to medium.
- At least 70% of winning paid spins should return 1 to 4 credits.
- No more than 5% of winning paid spins should return 20 or more credits.
- Each spin must be independent. Previous results must not alter future odds.
- Use explicit per-reel symbol weights or reel strips and a transparent paytable. Do not force wins after losses, compensate for earlier outcomes or secretly adjust odds during a session.

Start with this paytable, then tune symbol weights rather than changing the experience arbitrarily:

| Symbol | 3 on line | 4 on line | 5 on line |
|---|---:|---:|---:|
| Red rose | 1 | 2 | 5 |
| Fishing boat | 2 | 4 | 8 |
| Black swan | 2 | 5 | 10 |
| Miner's lamp | 3 | 8 | 15 |
| Wollongong lighthouse | 5 | 12 | 25 |
| Pelican | 8 | 20 | 40 |
| Lake Illawarra sunset | 12 | 30 | 60 |
| Port Kembla steelworks | 20 | 50 | 100 |
| Five wilds | not applicable | not applicable | 200 |

The wild substitutes for every regular symbol but not for the free-games scatter. If a line begins with one or more wilds, pay it as the highest valid left-to-right combination produced by those wilds. Document the tie-breaking rule and test it.

### 8. One obvious action and accessible controls

- Provide one very large `SPIN` button centred below the reels.
- Minimum touch target: 72 pixels in both dimensions; target 96 pixels for `SPIN`.
- Use large high-contrast text and never rely on colour alone.
- Keep the meters limited to `PLAY CREDITS`, `LAST WIN` and `FREE GAMES`.
- Hide family settings behind a five-second press in the top-left corner.
- Family settings may control starting credits, sound level, reduced motion, reset and fullscreen.
- Do not expose mathematical odds or bet controls in the normal player view.
- Respect `prefers-reduced-motion` and provide a reduced-motion family setting.

## Play-credit screen

On first launch, and whenever credits reach zero, show a simple full-screen refill panel with three large buttons:

- `ADD 10 PLAY CREDITS`
- `ADD 20 PLAY CREDITS`
- `ADD 50 PLAY CREDITS`

Use coloured arcade-style cards. Do not display or imitate Australian banknotes. Do not use `$`, `AUD`, `cash`, `deposit`, `buy`, `withdraw` or `purchase`. Adding play credits is free and unlimited.

Persist credits, sound preference and an interrupted free-games state locally so an accidental app restart does not corrupt the game. A family reset must restore the initial state.

## Harm-minimisation exclusions

Do not implement:

- real money, purchases, ads, accounts, analytics or external links;
- losses disguised as wins;
- deliberate near-miss engineering;
- unlimited autoplay;
- a gamble or double-up feature;
- credit loans or negative balances;
- dynamic odds based on play history;
- fake progressive jackpots;
- urgency messages, countdowns or prompts to keep playing;
- public leaderboards, social pressure or daily rewards.

The app must clearly identify itself in family settings as an offline play-credit simulator.

## Code architecture

Refactor the inherited project into these separable concerns, adjusting filenames to fit the existing repository where sensible:

- `src/config`: symbols, paytable, reel weights, paylines and feature parameters;
- `src/engine`: RNG injection, outcome generation, payline evaluation, wild handling and free-games state;
- `src/render`: Canvas or DOM rendering, animation and responsive layout;
- `src/audio`: offline sound generation and volume control;
- `src/storage`: versioned local persistence with safe defaults;
- `scripts/simulate`: deterministic Monte Carlo validation;
- `tests`: unit, integration and browser tests.

Requirements:

- Production RNG should use `crypto.getRandomValues` when available, with a documented fallback.
- Tests and simulations must allow injection of a seeded deterministic RNG.
- Keep all configuration in readable data structures, not scattered magic numbers.
- No runtime CDN, remote font, remote image, analytics or API dependency.
- Use semantic controls and appropriate ARIA labels even though the primary experience is visual.
- Do not swallow unexpected errors. Surface an asset-loading failure before play starts.

## Responsive tablet layout

Optimise and test primarily for landscape tablets:

- 1,280 by 800;
- 1,920 by 1,200;
- 2,000 by 1,200 if supported by the test environment.

Also verify that the game remains usable at 1,024 by 600.

Acceptance requirements:

- reels consume most of the available screen;
- all three rows are fully visible;
- no page scrolling;
- no symbol clipping;
- no controls obscured by Android navigation or display cut-outs;
- the game remains readable at normal arm's-length tablet distance;
- orientation changes cannot leave the app in a broken intermediate layout.

## Android packaging

After the browser game passes all tests, package the built static files inside a minimal Android WebView wrapper, preferably Capacitor unless the environment already contains a simpler maintained wrapper.

Android requirements:

- landscape orientation;
- immersive fullscreen;
- all assets bundled in the application;
- no `INTERNET` permission unless the build system requires it and its removal is demonstrably impossible;
- no WebView navigation to external URLs;
- no analytics SDK;
- keep the screen awake while the game is active;
- preserve local storage across normal app restarts;
- produce a debug APK suitable for sideloading onto the test tablet.

If the Android SDK is unavailable, do not claim an APK was validated. Deliver the tested offline web build and precise Android build commands, clearly marking the APK step as outstanding.

## Required validation

### A. Unit tests

Test at minimum:

- every one of the nine paylines;
- three-, four- and five-symbol wins;
- wild substitution at each reel position;
- a line beginning with multiple wilds;
- all-wild handling;
- scatters not being substituted by wilds;
- three scattered pelicans triggering exactly eight free games;
- two pelicans not triggering free games;
- free-game retrigger and 18-game cap;
- double payouts during free games;
- credits deducting only on paid spins;
- refill choices adding exactly 10, 20 or 50 play credits;
- saved state recovery and family reset.

### B. Statistical simulation

Create a command such as `npm run simulate -- --spins 1000000 --seed 20260831`.

Run at least 1,000,000 paid spins and output a machine-readable JSON report containing:

- seed and spin count;
- paid-spin hit frequency;
- free-games trigger frequency;
- total wagered play credits;
- total returned play credits, including free games;
- calculated RTP;
- distribution of wins by credit range;
- symbol frequency by reel;
- wild frequency;
- scatter frequency;
- average number of free games per trigger;
- maximum feature length;
- confidence intervals where practical.

The automated validation must fail if:

- hit frequency is outside 22% to 26%;
- free-games triggers are outside 1.2% to 2.0%;
- RTP is outside 93.5% to 96.5%;
- the 18-game feature cap is exceeded;
- any negative credit or invalid outcome occurs.

Do not tune against a single lucky seed. Run at least three additional seeds at 250,000 spins each and report their results.

### C. Browser integration tests

Use Playwright or the repository's established browser-testing tool to verify:

- the game loads with no console errors;
- all ten runtime images finish loading;
- `SPIN` produces exactly one resolved outcome;
- repeated rapid taps do not overlap spins;
- the credit meter changes correctly;
- the free-games overlay, colour transformation and counter work;
- sound can be disabled;
- family settings require the long press;
- state survives a page restart;
- the app works with network access blocked after initial local launch;
- there are zero unexpected network requests.

### D. Visual validation

Capture screenshots at 1,280 by 800 and 1,920 by 1,200 for:

1. play-credit screen;
2. normal game;
3. standard win;
4. free-games start overlay;
5. active free game;
6. family settings.

Inspect the screenshots, not just their existence. Confirm:

- no clipped symbols or text;
- consistent symbol scale;
- readable status meters;
- obvious `SPIN` button;
- adequate contrast;
- normal mode is visibly blue;
- free-games mode is unmistakably gold;
- the steelworks and molten-steel wild remain distinguishable;
- the single pelican and three-pelican scatter remain distinguishable.

### E. Offline and performance validation

- Load the production build with the browser placed offline.
- Confirm every game function remains available.
- Confirm there are no remote font, image, script, audio or analytics calls.
- Keep the complete production web bundle under 5 MB unless a larger size is justified with measured evidence.
- Measure input response and animation smoothness on the actual tablet if available.
- Target a stable 60 frames per second during reel movement and no prolonged main-thread task over 100 milliseconds.
- Record any actual-device limitation rather than concealing it.

### F. Android validation

If an APK can be built and the tablet is available:

- install the APK by USB or approved sideloading method;
- launch in airplane mode;
- complete at least 50 manual spins;
- trigger free games through a test-only deterministic mode, then disable that mode in the production build;
- close and reopen the app to verify persistence;
- rotate or lock orientation and verify recovery;
- check sound, fullscreen and touch targets;
- report the exact device model, Android version and build identifier tested.

Never leave a deterministic outcome control accessible in the player build.

## Completion checklist and deliverables

Do not declare the task complete until the following exist:

- complete editable source;
- preserved MIT licence and third-party notice;
- supplied PNG originals and optimised runtime derivatives;
- production web build;
- working unit and browser tests;
- deterministic million-spin simulation script;
- statistical JSON report;
- validation screenshots;
- `README.md` explaining development, build, configuration and test commands;
- `TABLET_INSTALL.md` with step-by-step Android installation and offline-use instructions;
- debug APK if the environment can build and validate it;
- a concise validation report listing every acceptance criterion as `PASS`, `FAIL` or `NOT TESTED`, with evidence.

At handoff, lead with what is working. Then identify any failures or untested steps plainly. Do not claim actual-tablet performance, offline behaviour or APK installation unless it was genuinely tested.

---

End of build prompt.
