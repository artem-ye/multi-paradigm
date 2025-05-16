'use strict';

const { console } = require('app/dependency/system.js');

function format(table, scheme) {
  const meta = Object.entries(scheme);
  const format = (row) => meta.reduce((acc, [i, fn]) => acc + fn(row[i]), '');
  return table.map(format);
}

function print(table, console) {
  table.forEach((row) => console.log(row));
}

const render = (table, scheme) => {
  const formatted = format(table, scheme);
  print(formatted, console);
};

module.exports = { render };
