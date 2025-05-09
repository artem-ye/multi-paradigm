'use strict';

const { RecordSetAdapter } = require('./RecordSetAdapter');

class RecordSet {
  #data = null;

  constructor(records) {
    this.#data = records;
  }

  static fromTable(meta, table) {
    const records = RecordSetAdapter.toRecords(meta, table);
    return new RecordSet(records);
  }

  max(field) {
    if (this.#data.length === 0) return 0;
    let max = this.#data[0][field];
    for (const r of this.#data) if (r[field] > max) max = r[field];
    return max;
  }

  orderBy(field) {
    this.#data.sort((r1, r2) => r2[field] - r1[field]);
  }

  cursor(fn) {
    this.#data.forEach((e) => fn(e));
  }

  map(fn) {
    return this.#data.map(fn);
  }
}

module.exports = { RecordSet };
