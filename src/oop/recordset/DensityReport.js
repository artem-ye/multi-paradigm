'use strict';

class DensityReport {
  #recordSet = null;

  static get defaultFormat() {
    const padEnd = (padding) => (s) => String(s).padEnd(padding);
    const padStart = (padding) => (s) => String(s).padStart(padding);
    const opts = {
      city: padEnd(18),
      population: padStart(10),
      area: padStart(8),
      density: padStart(8),
      country: padStart(18),
      rating: padStart(6),
    };
    return opts;
  }

  static create(recordSet) {
    const instance = new DensityReport(recordSet);
    instance.#build();
    return instance;
  }

  constructor(recordSet) {
    this.#recordSet = recordSet;
  }

  get data() {
    return this.#recordSet.data;
  }

  format(options) {
    const opts = Object.entries(options || DensityReport.defaultFormat);
    const f = (row) => opts.reduce((acc, [i, fn]) => acc + fn(row[i]), '');
    return this.#recordSet.map(f);
  }

  #build() {
    this.#calcDensityRating();
    this.#sort();
  }

  #calcDensityRating() {
    const rs = this.#recordSet;
    const maxDensity = rs.max('density');
    rs.cursor((row) => {
      row.rating = Math.round((row['density'] * 100) / maxDensity);
    });
  }

  #sort() {
    this.#recordSet.orderBy('rating');
  }
}

module.exports = { DensityReport };
