'use strict';

class CSVParser {
  #lineSeparator = '\n';
  #columnSeparator = ',';
  #rawData = undefined;

  constructor(data, opts = {}) {
    const { lineSeparator, columnSeparator } = opts;
    if (lineSeparator) this.#lineSeparator = lineSeparator;
    if (columnSeparator) this.#columnSeparator = columnSeparator;
    this.#rawData = data;
  }

  static parse(data, opts = {}) {
    const instance = new this(data, opts);
    return instance.#parse();
  }

  #parse() {
    if (!this.#rawData) return [];
    const table = this.#parseRows(this.#rawData);
    return this.#parseCols(table);
  }

  #parseRows(data) {
    return data.split(this.#lineSeparator);
  }

  #parseCols(table) {
    return table.map((row) => row.split(this.#columnSeparator));
  }
}

module.exports = { CSVParser };
