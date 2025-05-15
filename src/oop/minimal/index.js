'use strict';

const { console } = require('../../../deps/deps.js');
const { compose } = require('../../lib/fp.utils.js');
const { CSVParser } = require('./CSVParser.js');
const { DensityReport } = require('./DensityReport.js');
const { createRender } = require('./Render.js');

const defaultFormat = () => {
  const padEnd = (padding) => (s) => String(s).padEnd(padding);
  const padStart = (padding) => (s) => String(s).padStart(padding);
  const scheme = {
    0: padEnd(18),
    1: padStart(10),
    2: padStart(8),
    3: padStart(8),
    4: padStart(18),
    5: padStart(6),
  };
  return scheme;
};

const createReport = (data, opts = {}) => {
  const densityIndex = opts.densityIndex ?? 3;
  const skipFirst = opts.skipFirst ?? 1;
  const skipLast = opts.skipLast ?? 1;
  const formatScheme = opts.formatScheme || defaultFormat();

  const parse = (raw) => CSVParser.parse(raw, { skipFirst, skipLast });
  const createReport = (data) => DensityReport.create(data, { densityIndex });
  const render = createRender(formatScheme, console.log);

  const fork = compose(render, createReport, parse);
  fork(data);
};

module.exports = { createReport };
