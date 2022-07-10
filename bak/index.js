const scpClient = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const server = require('./products');
const Client = require('ssh2').Client;

const spinner = ora('正在发布到' + (process.env.NODE_ENV === 'ut' ? 'knox' : '测试') + '服务器...');
const deploing = ora('正在部署中...');

const conn = new Client();
conn.on('ready', function() {
	conn.exec(`rm -rf ${server.path}/${server.packName}`, function(err, stream) {
		if (err) throw err;
		stream
			.on('close', function(code, signal) {
				spinner.start();
				scpClient.scp(
					'dist/',
					{
						host: server.host,
						port: server.port,
						username: server.username,
						password: server.password,
						path: server.path + '/' + server.packName
					},
					function(err) {
						spinner.stop();
						if (err) {
							console.log(chalk.red('发布失败.\n'));
							throw err;
						} else {
							deploing.start();
							conn.exec(
								`docker stop ${server.containerName}\ndocker rm ${server.containerName}\ndocker rmi ${server.imageName}\ndocker build -t ${server.imageName} ${server.path}\ndocker run --name ${server.containerName} -d -p ${server.sitePort}:${server.containerPort} ${server.imageName}`,
								function(err, stream) {
									stream
										.on('close', function(code, signal) {
											deploing.stop();
											console.log(
												chalk.green(
													'Success! 成功发布到' +
														(process.env.NODE_ENV === 'prod' ? '生产' : '测试') +
														'服务器! \n'
												)
											);
											conn.end();
										})
										.on('data', function(data) {
											console.log('STDOUT: ' + data);
										})
										.stderr.on('data', function(data) {
											console.log('STDERR: ' + data);
										});
								}
							);
						}
					}
				);
			})
			.on('data', function(data) {
				console.log('STDOUT: ' + data);
			})
			.stderr.on('data', function(data) {
				console.log('STDERR: ' + data);
			});
	});
}).connect({
	host: server.host,
	port: server.port,
	username: server.username,
	password: server.password
});
