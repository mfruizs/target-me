const environment 	= process.env.NODE_ENV || 'secured';
const configFile 	= environment === 'test' ? '../config/test-config.json' : '../config/config.json';
const config		=  require( configFile );

module.exports = {
    getConfiguration: getConfiguration
}

function getConfiguration() {
	console.log(config);
	return config;
}