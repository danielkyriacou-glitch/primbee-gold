import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { SYMBOLS } from '../games/bush-bonanza/src/config/game.js';

const root = 'games/bush-bonanza';
const approved = [
  ['Koala', 'koala.jpg'],
  ['Kookaburra', 'kookaburra.jpg'],
  ['Wombat', 'wombat.jpg'],
  ['Kangaroo', 'kangaroo.jpg'],
  ['Cockatoo', 'cockatoo.jpg'],
  ['Platypus', 'platypus.jpg'],
  ['Echidna', 'echidna.jpg'],
  ['Crocodile', 'crocodile.jpg'],
  ['Tasmanian Tiger WILD', 'wild-thylacine.jpg'],
  ['Lorikeets FREE GAMES', 'free-lorikeets.jpg']
];

function jpegDimensions(buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8);
  let offset = 2;
  while (offset < buffer.length - 9) {
    if (buffer[offset] !== 0xff) { offset++; continue; }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = buffer.readUInt16BE(offset);
    if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
      return [buffer.readUInt16BE(offset + 5), buffer.readUInt16BE(offset + 3)];
    }
    offset += length;
  }
  assert.fail('JPEG dimensions not found');
}

test('Bush Bonanza uses the ten approved symbol identities and filenames', () => {
  assert.deepEqual(SYMBOLS.map(({label, file}) => [label, file]), approved);
});

test('approved Bush Bonanza artwork is sharp, consistently sized and unique', () => {
  const hashes = new Set();
  for (const [, file] of approved) {
    const buffer = fs.readFileSync(path.join(root, 'design-assets', file));
    assert.deepEqual(jpegDimensions(buffer), [1200, 600], file);
    assert.ok(buffer.length > 300_000, `${file} should retain the high-detail source artwork`);
    assert.ok(buffer.length < 650_000, `${file} should remain tablet-friendly`);
    hashes.add(crypto.createHash('sha256').update(buffer).digest('hex'));
  }
  assert.equal(hashes.size, approved.length);
});

test('wide artwork fills reel cells without a duplicate special label', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.js'), 'utf8');
  assert.match(css, /\.cell img\{[^}]*width:100%;height:100%;[^}]*object-fit:cover;[^}]*object-position:center/);
  assert.match(css, /\.cell img\{[^}]*filter:none/);
  assert.doesNotMatch(css, /\.cell\.special:after/);
  assert.doesNotMatch(app, /data-overlay|dataset\.overlay/);
});

test('Bush Bonanza has a sharp wide banner', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const banner = fs.readFileSync(path.join(root, 'design-assets', 'bush-bonanza-banner.jpg'));
  assert.match(html, /bush-bonanza-banner\.jpg/);
  assert.deepEqual(jpegDimensions(banner), [1600, 400]);
  assert.ok(banner.length > 300_000);
});

test('rules use separate large-text how-to and pay-table pages', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.js'), 'utf8');
  for (const id of ['rulesHowButton','rulesPayButton','rulesHow','rulesPay']) assert.match(html, new RegExp(`id="${id}"`));
  assert.equal((html.match(/class="rules-steps"/g) || []).length, 1);
  assert.equal((html.match(/<article>/g) || []).length, 6);
  assert.match(css, /\.rules-steps\{[^}]*grid-template-columns:1fr 1fr/);
  assert.match(css, /\.rules-steps span[^}]*font-size:clamp\(17px/);
  assert.match(app, /function showRulesPage\(page\)/);
});

test('Bush sound pass uses new natural calls and generated mechanical sounds', () => {
  const audio = fs.readFileSync(path.join(root, 'src/audio/audio.js'), 'utf8');
  const sources = fs.readFileSync(path.join(root, 'audio/AUDIO_SOURCES.md'), 'utf8');
  for (const file of ['kookaburra-call.mp3','whipbird-call.mp3']) {
    assert.ok(fs.statSync(path.join(root, 'audio', file)).size > 8_000, file);
    assert.match(audio, new RegExp(file.replace('.', '\\.')));
    assert.match(sources, new RegExp(file.replace('.', '\\.')));
  }
  assert.match(audio, /woodKnock/);
  assert.match(audio, /createBuffer\(/);
  assert.doesNotMatch(audio, /slotPull|reelSpin|reelStop|slotWin|slotFeature|coinHandling|winSmall/);
});
