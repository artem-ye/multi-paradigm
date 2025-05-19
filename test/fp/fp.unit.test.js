'use strict';

const assert = require('node:assert');
const { it } = require('node:test');

const { parse, build, format } = require('app/src/fp/functions.js');

it('fp.parse', () => {
  const raw = `city,population\nShanghai,24256800`;
  const expected = [
    ['city', 'population'],
    ['Shanghai', '24256800'],
  ];
  const res = parse({ skipFirst: 0, skipLast: 0 }, raw);
  assert.deepEqual(res, expected);
});

it('fp.format', () => {
  const padEnd = (padding) => (s) => String(s).padEnd(padding);
  const padStart = (padding) => (s) => String(s).padStart(padding);
  const scheme = {
    0: padEnd(7),
    1: padStart(5),
  };
  const data = [
    ['Tokyo', 40],
    ['NY', 100],
  ];
  const expected = ['Tokyo     40', 'NY       100'];
  const res = format(scheme, data);
  assert.deepEqual(res, expected);
});

it('fp.build', () => {
  const data = [
    ['Tokyo', 40],
    ['Lagos', 100],
    ['Delhi', 80],
  ];
  const expected = [
    ['Lagos', 100, 100],
    ['Delhi', 80, 80],
    ['Tokyo', 40, 40],
  ];
  const densityIndex = 1;
  const res = build(densityIndex, data);
  assert.deepEqual(res, expected);
});
