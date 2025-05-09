'use strict';

const { console } = require('../../../deps/deps.js');
const { CSVParser } = require('./CSVParser.js');
const { DensityReport } = require('./DensityReport.js');

const print = (table) => {
  const padEnd = (padding) => (s) => String(s).padEnd(padding);
  const padStart = (padding) => (s) => String(s).padStart(padding);
  const meta = Object.entries({
    0: padEnd(18),
    1: padStart(10),
    2: padStart(8),
    3: padStart(8),
    4: padStart(18),
    5: padStart(6),
  });
  const format = (row) => meta.reduce((acc, [i, fn]) => acc + fn(row[i]), '');
  const printRow = (s) => console.log(s);
  table.map(format).map(printRow);
};

const createReport = (data) => {
  const table = CSVParser.parse(data);
  const res = DensityReport.create(table, { densityIndex: 3 });
  print(res);
};

module.exports = { createReport };
