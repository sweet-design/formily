const serverId = require('\x2e\x2f\x70\x61\x72\x73\x65');
const SERVER_LIST = [
	{
		id: 0,
		name: '\x41\x2d\x44\x45\x56',
		host: '\x31\x39\x32\x2e\x31\x36\x38\x2e\x31\x2e\x32\x33\x37',
		port: 22,
		username: '\x72\x6f\x6f\x74',
		password: '\x63\x6f\x68\x6f\x40\x38\x38\x38',
		path: '\x2f\x5f\x6c\x65\x62\x72\x6f\x6e\x2f\x6c\x6f\x63\x61\x6c\x2f\x64\x65\x76',
		imageName: '\x76\x75\x65\x2d\x70\x63\x2d\x73\x61\x61\x73',
		containerName: '\x70\x63\x2d\x73\x61\x61\x73',
		packName: '\x64\x69\x73\x74',
		sitePort: 7890,
		containerPort: 80
	},
	{
		id: 1,
		name: '\x42\x2d\x53\x49\x54',
		host: '\x31\x39\x32\x2e\x31\x36\x38\x2e\x31\x2e\x32\x33\x37',
		port: 22,
		username: '\x72\x6f\x6f\x74',
		password: '\x63\x6f\x68\x6f\x40\x38\x38\x38',
		path: '\x2f\x5f\x6c\x65\x62\x72\x6f\x6e\x2f\x6c\x6f\x63\x61\x6c\x2f\x73\x69\x74',
		imageName: '\x76\x75\x65\x2d\x70\x63\x2d\x73\x61\x61\x73\x2d\x73\x69\x74',
		containerName: '\x70\x63\x2d\x73\x61\x61\x73\x2d\x73\x69\x74',
		packName: '\x64\x69\x73\x74',
		sitePort: 7891,
		containerPort: 80
	}
];
module['\x65\x78\x70\x6f\x72\x74\x73'] = SERVER_LIST[serverId];
