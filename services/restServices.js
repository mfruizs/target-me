const utils     = require( "../utils/utilities" );
const config    = require( "../utils/configuration" ).getConfiguration();
const PREFIX_HEADER = config.prefix_header.toLowerCase();

module.exports = {
    responseStatus : responseStatus,
    urlNotFound: urlNotFound,
    randomStatus: randomStatus,
    addCustomResponseHeaders: addCustomResponseHeaders,
    responseMainPage: responseMainPage
};

function urlNotFound( req, res, next ) {

     res.sendStatus( 404 );
}

async function responseStatus( req, res ) {
    console.log( "/" + req.params.code + ": " + new Date() );
    await addCustomResponseHeaders( req, res );

    const sleepTime = req.query.sleep;
    let statusCode = req.params.code;

    if ( isNaN( statusCode ) ) {
        res.sendStatus( 404 );
        return;
    }

    if ( await utils.isNotValidSleepTime( sleepTime ) ) {
        res.status( 400 ).json( { error: `Time to sleep must be under ${MAX_SLEEP} seconds` } );
        return;
    }

    await responseCorrectStatus( res, sleepTime, statusCode );
}

async function responseCorrectStatus( res, sleepTime, statusCode ) {

    if ( validateStatusCode( sleepTime, statusCode ) ) {
    	 responseErrorMessage( res, statusCode );
    	 return;
    }

    try {
        await selectStatusCodeAndMessage( res, sleepTime, statusCode );
    } catch( err ) {
        responseErrorMessage( res, statusCode );
    }
}

function validateStatusCode( sleepTime, statusCode ) {
	return !sleepTime
			&& isCodeOutOfRange( statusCode );
}

function isCodeOutOfRange( statusCode ) {
	return statusCode < 200 || statusCode > 599;
}

function responseErrorMessage( res, statusCode ) {
	const message = `Invalid status code: ${statusCode}`;
	addStatusCodeAndMessage( res, 406, message );
}

async function selectStatusCodeAndMessage( res, sleepTime, statusCode ) {

	const responseStatusCode = await utils.allowSleep( sleepTime, statusCode );
	const message = utils.recoverCustomMessageFromStatusCode( responseStatusCode );
	if ( message ) {
		addStatusCodeAndMessage( res, statusCode, message );
		return;
	}

	res.sendStatus( responseStatusCode );
}

function addStatusCodeAndMessage( res, statusCode, message ) {
	res.statusMessage = message;
	res.status( parseInt(statusCode) ).send( message );
}

async function randomStatus( req, res ) {
    const statusList = req.params.codeList;
    console.log( "/random/" + statusList + ": " + new Date() );

    if ( !statusList ) {
        res.sendStatus( 400 );
    }

    let arrStatus = [];
    const statusSplitted = statusList.split( "," );
    for (const statusCode of statusSplitted ) {
    	if ( utils.isStatusRange( statusCode ) ) {
			arrStatus = arrStatus.concat( utils.recoverStatusRange( statusCode ) );
		} else {
			arrStatus.push( statusCode );
		}
    }
    const statusToReturn = utils.getRandomStatusToReturn( arrStatus );
    await addCustomResponseHeaders( req, res );
    console.log( "> Response: " + statusToReturn );
    res.sendStatus( statusToReturn );
}

async function addCustomResponseHeaders( req, res ) {
    if ( !req.headers ) return;
    const mapHeaders = new Map( Object.entries( req.headers ) );
    for (const [key, value] of mapHeaders) {
      if ( key.includes( PREFIX_HEADER ) ) {
		const keyHeader = key.split( PREFIX_HEADER )[ 1 ];
		res.set( { [keyHeader] : value } );
	  }
    }
}

function responseMainPage( req, res ) {

	res.sendFile('./html/index.html', { root: '.' })
}
