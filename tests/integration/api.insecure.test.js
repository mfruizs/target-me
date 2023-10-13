process.env.NODE_ENV = 'test';
const config = require( "../../utils/configuration" ).getConfiguration();
const _port = config.port;
const BASE_URL = "http://localhost:" + _port;

const request = require( "supertest" );
const server  = require('../../server');

const TIME_START_MAX = 1000;
const TIME_END_MAX = 1030;

describe( "GET /{code}", () => {

  it( "should return 200 with code=200", async () => {

    const response = await request( BASE_URL ).get( "/200" );
    expect( response.statusCode ).toBe( 200 );

  });

  it( "should return 504 with code=504", async () => {
    const response = await request( BASE_URL ).get( "/504" );
    expect( response.statusCode ).toBe( 504 );
  });

  it( "should return 406 with code=200", async () => {
    const response = await request( BASE_URL ).get( "/1000" );
    expect( response.statusCode ).toBe( 406 );
  });

  it( "should return 406 with code < 200", async () => {
    const response = await request( BASE_URL ).get( "/199" );
    expect( response.statusCode ).toBe( 406 );
  });

  it( "should return 406 with code > 599", async () => {
    const response = await request( BASE_URL ).get( "/600" );
    expect( response.statusCode ).toBe( 406 );
  });

});

describe( "GET /{code}?sleep=", () => {

  it( "should return 200 with code=200 and sleep 1 second", async () => {
    const startTime = new Date();
    const response = await request( BASE_URL ).get( "/200?sleep=1" );
    expect( response.statusCode ).toBe( 200 );
    const endTime = new Date() - startTime;
    expect( endTime ).toBeGreaterThanOrEqual( TIME_START_MAX );
    expect( endTime ).toBeLessThan( TIME_END_MAX );
  });

  it( "should return 504 with code=504 and sleep 1 second", async () => {
    const startTime = new Date();
    const response = await request( BASE_URL ).get( "/504?sleep=1" );
    expect( response.statusCode ).toBe( 504 );
    const endTime = new Date() - startTime;
    expect( endTime ).toBeGreaterThanOrEqual( TIME_START_MAX );
    expect( endTime ).toBeLessThan( TIME_END_MAX );
  });

  it( "should return 200 with code=404 and sleep 1 second", async () => {
    const startTime = new Date();
    const response = await request( BASE_URL ).get( "/404?sleep=1" );
    expect( response.statusCode ).toBe( 200 );
    const endTime = new Date() - startTime;
    expect( endTime ).toBeGreaterThanOrEqual( TIME_START_MAX );
    expect( endTime ).toBeLessThan( TIME_END_MAX );
  });

  it( "should return 200 with code=1000 and sleep 1 second", async () => {
    const startTime = new Date();
    const response = await request( BASE_URL ).get( "/1000?sleep=1" );
    expect( response.statusCode ).toBe( 200 );
    const endTime = new Date() - startTime;
    expect( endTime ).toBeGreaterThanOrEqual( TIME_START_MAX );
    expect( endTime ).toBeLessThan( TIME_END_MAX );
  });

});