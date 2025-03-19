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

const DENSITY = 3;

// prettier-ignore
const curry = (fn) => (...args) => {
	return (args.length < fn.length) ? curry(fn.bind(null, ...args)) : fn(...args);
};
// prettier-ignore
const compose = (...fns) => (arg) => fns.reduceRight((arg, fn) => fn(arg), arg);

const parse = (data) => {
	const parseRows = (data) => data.split('\n');
	const cutHead = (table) => table.slice(1);
	const cutTail = (table) => table.slice(0, -1);
	const parseCols = (table) => table.map((row) => row.split(','));
	const process = compose(parseCols, cutTail, cutHead, parseRows);
	return process(data);
};

const print = (table) => {
	const padEnd = curry((padding, s) => String(s).padEnd(padding));
	const padStart = curry((padding, s) => String(s).padStart(padding));
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

const prepare = (table) => {
	const max = (idx, t) => t.reduce((res, row) => Math.max(res, row[idx]), 0);
	const sort = curry((idx, t) => t.sort((r1, r2) => r2[idx] - r1[idx]));
	const percent = curry((base, v) => Math.round((v * 100) / base));

	const calcDensity = (table) => {
		const densityPercent = percent(max(DENSITY, table));
		const addDensityCol = (row) => row.concat(densityPercent(row[DENSITY]));
		return table.map(addDensityCol);
	};

	const futureColIndex = table[0].length;
	const composed = compose(sort(futureColIndex), calcDensity);
	return composed(table);
};

const process = compose(print, prepare, parse);
process(data || []);
