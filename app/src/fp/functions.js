'use strict';

const { compose, curry } = require('../../lib/fp.utils.js');

const format = curry((scheme, table) => {
  const meta = Object.entries(scheme);
  const formatRow = (row) =>
    meta.reduce((acc, [i, fn]) => acc + fn(row[i]), '');
  return table.map(formatRow);
});

const parse = curry((opts, data) => {
  const skipFirst = opts?.skipFirst ?? 0;
  const skipLast = opts?.skipLast ?? 0;

  const parseRows = (data) => data.split('\n');
  const cutHead = (tab) => (skipFirst > 0 ? tab.slice(skipFirst) : tab);
  const cutTail = (tab) => (skipLast > 0 ? tab.slice(0, skipLast * -1) : tab);
  const parseCols = (tab) => tab.map((row) => row.split(','));
  const process = compose(parseCols, cutTail, cutHead, parseRows);
  return process(data);
});

const build = curry((densityIdx, table) => {
  const max = (idx, t) => t.reduce((res, row) => Math.max(res, row[idx]), 0);
  const sort = curry((idx, t) => t.sort((r1, r2) => r2[idx] - r1[idx]));
  const percent = curry((base, v) => Math.round((v * 100) / base));

  const calcDensity = (table) => {
    const densityPercent = percent(max(densityIdx, table));
    const addDensityCol = (row) => row.concat(densityPercent(row[densityIdx]));
    return table.map(addDensityCol);
  };

  const futureColIndex = table[0].length;
  const composed = compose(sort(futureColIndex), calcDensity);
  return composed(table);
});

const print = curry((printFn, table) => table.forEach((e) => printFn(e)));

module.exports = { format, parse, build, print };
