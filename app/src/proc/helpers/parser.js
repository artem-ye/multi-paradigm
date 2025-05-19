'use strict';

function parseRows(data, separator = '\n') {
  return data.split(separator);
}

function parseCols(table, separator = ',') {
  return table.map((row) => row.split(separator));
}

function parse(data, opts) {
  const { cutHead, cutTail, rowSeparator, colSeparator } = opts;

  const rows = parseRows(data, rowSeparator);
  if (cutHead) rows.splice(0, cutHead);
  if (cutTail) rows.splice(cutTail * -1, cutTail);
  const table = parseCols(rows, colSeparator);
  return table;
}

module.exports = { parse };
