'use strict';

const { console } = require('../../../deps/deps.js');
const { compose } = require('../../lib/fp.utils.js');
const { CSV } = require('./CSVParser.js');
const { RecordSet } = require('./RecordSet.js');
const { DensityReport } = require('./DensityReport.js');
const { createRecordAdapter } = require('./RecordAdapter.js');

const defRecordScheme = {
  city: { colIndex: 0 },
  population: { colIndex: 1, map: parseInt },
  area: { colIndex: 2, map: parseInt },
  density: { colIndex: 3, map: parseInt },
  country: { colIndex: 4 },
  rating: {},
};

const createReport = (rawData, opts = {}) => {
  const skipFirst = opts.skipFirst ?? 1;
  const skipLast = opts.skipLast ?? 1;
  const lineSeparator = opts.lineSeparator || '\n';
  const columnSeparator = opts.columnSeparator || ',';
  const outScheme = opts.outScheme || DensityReport.defaultFormat;
  const recordScheme = opts.inputScheme || defRecordScheme;
  const parseOpts = {
    skipFirst,
    skipLast,
    lineSeparator,
    columnSeparator,
    map: createRecordAdapter(recordScheme),
  };

  const parse = (data) => CSV.parse(data, parseOpts);
  const createReport = compose(
    (rs) => DensityReport.create(rs),
    (records) => RecordSet.create(records),
  );
  const format = (scheme) => (report) => report.format(scheme);
  const print = (printFn) => (data) => data.map((e) => printFn(e));

  const process = compose(
    print(console.log),
    format(outScheme),
    createReport,
    parse,
  );
  process(rawData);
};

module.exports = { createReport };
