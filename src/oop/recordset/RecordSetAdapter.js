'use strict';

class RecordSetAdapter {
  #meta = null;

  static toRecords(meta, table) {
    const instance = new RecordSetAdapter(meta, table);
    const records = instance.#convert(table);
    return records;
  }

  constructor(meta) {
    this.#meta = Object.entries(meta).map(({ 0: field, 1: params }) => ({
      field,
      index: params.index,
      map: params.map,
    }));
  }

  #convert(data) {
    const res = data.map((row) => {
      const record = Object.create(null);
      for (const { field, index, map } of this.#meta) {
        record[field] = map ? map(row[index]) : row[index];
      }
      return record;
    });
    return res;
  }
}

module.exports = { RecordSetAdapter };
