'use strict';

const { compose, curry } = require('../lib/fp.utils.js');
const { console } = require('../../deps/deps.js');

const DENSITY = 3;
const SKIP_FIRST = 1;
const SKIP_LAST = 1;

const format = (table) => {
  const padEnd = curry((padding, s) => String(s).padEnd(padding));
  const padStart = curry((padding, s) => String(s).padStart(padding));
  const meta = Object.entries({
    0: padEnd(18),
    1: padStart(10),
    2: padStart(8),
    3: padStart(8),
    4: padStart(18),
    5: padStart(6),
  });
  const formatRow = (row) =>
    meta.reduce((acc, [i, fn]) => acc + fn(row[i]), '');
  return table.map(formatRow);
};

const parse = (data) => {
  const parseRows = (data) => data.split('\n');
  const cutHead = (tab) => (SKIP_FIRST > 0 ? tab.slice(SKIP_FIRST) : tab);
  const cutTail = (tab) => (SKIP_LAST > 0 ? tab.slice(0, SKIP_LAST * -1) : tab);
  const parseCols = (tab) => tab.map((row) => row.split(','));
  const process = compose(parseCols, cutTail, cutHead, parseRows);
  return process(data);
};

const prepare = (table) => {
  const max = (idx, t) => t.reduce((res, row) => Math.max(res, row[idx]), 0);
  const sort = curry((idx, t) => t.sort((r1, r2) => r2[idx] - r1[idx]));
  const percent = curry((base, v) => Math.round((v * 100) / base));

  const calcDensity = (table) => {
    const densityPercent = percent(max(DENSITY, table));
    const addDensityCol = (row) => row.concat(densityPercent(row[DENSITY]));
    return table.map(addDensityCol);
  };

  const futureColIndex = table[0].length;
  const composed = compose(sort(futureColIndex), calcDensity);
  return composed(table);
};

const print = curry((printFn, table) => table.forEach((e) => printFn(e)));
const createReport = compose(print(console.log), format, prepare, parse);

module.exports = { createReport };
