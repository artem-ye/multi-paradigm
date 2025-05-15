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

const createRecordFactory = (meta) => {
  const proto = Object.create(null);
  for (const { field } of meta) proto[field] = undefined;
  return () => Object.create(proto);
};

const createRecordAdapter = (scheme) => {
  const meta = parseScheme(scheme);
  const adapterMeta = meta.filter((e) => e.colIndex !== undefined);
  const createRecord = createRecordFactory(meta);

  const adapter = (row) => {
    const record = createRecord();
    for (const { field, colIndex, map } of adapterMeta) {
      record[field] = map ? map(row[colIndex]) : row[colIndex];
    }
    return record;
  };
  return adapter;
};

module.exports = { createRecordAdapter };
