'use strict';

const { console } = require('../../../deps/deps.js');
const { compose } = require('../../lib/fp.utils.js');
const { CSV } = require('./CSVParser');
const { DensityReport } = require('./DensityReport.js');
const { RecordSet } = require('./RecordSet');

const createReport = (rawData, opts = {}) => {
  const skipFirst = opts.skipFirst ?? 1;
  const skipLast = opts.skipLast ?? 1;
  const scheme = opts.scheme || {
    city: { colIndex: 0 },
    population: { colIndex: 1, map: parseInt },
    area: { colIndex: 2, map: parseInt },
    density: { colIndex: 3, map: parseInt },
    country: { colIndex: 4 },
  };

  const parse = (data) => CSV.parse(data, { skipFirst, skipLast });
  const convert = (table) => RecordSet.fromTable(scheme, table);
  const createReport = (rs) => DensityReport.create(rs).format();
  const print = (printFn) => (data) => data.map((e) => printFn(e));

  const process = compose(print(console.log), createReport, convert, parse);
  process(rawData);
};

module.exports = { createReport };
