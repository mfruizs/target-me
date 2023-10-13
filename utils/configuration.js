const environment 	= process.env.NODE_ENV || 'secured';
const configFile 	= environment === 'test' ? '../config/test-config.json' : '../config/config.json';
const config		=  require( configFile );
config.certificate_path = process.env.CERTIFICATE_PATH || config.certificate_path;

module.exports = {
    getConfiguration: getConfiguration
}

function getConfiguration() {

	return config;
}