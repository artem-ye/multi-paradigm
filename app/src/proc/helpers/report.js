'use strict';

function prepare(table, { densityIndex }) {
  const newColIndex = appendDensity(table, densityIndex);
  sort(table, newColIndex);
  return table;
}

function max(table, index) {
  const max = (acc, row) => Math.max(acc, parseInt(row[index]));
  return table.reduce(max, 0);
}

function sort(table, index) {
  return table.sort((r1, r2) => r2[index] - r1[index]);
}

function appendDensity(table, densityIndex) {
  const MAX = max(table, densityIndex);

  for (const row of table) {
    const density = Math.round((row[densityIndex] * 100) / MAX);
    row.push(density);
  }

  const newColIndex = table[0].length - 1;
  return newColIndex;
}

module.exports = {
  prepare,
};
