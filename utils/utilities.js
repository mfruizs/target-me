const config		= require( "../utils/configuration" ).getConfiguration();
const customStatus  = require( "../config/status.json" );
const MAX_SLEEP 	= config.max_sleep_time_on_seconds;
const _port			= config.port;

module.exports =  {
    listenBanner: listenBanner,
    recoverCustomMessageFromStatusCode: recoverCustomMessageFromStatusCode,
    allowSleep: allowSleep,
    isNotValidSleepTime : isNotValidSleepTime,
    sleep: sleep,
    isValidNumber: isValidNumber,
    isValidStatusCodeList: isValidStatusCodeList,
    recoverStatusRange: recoverStatusRange,
    isStatusRange: isStatusRange,
    getRandomStatusToReturn: getRandomStatusToReturn
};

function listenBanner( isSecure ) {
  const protocol = isSecure ? "https" : "http";
  console.log( "--------------------------------------------" );
  console.log( "Node server running on " + protocol + "://localhost:" + _port + " - ( Secure server: " + isSecure + " )");
  console.log( "run > node app.js" );
  console.log( "--------------------------------------------" );
  console.log( "# Example for Expose Services #" );
  console.log( " Documentation (index.html)	> GET - " + protocol + "://localhost:"  + _port + "/" );
  console.log( " Endpoint			> GET - " + protocol + "://localhost:"  + _port + "/{statusCode}" );
  console.log( " Example Sleep			> GET - " + protocol + "://localhost:"  + _port + "/200?sleep=2" );
  console.log( " Example Sleep			> GET - " + protocol + "://localhost:"  + _port + "/504?sleep=2" );
  console.log( " Example existing code		> GET - " + protocol + "://localhost:"  + _port + "/503" );
  console.log( " Example code under 200		> GET - " + protocol + "://localhost:"  + _port + "/199" );
  console.log( " Example no existing code	> GET - " + protocol + "://localhost:"  + _port + "/1000" );
  console.log( " Example random code		> GET - " + protocol + "://localhost:"  + _port + "/random/200,203,500-504" );
}

function recoverCustomMessageFromStatusCode( statusCode ) {

	const message = customStatus[ statusCode ];
	if ( message ) {
		return message;
	}

	return null;
}

async function allowSleep( sleepTime, statusCode ) {
    if ( sleepTime ) {
        console.log( `sleep during ${sleepTime}s `);
        await sleep( sleepTime );
        statusCode = getStatusCodeForSleep( statusCode );
    }
    return statusCode;
}

async function isNotValidSleepTime( sleepTime ) {
    return sleepTime
        && ( isNaN( parseInt( sleepTime ) )
            || MAX_SLEEP < parseInt( sleepTime ) );
}

function getStatusCodeForSleep( statusCode ) {
    return ( statusCode !== "200" && statusCode !== "504" ) ? 200 : statusCode;
}

function sleep( seconds ) {
    const ms = ( seconds * 1000 );
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function isValidNumber( number ) {
    return !isNaN( parseInt( number ) );
}

function isValidStatusCodeList( ...params ) {
    if ( !params ) return false;
    const resultList = params.filter( item => isValidNumber(item) );
    return resultList.length > 0;
}

function recoverStatusRange( statusRangedStr ) {
    const arrStatusRanged = [];
    const statusRange = statusRangedStr.split( "-" );

    if ( isNaNRange( statusRange )) {
        return [];
    }

    const statusStart = parseInt( statusRange[ 0 ] );
    const statusEnd = parseInt( statusRange[ 1 ] );

    if ( statusStart > statusEnd ) return [];

    for (let currentStatus = statusStart; currentStatus <= statusEnd; currentStatus++ ) {
        if (isValidNumber( currentStatus ) ) {
            arrStatusRanged.push( currentStatus );
        }
    }
    return arrStatusRanged;
}

function isNaNRange( statusRange ) {
    return isNaN( statusRange[ 0 ] ) || isNaN(  statusRange[ 1 ] ) ;
}

function isStatusRange( status ) {
    return status?.includes( "-" )
        && status?.split( "-" ).length === 2;
}

function getRandomStatusToReturn( arrStatus ) {
     if ( !isValidStatusCodeList( arrStatus ) ) {
        return 400;
     }

     const position = Math.floor(Math.random() * arrStatus.length);
     return arrStatus[ position ];
}