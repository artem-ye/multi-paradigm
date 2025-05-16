'use strict';

const { renderReport, defaultScheme } = require('./renderReport');
const { cities } = require('app/data');

const main = () => {
  const opts = {
    densityIndex: 3,
    cutHead: 1,
    cutTail: 1,
    scheme: defaultScheme,
  };
  renderReport(cities, opts);
};

module.exports = main;
