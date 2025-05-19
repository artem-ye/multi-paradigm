'use strict';

const { console } = require('app/dependency/system.js');
const { chain } = require('app/dependency/fp.utils.js');
const { CSV } = require('./CSVParser.js');
const { RecordSet } = require('./RecordSet.js');
const { DensityReport } = require('./DensityReport.js');
const { RecordAdapterFactory } = require('./RecordAdapter.js');

const defRecordScheme = {
  city: { colIndex: 0 },
  population: { colIndex: 1, map: parseInt },
  area: { colIndex: 2, map: parseInt },
  density: { colIndex: 3, map: parseInt },
  country: { colIndex: 4 },
  rating: {},
};

const renderReport = (rawData, opts = {}) => {
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
    map: RecordAdapterFactory.fromScheme(recordScheme),
  };

  const parse = (data) => CSV.parse(data, parseOpts);
  const prepare = chain(
    (records) => RecordSet.create(records),
    (rs) => DensityReport.create(rs),
  );
  const format = (scheme) => (report) => report.format(scheme);
  const print = (printFn) => (data) => data.map((e) => printFn(e));

  const process = chain(parse, prepare, format(outScheme), print(console.log));
  process(rawData);
};

module.exports = { renderReport };
