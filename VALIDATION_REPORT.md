# Primbee Gold final validation — 2026-08-31

## Approved mathematics

The approved paytable is rose 1/2/5, boat 2/4/8, swan 2/5/10, lamp 3/8/15, lighthouse 5/12/25, pelican 8/20/40, sunset 12/30/60, steelworks 20/50/100 and five WILDs 200. Tuned base weights in that order are 19, 16, 15, 14, 9, 4, 1.5 and 0.4, with WILD 0.3 and scatter 2.7. Free-game WILD weight is 0.45. Scatters award no credits, three anywhere trigger eight games, retriggers add five to the 18-game cap, and all free-game line awards are doubled exactly once.

## Deterministic simulations

| Seed | Paid | Free | RTP | Paid hit | Trigger | Average length | Maximum | Average feature payout | Invalid | Duplicate lines |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 20260831 | 1,000,000 | 102,945 | 96.1148% | 24.6649% | 1.2105% | 8.5043 | 18 | 13.9907 | 0 | 0 |
| 20260832 | 250,000 | 25,331 | 95.4156% | 24.6548% | 1.1868% | 8.5376 | 18 | 13.6973 | 0 | 0 |
| 20260833 | 250,000 | 25,671 | 96.1256% | 24.7392% | 1.2048% | 8.5229 | 18 | 13.8048 | 0 | 0 |
| 20260834 | 250,000 | 25,277 | 95.7448% | 24.5392% | 1.1956% | 8.4567 | 18 | 14.0060 | 0 | 0 |

The range is approximately the requested 95% RTP, 25% hit frequency and 1.25% trigger frequency. Compared with the previous 95.3140%, 25.3810% and 1.2646% million-spin baseline, the approved higher paytable plus retuned weights produced +0.8008 percentage points RTP, -0.7161 points paid hit and -0.0541 points trigger in the million run. Seed variance puts the four RTP runs between 95.4156% and 96.1256%; reducing the WILD further could center RTP lower but would move hit frequency farther below 25%, so this is the closest tested simultaneous balance.

## Presentation and persistence

Schema 3 migrates schema 2 and persists the displayed grid, winning lines and positions, status, pending outcome, doubled-win detail, feature accumulated win and remaining games. Results are transacted and saved before sequential reel animation. Contained images, sequential static/non-colour-only win highlighting, accelerating capped count-up, synthetic volume-controlled audio and reduced-motion presentation are covered by automated tests.

Generated `dist/` remains ignored. No binary art or audio was changed. Runtime remains local and relative with no network request or `window.open()`. Browser automation, physical tablet, Android kiosk wrapper and device audio/performance remain separate manual validation requirements.

## Final polish proposal — intuitive paylines

Before implementation, the proposed complete nine-line set was documented as follows (T = top, M = middle, B = bottom):

1. `T T T T T`
2. `M M M M M`
3. `B B B B B`
4. `T M B M T`
5. `B M T M B`
6. `M T T T M`
7. `M B B B M`
8. `T M M M T`
9. `B M M M B`

The last four replace the former long steps and alternating zig-zags with four mirrored, shallow, traditional routes. The evaluator and SVG renderer continue to consume the same configured `PAYLINES` positions, and left-to-right consecutive matching remains unchanged.

## Final polish validation results

No weights, awards, RNG, scatter rules, feature rules, credit logic, storage, reel geometry, or scrolling mechanics were changed. The configured payline change produced the following deterministic results; percentage-point impacts are against the PR #5 baseline using the same seed and spin count.

| Seed | Paid spins | RTP | RTP impact | Paid hit | Hit impact | Feature trigger | Trigger impact | Small-win share | Major-win share | Maximum feature | Status |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|:---:|
| 20260831 | 1,000,000 | 96.3501% | +0.2353 pp | 24.8839% | +0.2190 pp | 1.2105% | +0.0000 pp | 78.7938% | 0.4186% | 18 | PASS |
| 20260832 | 250,000 | 95.9212% | +0.5056 pp | 24.8568% | +0.2020 pp | 1.1868% | +0.0000 pp | 78.5874% | 0.4347% | 18 | PASS |
| 20260833 | 250,000 | 96.0564% | -0.0692 pp | 24.9172% | +0.1780 pp | 1.2048% | +0.0000 pp | 78.7189% | 0.4775% | 18 | PASS |
| 20260834 | 250,000 | 95.9188% | +0.1740 pp | 24.8196% | +0.2804 pp | 1.1956% | +0.0000 pp | 78.4764% | 0.4543% | 18 | PASS |

All four runs remain within the existing validation envelope. Trigger frequency is unchanged because scatter evaluation is independent of paylines. No mathematical retuning was performed.

Each symbol now receives an individual CSS inset while retaining centred `object-fit: contain` rendering. The identical cell factory is used for passing and landed cells, so the calibration does not switch at landing. Audio now allows a 180 ms pull-to-motion transition (90 ms in reduced motion), attenuates the single reel loop after every actual reel animation completion, triggers stop cues at those completions, uses normal spin mechanics for free games, starts the win tier with the first drawn winning line, associates scatter audio with a trigger presentation, and omits the redundant small-win completion cue.

Automated rendered checks were attempted for 1280 × 800 and 1920 × 1200, but this environment does not contain Playwright/Chromium. Therefore no rendered or audible pass is claimed; physical visual calibration and audio perception remain explicitly unverified here.
