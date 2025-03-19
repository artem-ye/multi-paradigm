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

DENSITY_INDEX = 3;

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

function parseRows(data) {
	return data.split('\n');
}

function parseCols(table) {
	return table.map((row) => row.split(','));
}

function crop(table) {
	return table.slice(1, -1);
}

function max(index, table) {
	const max = (acc, row) => Math.max(acc, parseInt(row[index]));
	return table.reduce(max, 0);
}

function sort(index, table) {
	return table.sort((r1, r2) => r2[index] - r1[index]);
}

function appendDensity(table) {
	const MAX = max(DENSITY_INDEX, table);

	for (const row of table) {
		const density = Math.round((row[DENSITY_INDEX] * 100) / MAX);
		row.push(density);
	}

	const newColIndex = table[0].length - 1;
	return newColIndex;
}

let t = parseRows(data);
t = parseCols(t);
t = crop(t);
const newColIndex = appendDensity(t);
t = sort(newColIndex, t);
print(t);
