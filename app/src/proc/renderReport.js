'use strict';

const { console } = require('app/dependency/system.js');
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

const renderReport = (data, opts) => {
  const { densityIndex, rowSeparator, colSeparator, cutHead, cutTail, scheme } =
    opts;

  const curryReverse = (fn) => (opts) => (data) => fn(data, opts);
  const _parse = curryReverse(parse);
  const _prepare = curryReverse(prepare);
  const _render = curryReverse(render);
  const fork = chain(
    _parse({ colSeparator, rowSeparator, cutHead, cutTail }),
    _prepare({ densityIndex }),
    _render({ scheme, console }),
  );
  fork(data);
};

module.exports = { renderReport, defaultScheme: defaultScheme() };
