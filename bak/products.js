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
/*
 *定义多个服务器账号 及 根据 SERVER_ID 导出当前环境服务器账号
 */
const SERVER_LIST = [
	{
		id: 0,
		name: 'A-DEV',
		host: '192.168.1.237',
		port: 22,
		username: 'root',
		password: 'coho@888',
		path: '/_lebron/local/dev',
		imageName: 'vue-pc-saas',
		containerName: 'pc-saas',
		packName: 'dist',
		sitePort: 7890,
		containerPort: 80
	},
	{
		id: 1,
		name: 'B-SIT',
		// domain: 'test.xxx.com',
		host: '192.168.1.237',
		port: 22,
		username: 'root',
		password: 'coho@888',
		path: '/_lebron/local/sit',
		imageName: 'vue-pc-saas-sit',
		containerName: 'pc-saas-sit',
		packName: 'dist',
		sitePort: 7891,
		containerPort: 80
	}
];
module.exports = SERVER_LIST[SERVER_ID];
