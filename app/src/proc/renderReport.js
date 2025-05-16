'use strict';

const { chain } = require('app/dependency/fp.utils.js');
const { parse, prepare, render } = require('./helpers/index.js');

const defaultScheme = () => {
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

const renderReport = (data, opts = {}) => {
  const densityIndex = opts.densityIndex;
  const cutHead = opts.cutHead;
  const cutTail = opts.cutTail;
  const formatScheme = opts.scheme;

  const _parse = (data) => parse(data, { cutHead, cutTail });
  const _prepare = (table) => prepare(table, { densityIndex });
  const _render = (table) => render(table, formatScheme);
  const fork = chain(_parse, _prepare, _render);
  fork(data);
};

module.exports = { renderReport, defaultScheme: defaultScheme() };
