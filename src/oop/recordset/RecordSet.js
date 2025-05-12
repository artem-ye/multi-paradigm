'use strict';

class RecordSet {
  #data = null;

  constructor(records) {
    this.#data = records;
  }

  static fromTable(scheme, table) {
    const records = toRecords(scheme, table);
    return new RecordSet(records);
  }

  get data() {
    return this.#data;
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

function toRecords(scheme, array) {
  const meta = Object.entries(scheme).map(({ 0: field, 1: params }) => ({
    field,
    colIndex: params.colIndex,
    map: params.map,
  }));

  const recordFactory = () => {
    const proto = Object.create(null);
    for (const { field } of meta) {
      proto[field] = undefined;
    }
    return () => Object.create(proto);
  };
  const createRecord = recordFactory();

  const records = array.map((row) => {
    const record = createRecord();
    for (const { field, colIndex, map } of meta) {
      record[field] = map ? map(row[colIndex]) : row[colIndex];
    }
    return record;
  });
  return records;
}

module.exports = { RecordSet };
