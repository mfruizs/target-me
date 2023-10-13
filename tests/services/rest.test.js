const restSvr   = require( "../../services/restServices" );
const config    = require( "../../utils/configuration" ).getConfiguration();
const PREFIX_HEADER = config.prefix_header.toLowerCase();

const customRequest = {
     headers: []
}

const customResponse = {
    statusCode: 0,
    sendStatus: function( status ) {
        this.statusCode = status;
    },
    headers: [],
    set: function( header ) {
        this.headers.push( header );
    }
};

describe( "Rest Service - method: urlNotFound", () => {

    it( "should return 404 (Not Found)", async () => {

        const customResponse = {
            statusCode: 0,
            sendStatus: function( status ) {
                this.statusCode = status;
            }
        };

        restSvr.urlNotFound( {}, customResponse, null );
        expect( customResponse.statusCode ).toBe( 404 );
    });


});

describe( "Rest Service - method: addCustomResponseHeaders", () => {

    it( "should return a custom headers", async () => {

        customRequest.headers = {
            "headerA": "hello",
            "headerB": "bye",
            [PREFIX_HEADER + "testKey"] : "testValue"
        };
        await restSvr.addCustomResponseHeaders( customRequest, customResponse, null );
        expect( "[{\"testKey\":\"testValue\"}]" ).toBe( JSON.stringify( customResponse.headers ) );
    });


});
