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
