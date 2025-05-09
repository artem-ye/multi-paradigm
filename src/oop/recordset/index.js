'use strict';

const { console } = require('../../../deps/deps.js');
const { compose } = require('../../lib/fp.utils.js');
const { CSV } = require('./CSVParser');
const { DensityReport } = require('./DensityReport.js');
const { RecordSet } = require('./RecordSet');

const createReport = (rawData) => {
  const skipFirst = 1;
  const skipLast = 1;

  const convertOpts = {
    city: { index: 0 },
    population: { index: 1, map: parseInt },
    area: { index: 2, map: parseInt },
    density: { index: 3, map: parseInt },
    country: { index: 4 },
  };

  const parse = (data) => CSV.parse(data, { skipFirst, skipLast });
  const convert = (table) => RecordSet.fromTable(convertOpts, table);
  const createReport = (rs) => DensityReport.create(rs).format();
  const print = (printFn) => (data) => data.map((e) => printFn(e));

  const process = compose(print(console.log), createReport, convert, parse);
  process(rawData);
};

module.exports = { createReport };
