'use strict';

const { console } = require('../../deps/deps.js');
const { compose } = require('../lib/fp.utils.js');
const { defaults, print, format, build, parse } = require('./functions.js');

const createReport = (data, opts = {}) => {
  const skipFirst = opts.skipFirst ?? defaults.skipFirst;
  const skipLast = opts.skipLast ?? defaults.skipLast;
  const densityIndex = opts.densityIndex ?? defaults.densityIndex;
  const formatScheme = opts.formatScheme || defaults.formatScheme;

  const fork = compose(
    print(console.log),
    format(formatScheme),
    build(densityIndex),
    parse({ skipFirst, skipLast }),
  );
  fork(data);
};

module.exports = { createReport };
