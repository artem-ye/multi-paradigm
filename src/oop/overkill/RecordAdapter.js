'use strict';

const parseScheme = (scheme) => {
  const entries = Object.entries(scheme);
  const res = entries.map(({ 0: field, 1: params }) => ({
    field,
    colIndex: params.colIndex,
    map: params.map,
  }));
  return res;
};

const toRecordFactory = (meta) => {
  const proto = Object.create(null);
  for (const { field } of meta) proto[field] = undefined;
  return () => Object.create(proto);
};

const toRecordAdapter = (scheme) => {
  const meta = parseScheme(scheme);
  const adapterMeta = meta.filter((e) => e.colIndex !== undefined);
  const createRecord = toRecordFactory(meta);

  const adapter = (row) => {
    const record = createRecord();
    for (const { field, colIndex, map } of adapterMeta) {
      record[field] = map ? map(row[colIndex]) : row[colIndex];
    }
    return record;
  };
  return adapter;
};

class RecordAdapterFactory {
  static fromScheme(scheme) {
    return toRecordAdapter(scheme);
  }
}

module.exports = { RecordAdapterFactory };
