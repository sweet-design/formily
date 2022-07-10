const fs = require('fs');
const path = require('path');

const envfile = process.env.NODE_ENV === 'ut' ? '../.env.ut' : '../.env.dev';

const envPath = path.resolve(__dirname, envfile);

function parse(src) {
	const res = {};
	src.split('\n').forEach(line => {
		const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
		if (keyValueArr != null) {
			const key = keyValueArr[1];
			let value = keyValueArr[2] || '';
			const len = value ? value.length : 0;
			if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
				value = value.replace(/\\n/gm, '\n');
			}
			value = value.replace(/(^['"]|['"]$)/g, '').trim();
			res[key] = value;
		}
	});
	return res;
}

const envObj = parse(fs.readFileSync(envPath, 'utf8'));
const SERVER_ID = parseInt(envObj['VUE_APP_SERVER_ID']);

module.exports = SERVER_ID;
