'use strict';

class DensityReport {
  #table = null;
  #densityIndex = 3;

  constructor(table, opts = {}) {
    const { densityIndex } = opts;
    if (densityIndex) this.#densityIndex = densityIndex;
    this.#table = table;
  }

  static create(data, opts = {}) {
    const instance = new this(data, opts);
    return instance.#create();
  }

  #create() {
    if (this.#table.length === 0) return this.#table;

    const newColIndex = this.#appendDensity();
    this.#orderBy(newColIndex);
    return this.#table;
  }

  #max(index) {
    const max = (acc, row) => Math.max(acc, parseInt(row[index]));
    return this.#table.reduce(max, 0);
  }

  #orderBy(index) {
    this.#table.sort((r1, r2) => r2[index] - r1[index]);
  }

  #appendDensity() {
    const DENSITY_INDEX = this.#densityIndex;
    const MAX = this.#max(DENSITY_INDEX);
    const table = this.#table;

    for (const row of table) {
      const density = Math.round((row[DENSITY_INDEX] * 100) / MAX);
      row.push(density);
    }

    const newColIndex = table[0].length - 1;
    return newColIndex;
  }
}

module.exports = { DensityReport };
