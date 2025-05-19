'use strict';

const assert = require('node:assert');
const { it } = require('node:test');

const { CSVParser } = require('app/src/oop/minimal/CSVParser.js');
const { DensityReport } = require('app/src/oop/minimal/DensityReport.js');
const { createRender } = require('app/src/oop/minimal/createRender.js');

it('oop.minimal: parser', () => {
  const raw = `city,population\nShanghai,24256800`;
  const expected = [
    ['city', 'population'],
    ['Shanghai', '24256800'],
  ];

  const res = CSVParser.parse(raw, { skipFirst: 0, skipLast: 0 });
  assert.deepEqual(res, expected);
});

it('oop.minimal: DensityReport', () => {
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

  const res = DensityReport.create(data, { densityIndex: 1 });
  assert.deepEqual(res, expected);
});

it('oop.minimal: Render', () => {
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

  const result = [];
  const renderFn = (output) => result.push(output);
  const render = createRender(scheme, renderFn);
  render(data);
  assert.deepEqual(result, expected);
});
