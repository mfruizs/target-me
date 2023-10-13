const config    = require( "../../utils/configuration" ).getConfiguration();
const utils     = require( "../../utils/utilities" );
const request   = require( "supertest" );

describe( "Rest Service - method: allowSleep", () => {

  it( "should return 200 with code=200 and sleep 1 second", async () => {
    const startTime = new Date();
    const responseCode = await utils.allowSleep( 1, 200 );
    const endTime = new Date() - startTime;
    expect( responseCode ).toBe( 200 );
    expect( endTime ).toBeGreaterThanOrEqual( 1000 );
    expect( endTime ).toBeLessThan( 1030 );
  });

});

describe( "Rest Service - method: isValidNumber", () => {

    it( "should validate a number", () => {
        const response = utils.isValidNumber(1111);
        expect( response ).toBe( true );

        const responseAlphanumericStr = utils.isValidNumber( "1234B" );
        expect( responseAlphanumericStr ).toBe( true );
    });

    it( "should return false to a NaN character", () => {
        const responseStr = utils.isValidNumber( "ABC" );
        expect( responseStr ).toBe( false );

        const responseNull = utils.isValidNumber( null );
        expect( responseNull ).toBe( false );

        const responseUndefined = utils.isValidNumber( undefined );
        expect( responseUndefined ).toBe( false );

    });
});

describe( "Rest Service - method: isValidStatusCodeList", () => {

    it( "should return true to a list of statusCode", () => {
        const response = utils.isValidStatusCodeList( "200, 204, 500" );
        expect( response ).toBe( true );
    });

    it( "should return false to a list of wrong statusCode", () => {
        const response = utils.isValidStatusCodeList( "A, B, C" );
        expect( response ).toBe( false );
    });

});

describe( "Rest Service - method: recoverStatusRange", () => {

    it( "should return a list of correlatives statusCode", () => {
        const responseArr = utils.recoverStatusRange( "500-502" );
        const expectArr = [ 500, 501, 502 ];
        expect( responseArr ).toStrictEqual( expectArr );
    });

    it( "should return a empty list because we are using a inverse of correlatives statusCode", () => {
        const responseArr = utils.recoverStatusRange( "502-500" );
        expect( responseArr ).toStrictEqual( [] );
    });

    it( "should return a empty list because we are using a wrong list of statusCode", () => {
        const responseArr = utils.recoverStatusRange( "500-ABC" );
        expect( responseArr ).toStrictEqual( [] );
    });

    it( "should return a empty list because we are using a wrong list of statusCode", () => {
        const responseArr = utils.recoverStatusRange( "-" );
        expect( responseArr ).toStrictEqual( [] );
    });

    it( "should return a empty list because we are using a wrong list without end", () => {
        const responseArr = utils.recoverStatusRange( "500-" );
        expect( responseArr ).toStrictEqual( [] );
    });

    it( "should return a empty list because we are using a wrong list without start", () => {
        const responseArr = utils.recoverStatusRange( "-500" );
        expect( responseArr ).toStrictEqual( [] );
    });

    it( "should return a empty list because we are using a wrong list of items with only code range separator", () => {
        const responseArr = utils.recoverStatusRange( "-" );
        expect( responseArr ).toStrictEqual( [] );
    });

});

describe( "Rest Service - method: isStatusRange", () => {

    it( "should return true because meets the pattern", () => {
        const response = utils.isStatusRange( "XXX-YYY" );
        expect( response ).toStrictEqual( true );
    });

    it( "should return false because don't meets the pattern", () => {
        const response = utils.isStatusRange( "500" );
        expect( response ).toStrictEqual( false );
    });

});

describe( "Rest Service - method: getRandomStatusToReturn", () => {

    it ( "Should not return a 400 (Bad Request) status code", () => {
        const response = utils.getRandomStatusToReturn( [ 200,201,500, 501, 502 ] );
        expect( response ).not.toBe( 400 );
    });

    it ( "Should return a 400 (Bad Request) status code", () => {
        const response = utils.getRandomStatusToReturn( [  '', '', '', '', '', '' ] );
        expect( response ).toBe( 400 );
    });

});