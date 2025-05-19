'use strict';

const { console } = require('app/dependency/system.js');
const { chain } = require('app/dependency/fp.utils.js');
const { CSVParser } = require('./CSVParser.js');
const { DensityReport } = require('./DensityReport.js');
const { createRender } = require('./createRender.js');

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

const defaults = {
  densityIndex: 3,
  lineSeparator: '\n',
  columnSeparator: ',',
  skipFirst: 1,
  skipLast: 1,
  formatScheme: defaultFormat(),
};

const renderReport = (data, opts = {}) => {
  const densityIndex = opts.densityIndex ?? defaults.densityIndex;
  const formatScheme = opts.formatScheme || defaults.formatScheme;
  const skipFirst = opts.skipFirst ?? defaults.skipFirst;
  const skipLast = opts.skipLast ?? defaults.skipLast;
  const lineSeparator = opts.lineSeparator || defaults.lineSeparator;
  const columnSeparator = opts.columnSeparator || defaults.columnSeparator;
  const parseOpts = { skipFirst, skipLast, lineSeparator, columnSeparator };

  const parse = (raw) => CSVParser.parse(raw, parseOpts);
  const createReport = (data) => DensityReport.create(data, { densityIndex });
  const render = createRender(formatScheme, console.log);

  const fork = chain(parse, createReport, render);
  fork(data);
};

module.exports = { renderReport };
