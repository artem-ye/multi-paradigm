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
		this.#lineSeparator = opts.lineSeparator;
		this.#columnSeparator = opts.columnSeparator;
		this.#rawData = data;
	}

	parse() {
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

class CountryTableParser extends CSV {
	#table = null;
	#densityIndex = 3;

	constructor(data, opts = {}) {
		const {
			lineSeparator = '\n',
			columnSeparator = ',',
			densityIndex,
		} = opts;
		super(data, { columnSeparator, lineSeparator });
		this.#densityIndex = densityIndex ?? 3;
	}

	static of(data, opts) {
		return new CountryTableParser(data, opts);
	}

	parse() {
		this.#table = super.parse();
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

const res = CountryTableParser.of(data).parse();
print(res);
