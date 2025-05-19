'use strict';

const { cities } = require('app/data');
const { renderReport } = require('./renderReport.js');

const main = () => renderReport(cities, { densityIndex: 3 });

module.exports = main;
