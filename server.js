const config    =  require( "./utils/configuration" ).getConfiguration();
const utils     = require( "./utils/utilities" );
const restSvr   = require( "./services/restServices" );
const certSvr   = require( "./services/certService" );
const express   = require( "express" );
const cors      = require( "cors" );
const https     = require("https");
const _port     = config.port;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const router = express.Router();
const app = express();
app.use( router );
app.use( ( req, res, next ) => restSvr.urlNotFound( req, res, next ) );
router.get( "/", cors(), async ( req, res ) => { restSvr.responseMainPage( req, res ) } );
router.get( "/:code", cors(), async ( req, res ) => { await restSvr.responseStatus( req, res ) } );
router.get( "/random/:codeList", cors(), async ( req, res ) => { await restSvr.randomStatus( req, res ) } );

certSvr.obtainCertifies().then( certifies => {
   const isSecured = Object.keys( certifies ).length !== 0;
   if ( isSecured ) {
        https.createServer( certifies, app ).listen( _port, utils.listenBanner( isSecured ) );
   } else {
        // TO-DO: Why isn't it working!! ?
        // https.createServer( app ).listen( _port, utils.listenBanner( isSecured ) );
        app.listen( _port, port => utils.listenBanner( isSecured ) );
   }
});

