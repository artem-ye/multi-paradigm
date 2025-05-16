'use strict';

const { parse } = require('./parser.js');
const { render } = require('./render.js');
const { prepare } = require('./report.js');

module.exports = { parse, render, prepare };
