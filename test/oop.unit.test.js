'use strict';

const assert = require('node:assert');
const { it, describe } = require('node:test');

const { CSV } = require('../src/oop/recordset/CSVParser.js');
const { RecordSet } = require('../src/oop/recordset/RecordSet.js');
const { DensityReport } = require('../src/oop/recordset/DensityReport.js');

it('oop: parser', () => {
  const raw = `city,population\nShanghai,24256800`;
  const expected = [
    ['city', 'population'],
    ['Shanghai', '24256800'],
  ];
  const res = CSV.parse(raw, { skipFirst: 0, skipLast: 0 });
  assert.deepEqual(res, expected);
});

describe('oop: recordset', () => {
  const mockData = [
    ['Tokyo', 40],
    ['Lagos', 100],
    ['Delhi', 80],
  ];
  const mockRecords = mockData.map(({ 0: city, 1: population }) => ({
    city,
    population,
  }));
  const mockRecordSet = () => RecordSet.create(mockRecords);

  it('oop: create', () => {
    const rs = mockRecordSet();
    const records = rs.data;
    assert.strictEqual(records.length, mockData.length);
    for (let i = 0; i < mockData.length; i++) {
      const record = records[i];
      const [city, population] = mockData[i];
      assert.strictEqual(record.city, city);
      assert.strictEqual(typeof record.population === 'number', true);
      assert.strictEqual(record.population, parseInt(population));
    }
  });

  it('oop: max', () => {
    const rs = mockRecordSet();
    const max = rs.max('population');
    assert.strictEqual(max, 100);
  });

  it('oop: orderBy', () => {
    const rs = mockRecordSet();
    rs.orderBy('population');
    assert.strictEqual(rs.data[0].population, 100);
  });

  it('oop: map', () => {
    const rs = mockRecordSet();
    const res = rs.map((record) => [record.city, record.population]);
    assert.deepEqual(res, mockData);
  });

  it('oop: cursor', () => {
    const rs = mockRecordSet();
    rs.cursor((record) => (record.population += 100));
    const records = rs.data;
    for (let i = 0; i < mockData.length; i++) {
      assert.strictEqual(mockData[i][1] + 100, records[i].population);
    }
  });
});

describe('oop: report', () => {
  const mockData = [
    { city: 'Lagos', density: 100 },
    { city: 'Delhi', density: 80 },
    { city: 'Tokyo', density: 40 },
  ];
  const expected = [
    { city: 'Lagos', density: 100, rating: 100 },
    { city: 'Delhi', density: 80, rating: 80 },
    { city: 'Tokyo', density: 40, rating: 40 },
  ];

  const createReport = () => {
    const mockRecordSet = RecordSet.create(mockData);
    const res = DensityReport.create(mockRecordSet);
    return res;
  };

  it('oop report: create', () => {
    const report = createReport();
    assert.deepEqual(report.data, expected);
  });

  it('oop report: format', () => {
    const report = createReport();
    const formatOpts = {
      city: (v) => `${v}|`,
      density: (v) => `${v}|`,
      rating: (v) => v,
    };
    const expectedFormatted = expected.map((e) => Object.values(e).join('|'));
    const formatted = report.format(formatOpts);
    assert.deepEqual(formatted, expectedFormatted);
  });
});
