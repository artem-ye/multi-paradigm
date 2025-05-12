'use strict';

const { console } = require('../../../deps/deps.js');
const { compose } = require('../../lib/fp.utils.js');
const { CSV } = require('./CSVParser');
const { RecordSet } = require('./RecordSet');
const { DensityReport } = require('./DensityReport.js');

const createReport = (rawData, opts = {}) => {
  const skipFirst = opts.skipFirst ?? 1;
  const skipLast = opts.skipLast ?? 1;
  const lineSeparator = opts.lineSeparator || '\n';
  const columnSeparator = opts.columnSeparator || ',';
  const outScheme = opts.outScheme || DensityReport.defaultFormat;
  const inputScheme = opts.inputScheme || {
    city: { colIndex: 0 },
    population: { colIndex: 1, map: parseInt },
    area: { colIndex: 2, map: parseInt },
    density: { colIndex: 3, map: parseInt },
    country: { colIndex: 4 },
  };

  const parseOpts = { skipFirst, skipLast, lineSeparator, columnSeparator };
  const parse = (data) => CSV.parse(data, parseOpts);
  const convert = (table) => RecordSet.fromTable(inputScheme, table);
  const createReport = (rs) => DensityReport.create(rs).format(outScheme);
  const print = (printFn) => (data) => data.map((e) => printFn(e));

  const process = compose(print(console.log), createReport, convert, parse);
  process(rawData);
};

module.exports = { createReport };
