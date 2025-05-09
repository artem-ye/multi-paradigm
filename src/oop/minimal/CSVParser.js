'use strict';

class CSVParser {
  #lineSeparator = '\n';
  #columnSeparator = ',';
  #skipFirst = 0;
  #skipLast = 0;
  #rawData = undefined;

  constructor(data, opts = {}) {
    this.#lineSeparator = opts.lineSeparator || '\n';
    this.#columnSeparator = opts.columnSeparator || ',';
    this.#skipFirst = opts.skipFirst ?? 0;
    this.#skipLast = opts.skipLast ?? 0;
    this.#rawData = data;
  }

  static parse(data, opts = {}) {
    const instance = new this(data, opts);
    return instance.#parse();
  }

  #parse() {
    if (!this.#rawData) return [];
    const table = this.#parseRows(this.#rawData);
    if (this.#skipFirst > 0) table.splice(0, this.#skipFirst);
    if (this.#skipLast > 0) table.splice(this.#skipLast * -1, this.#skipLast);
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
