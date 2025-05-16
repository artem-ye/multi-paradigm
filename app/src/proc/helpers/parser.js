'use strict';

function parseRows(data) {
  return data.split('\n');
}

function parseCols(table) {
  return table.map((row) => row.split(','));
}

function parse(data, { cutHead, cutTail }) {
  const rows = parseRows(data);
  if (cutHead) rows.splice(0, cutHead);
  if (cutTail) rows.splice(cutTail * -1, cutTail);
  const table = parseCols(rows);
  return table;
}

module.exports = { parse };
