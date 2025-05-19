'use strict';

const { console } = require('app/dependency/system.js');
const { chain, curry } = require('app/dependency/fp.utils.js');
const { print, format, build, parse } = require('./functions.js');

const defaults = {
  skipFirst: 1,
  skipLast: 1,
  densityIndex: 3,
  get formatScheme() {
    const padEnd = curry((padding, s) => String(s).padEnd(padding));
    const padStart = curry((padding, s) => String(s).padStart(padding));
    const scheme = {
      0: padEnd(18),
      1: padStart(10),
      2: padStart(8),
      3: padStart(8),
      4: padStart(18),
      5: padStart(6),
    };
    return scheme;
  },
};

const renderReport = (data, opts = {}) => {
  const skipFirst = opts.skipFirst ?? defaults.skipFirst;
  const skipLast = opts.skipLast ?? defaults.skipLast;
  const densityIndex = opts.densityIndex ?? defaults.densityIndex;
  const formatScheme = opts.formatScheme || defaults.formatScheme;

  const fork = chain(
    parse({ skipFirst, skipLast }),
    build(densityIndex),
    format(formatScheme),
    print(console.log),
  );
  fork(data);
};

module.exports = { renderReport };
