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
		this.#cutHead();
		this.#cutTail();
		if (this.#table.length === 0) return this.#table;

		const newColIndex = this.#appendDensity();
		this.#orderBy(newColIndex);
		return this.#table;
	}

	#cutHead() {
		this.#table.shift();
	}

	#cutTail() {
		this.#table.pop();
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

const print = (table) => {
	const padEnd = (padding) => (s) => String(s).padEnd(padding);
	const padStart = (padding) => (s) => String(s).padStart(padding);
	const meta = Object.entries({
		0: padEnd(18),
		1: padStart(10),
		2: padStart(8),
		3: padStart(8),
		4: padStart(18),
		5: padStart(6),
	});
	const format = (row) => meta.reduce((acc, [i, fn]) => acc + fn(row[i]), '');
	const printRow = (s) => console.log(s);
	table.map(format).map(printRow);
};

const table = CSVParser.parse(data);
const res = DensityReport.create(table, { densityIndex: 3 });
print(res);
