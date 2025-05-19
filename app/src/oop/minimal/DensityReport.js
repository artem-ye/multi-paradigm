'use strict';

class RecordSet extends Array {
  max(field) {
    const max = (acc, row) => Math.max(acc, parseInt(row[field]));
    return this.reduce(max, 0);
  }

  orderBy(field) {
    this.sort((r1, r2) => r2[field] - r1[field]);
  }
}

class DensityReport {
  #densityIndex = 3;

  constructor(table, opts = {}) {
    const { densityIndex } = opts;
    if (densityIndex) this.#densityIndex = densityIndex;
    this.table = RecordSet.from(table);
  }

  static create(data, opts = {}) {
    const instance = new this(data, opts);
    return instance.#create();
  }

  #create() {
    if (this.table.length === 0) return this.table;

    const ratingColIndex = this.#calcDensityRating();
    this.table.orderBy(ratingColIndex);
    return this.table;
  }

  #calcDensityRating() {
    const DENSITY_INDEX = this.#densityIndex;
    const MAX = this.table.max(DENSITY_INDEX);
    const table = this.table;
    for (const row of table) {
      const density = Math.round((row[DENSITY_INDEX] * 100) / MAX);
      row.push(density);
    }

    const newColIndex = table[0].length - 1;
    return newColIndex;
  }
}

module.exports = { DensityReport };
