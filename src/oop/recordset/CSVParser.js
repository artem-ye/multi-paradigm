'use strict';

class CSV {
  #rawData = undefined;
  #lineSeparator = '';
  #columnSeparator = '';
  #skipFirst = 0;
  #skipLast = 0;

  static parse(data, opts = {}) {
    const instance = new this(data, opts);
    return instance.#parse();
  }

  constructor(data, opts = {}) {
    this.#lineSeparator = opts.lineSeparator || '\n';
    this.#columnSeparator = opts.columnSeparator || ',';
    this.#skipFirst = opts.skipFirst ?? 0;
    this.#skipLast = opts.skipLast ?? 0;
    this.#rawData = data;
  }

  #parse() {
    if (!this.#rawData) return [];
    const rows = this.#parseRows(this.#rawData);
    if (this.#skipFirst > 0) rows.splice(0, this.#skipFirst);
    if (this.#skipLast > 0) rows.splice(this.#skipLast * -1, this.#skipLast);
    const table = this.#parseCols(rows);
    return table;
  }

  #parseRows(data) {
    return data.split(this.#lineSeparator);
  }

  #parseCols(table) {
    return table.map((row) => row.split(this.#columnSeparator));
  }
}

module.exports = { CSV };
