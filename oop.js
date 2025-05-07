const data = `city,population,area,density,country
Shanghai,24256800,6340,3826,China
Delhi,16787941,1484,11313,India
Lagos,16060303,1171,13712,Nigeria
Istanbul,14160467,5461,2593,Turkey
Tokyo,13513734,2191,6168,Japan
Sao Paulo,12038175,1521,7914,Brazil
Mexico City,8874724,1486,5974,Mexico
London,8673713,1572,5431,United Kingdom
New York City,8537673,784,10892,United States
Bangkok,8280925,1569,5279,Thailand`;

class CSV {
	#rawData = undefined;
	#lineSeparator = '';
	#columnSeparator = '';
	#skipFirst = 0;
	#skipLast = 0;

	static parse(data, fields, opts = {}) {
		const instance = new CSV(data, fields, opts);
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
		if (this.#skipLast > 0)
			rows.splice(this.#skipLast * -1, this.#skipLast);
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

class RecordSet {
	#data = null;

	constructor(dataset) {
		this.#data = dataset;
	}

	static fromTable(meta, table) {
		const data = DatasetAdapter.toDataset(meta, table);
		return new RecordSet(data);
	}

	max(field) {
		if (this.#data.length === 0) return 0;
		let max = this.#data[0][field];
		for (const r of this.#data) if (r[field] > max) max = r[field];
		return max;
	}

	orderBy(field) {
		this.#data.sort((r1, r2) => r2[field] - r1[field]);
	}

	cursor(fn) {
		this.#data.forEach((e) => fn(e));
	}

	map(fn) {
		return this.#data.map(fn);
	}
}

class DatasetAdapter {
	#meta = null;

	static toDataset(meta, table) {
		const instance = new DatasetAdapter(meta, table);
		return instance.#convert(table);
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

// prettier-ignore
const compose = (...fns) => (arg) => fns.reduceRight((arg, fn) => fn(arg), arg);

const fork = (rawData) => {
	const convertOpts = {
		city: { index: 0 },
		population: { index: 1, map: parseInt },
		area: { index: 2, map: parseInt },
		density: { index: 3, map: parseInt },
		country: { index: 4 },
	};

	const parse = (data) => CSV.parse(data, { skipFirst: 1, skipLast: 1 });
	const convert = (table) => RecordSet.fromTable(convertOpts, table);
	const createReport = (rs) => DensityReport.create(rs).format();
	const print = (printFn) => (data) => data.map((e) => printFn(e));

	const process = compose(print(console.log), createReport, convert, parse);
	process(rawData);
};

fork(data);
