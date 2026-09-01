import fs from 'node:fs';
import { GameEngine } from '../src/engine/game-engine.js';
import { seededRng } from '../src/engine/rng.js';
import { FEATURE } from '../src/config/game.js';

const argument = name => {
  const index = process.argv.indexOf(`--${name}`);
  return index < 0 ? undefined : process.argv[index + 1];
};
const spins = Number(argument('spins') || 1_000_000);
const seed = Number(argument('seed') || 20260831);
const engine = new GameEngine({ rng: seededRng(seed), credits: spins + 1 });
const symbolCounts = Array.from({ length: 5 }, () => ({}));
const contribution = {
  baseLineCredits: 0,
  baseWildLineCredits: 0,
  freeGameLineCredits: 0,
  freeGameWildLineCredits: 0
};
let hits = 0;
let triggers = 0;
let winCount = 0;
let major = 0;
let small = 0;
let freeGames = 0;
let maxFeature = 0;
let totalFeaturePayout = 0;
let invalidOutcomes = 0;
let duplicatePaylineEvaluations = 0;
const paidLineWinsByLength = { 2: 0, 3: 0, 4: 0, 5: 0 };
let paidSpinPayout = 0;

function lineUsesWild(result, line) {
  return line.positions.some(([reel, row]) => result.grid[reel][row] === 'wild');
}
function recordLines(result, free) {
  if (new Set(result.lines.map(line => line.line)).size !== result.lines.length) duplicatePaylineEvaluations++;
  for (const line of result.lines) {
    if (!free) paidLineWinsByLength[line.count]++;
    const credits = line.payout * (free ? FEATURE.multiplier : 1);
    if (free) {
      contribution.freeGameLineCredits += credits;
      if (lineUsesWild(result, line)) contribution.freeGameWildLineCredits += credits;
    } else {
      contribution.baseLineCredits += credits;
      if (lineUsesWild(result, line)) contribution.baseWildLineCredits += credits;
    }
  }
}

for (let index = 0; index < spins; index++) {
  const result = engine.spin();
  paidSpinPayout += result.payout;
  recordLines(result, false);
  if (result.payout >= 1 || result.trigger) hits++;
  if (result.payout) {
    winCount++;
    if (result.payout <= 4) small++;
    if (result.payout >= 20) major++;
  }
  result.grid.forEach((reel, reelIndex) => reel.forEach(symbol => {
    symbolCounts[reelIndex][symbol] = (symbolCounts[reelIndex][symbol] || 0) + 1;
  }));
  if (result.trigger) {
    triggers++;
    let featurePayout = 0;
    while (engine.feature.remaining) {
      const freeResult = engine.spin({ free: true });
      freeGames++;
      featurePayout += freeResult.payout;
      recordLines(freeResult, true);
      if (!Number.isFinite(freeResult.payout) || freeResult.payout < 0) invalidOutcomes++;
    }
    totalFeaturePayout += featurePayout;
    maxFeature = Math.max(maxFeature, engine.feature.played);
    engine.finishFeature();
  }
  if (!Number.isFinite(result.payout) || result.payout < 0 || engine.credits < 0) invalidOutcomes++;
}

const totalReturned = contribution.baseLineCredits + contribution.freeGameLineCredits;
const hitFrequency = hits / spins;
const confidenceRadius = 1.96 * Math.sqrt(hitFrequency * (1 - hitFrequency) / spins);
const report = {
  seed,
  spinCount: spins,
  paidSpinHitFrequency: hitFrequency,
  hitFrequency95CI: [hitFrequency - confidenceRadius, hitFrequency + confidenceRadius],
  freeGamesTriggerFrequency: triggers / spins,
  totalWageredPlayCredits: spins,
  totalReturnedPlayCredits: totalReturned,
  rtp: totalReturned / spins,
  rtpContribution: {
    baseGameLineWinRtp: contribution.baseLineCredits / spins,
    freeGamesRtp: contribution.freeGameLineCredits / spins,
    totalRtp: totalReturned / spins,
    baseWildRelatedRtp: contribution.baseWildLineCredits / spins,
    freeGameWildRelatedRtp: contribution.freeGameWildLineCredits / spins,
    note: 'Wild-related values are subsets of their base/free line-win contributions.'
  },
  winningPaidSpins: winCount,
  averagePayoutOnWinningPaidSpins: winCount ? paidSpinPayout / winCount : 0,
  paidLineWinsByLength,
  distribution: {
    oneToFourShare: small / winCount,
    twentyPlusShare: major / winCount
  },
  symbolFrequencyByReel: symbolCounts.map(counts => Object.fromEntries(
    Object.entries(counts).map(([symbol, count]) => [symbol, count / (spins * 3)])
  )),
  wildFrequency: symbolCounts.reduce((sum, counts) => sum + (counts.wild || 0), 0) / (spins * 15),
  scatterFrequency: symbolCounts.reduce((sum, counts) => sum + (counts.scatter || 0), 0) / (spins * 15),
  averageFreeGamesPerTrigger: triggers ? freeGames / triggers : 0,
  averageFreeGamesPerPaidSpin: freeGames / spins,
  averagePayoutPerTriggeredFeature: triggers ? totalFeaturePayout / triggers : 0,
  maximumFeatureLength: maxFeature,
  invalidOutcomes,
  duplicatePaylineEvaluations
};
const checks = {
  paidSpinHitFrequency: report.paidSpinHitFrequency >= 0.33 && report.paidSpinHitFrequency <= 0.35,
  freeGamesTriggerFrequency: report.freeGamesTriggerFrequency >= 0.0115 && report.freeGamesTriggerFrequency <= 0.014,
  rtp: report.rtp >= 0.95 && report.rtp <= 0.97,
  maximumFeatureLength: report.maximumFeatureLength <= 18,
  validOutcomes: report.invalidOutcomes === 0,
  uniquePaylineEvaluations: report.duplicatePaylineEvaluations === 0
};
report.validationChecks = checks;
report.validation = Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL';
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync(`reports/simulation-${seed}-${spins}.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.validation !== 'PASS') process.exitCode = 1;
