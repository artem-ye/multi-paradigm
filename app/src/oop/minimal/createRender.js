'use strict';

const { compose } = require('app/dependency/fp.utils.js');

const format = (scheme) => (table) => {
  const meta = Object.entries(scheme);
  const format = (row) => meta.reduce((acc, [i, fn]) => acc + fn(row[i]), '');
  return table.map(format);
};

const render = (renderFn) => (table) => table.forEach((row) => renderFn(row));

const createRender = (scheme, fn) => compose(render(fn), format(scheme));

module.exports = { createRender };
