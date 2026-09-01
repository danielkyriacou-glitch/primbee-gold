import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { SYMBOLS } from '../games/bush-bonanza/src/config/game.js';

const root = 'games/bush-bonanza';
const approved = [
  ['Koala', 'koala.png'],
  ['Kookaburra', 'kookaburra.png'],
  ['Wombat', 'wombat.png'],
  ['Kangaroo', 'kangaroo.png'],
  ['Cockatoo', 'cockatoo.png'],
  ['Platypus', 'platypus.png'],
  ['Echidna', 'echidna.png'],
  ['Crocodile', 'crocodile.png'],
  ['Tasmanian Tiger WILD', 'wild-thylacine.png'],
  ['Lorikeets FREE GAMES', 'free-lorikeets.png']
];

function pngDimensions(buffer) {
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

test('Bush Bonanza uses the ten approved symbol identities and filenames', () => {
  assert.deepEqual(SYMBOLS.map(({label, file}) => [label, file]), approved);
});

test('approved Bush Bonanza artwork is consistently sized and unique', () => {
  const hashes = new Set();
  for (const [, file] of approved) {
    const buffer = fs.readFileSync(path.join(root, 'design-assets', file));
    assert.deepEqual(pngDimensions(buffer), [1200, 600], file);
    assert.ok(buffer.length < 600_000, `${file} should remain tablet-friendly`);
    hashes.add(crypto.createHash('sha256').update(buffer).digest('hex'));
  }
  assert.equal(hashes.size, approved.length);
});

test('wide artwork fills reel cells without a duplicate special label', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/app.js'), 'utf8');
  assert.match(css, /\.cell img\{[^}]*width:100%;height:100%;[^}]*object-fit:cover;[^}]*object-position:center/);
  assert.doesNotMatch(css, /\.cell\.special:after/);
  assert.doesNotMatch(app, /data-overlay|dataset\.overlay/);
});
