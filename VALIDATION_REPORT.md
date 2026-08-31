# Primbee Gold v1 validation report — mathematical tuning

Validated on 2026-08-31. Statuses below are based only on commands actually run.

## Original result and audit

The original required run (seed `20260831`, 1,000,000 paid spins) returned **116.1489% RTP**, despite passing hit frequency (25.3810%), trigger frequency (1.2646%), small-win share (72.8182%), major-win share (0.7835%), and the 18-game cap.

A 250,000-spin audit with the original awards measured 92.5000 percentage points of RTP from paid-spin line wins and 23.2008 points from resulting free games, or 115.7008% total. Wild-containing line wins accounted for a subset of 26.1548 base-game points and 10.0256 free-game points. The run averaged 0.107512 free games per paid spin and 18.3203 credits per triggered feature.

The high RTP was not caused by duplicate payment or denominator accounting. The audit confirmed:

- the simulator calls the production `GameEngine`, so it uses the same weights, paytable, nine paylines, wild/scatter evaluation, feature state, retrigger cap, and payout multiplier as the playable game;
- each of the nine lines is evaluated exactly once and each matching sequence stops at the first non-substituting symbol;
- scatter is absent from the line paytable and wild never substitutes for it;
- paid results and free results are each added once, and engine crediting does not add returned stake to the simulator total;
- RTP denominator is exactly one credit per paid spin; free games add no wager;
- the feature multiplier is applied once by `evaluateGrid` and is not applied again to returned credits.

The root cause was therefore the aggregate expected value of the original awards across nine always-active lines, plus doubled free games—not a simulator over-count. One small configuration-linkage bug was found: the extremely rare five-wild result returned a hard-coded 200 rather than `PAYTABLE.wild[2]`. It was corrected and regression-tested. It was not a material cause of the 116% result.

## Configuration changes

Symbol weights, paylines, scatter probability, free-game probability, feature length, multiplier, and RNG are **unchanged**. Only whole-credit paytable awards changed:

| Symbol | Original 3/4/5 | Final 3/4/5 |
|---|---:|---:|
| Red rose | 1 / 2 / 5 | 1 / 2 / 4 |
| Fishing boat | 2 / 4 / 8 | 2 / 3 / 6 |
| Black swan | 2 / 5 / 10 | 2 / 4 / 8 |
| Miner's lamp | 3 / 8 / 15 | 2 / 6 / 12 |
| Lighthouse | 5 / 12 / 25 | 3 / 10 / 20 |
| Pelican | 8 / 20 / 40 | 5 / 16 / 32 |
| Lake sunset | 12 / 30 / 60 | 10 / 24 / 48 |
| Steelworks | 20 / 50 / 100 | 16 / 40 / 80 |
| Five wilds | 200 | 160 |

Smallest positive awards remain whole credits. No award was changed to zero, so payout scaling does not alter hit detection.

## Required final statistical runs

| Seed | Paid spins | Hit frequency | Trigger frequency | RTP | 1–4 share | 20+ share | Max feature | Result |
|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 20260831 | 1,000,000 | 25.3810% | 1.2646% | **95.3140%** | 84.1003% | 0.3825% | 18 | PASS |
| 20260832 | 250,000 | 25.4084% | 1.2448% | **95.0888%** | 84.0806% | 0.4455% | 18 | PASS |
| 20260833 | 250,000 | 25.4688% | 1.2628% | **96.1396%** | 84.1954% | 0.4398% | 18 | PASS |
| 20260834 | 250,000 | 25.4100% | 1.2420% | **95.6092%** | 84.0813% | 0.3764% | 18 | PASS |

All JSON reports include individual validation checks and machine-readable `PASS` status. All four simulation commands exited zero.

## RTP contribution breakdown

The required million-spin run (seed `20260831`) produced:

| Measure | Result |
|---|---:|
| Base-game line-win contribution | 76.0694% |
| Free-games contribution | 19.2446% |
| **Total RTP** | **95.3140%** |
| Base wild-related contribution (subset) | 21.0494% |
| Free-game wild-related contribution (subset) | 7.9904% |
| Average free games per paid spin | 0.107618 |
| Average free games per trigger | 8.5108 |
| Average payout per triggered feature | 15.2179 credits |

“Wild-related” means the line included at least one wild; those figures are subsets and are not added again to total RTP.

## Acceptance requirements

| Requirement | Status | Evidence |
|---|---|---|
| Simulator and game share math configuration and engine | PASS | Simulator imports and executes production engine/config. |
| RTP numerator includes paid and resulting feature awards once | PASS | Contribution totals reconcile exactly to returned credits. |
| Denominator contains paid wagers only | PASS | `totalWageredPlayCredits === spinCount`. |
| Paid hit frequency 22–26% | PASS | 25.3810–25.4688% across required runs. |
| Feature triggers 1.2–2.0% | PASS | 1.2420–1.2646%. |
| RTP 93.5–96.5% | PASS | 95.0888–96.1396%. |
| At least 70% of paid wins return 1–4 | PASS | 84.0806–84.1954%. |
| No more than 5% of paid wins return 20+ | PASS | 0.3764–0.4455%. |
| Feature cap no greater than 18 | PASS | Maximum 18 in every run. |
| No negative credit or invalid outcome | PASS | Zero invalid outcomes in every run. |
| Unit tests | PASS | 29/29 passed. |
| Production build | PASS | `npm run build` exited zero. |
| Diff whitespace validation | PASS | `git diff --check` exited zero. |

## Remaining limitations outside this focused task

The game now uses the unchanged original PNG artwork from `design-assets/`; no generated image derivatives or `dist/` build output are tracked. Browser automation, validation screenshots, offline browser-request testing, and physical-tablet performance remain untested because the earlier environment lacked the required browser/device. Android packaging remains intentionally deferred.
