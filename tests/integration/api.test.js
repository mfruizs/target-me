process.env.NODE_ENV = 'secured';
const request = require("supertest");
const server  = require('../../server');
const { waitForServerToStart } = require('./checkServer');
const _port = require( "../../utils/configuration" ).getConfiguration().port;
const BASE_URL = "https://localhost:" + _port;

const TIME_START_MAX = 1000;
const TIME_END_MAX = 1030;

describe( "GET /{code}", () => {

  beforeAll( async () => {
    console.log("SetUp: waiting for server up");
    await waitForServerToStart( BASE_URL );
  });

  it( "should return 200 with code=200", async () => {
    const response = await request( BASE_URL ).get( "/200" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 200 );
  });

  it( "should return 504 with code=504", async () => {
    const response = await request( BASE_URL ).get( "/504" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 504 );
  });

  it( "should return 406 with code=200", async () => {
    const response = await request( BASE_URL ).get( "/1000" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 406 );
  });

  it( "should return 406 with code < 200", async () => {
    const response = await request( BASE_URL ).get( "/199" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 406 );
  });

  it( "should return 406 with code > 599", async () => {
    const response = await request( BASE_URL ).get( "/600" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 406 );
  });

});

describe( "GET /{code}?sleep=", () => {

  it( "should return 200 with code=200 and sleep 1 second", async () => {
    const startTime = new Date();
    const response = await request( BASE_URL ).get( "/200?sleep=1" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 200 );
    const endTime = new Date() - startTime;
    expect( endTime ).toBeGreaterThanOrEqual( TIME_START_MAX );
    expect( endTime ).toBeLessThan( TIME_END_MAX );
  });

  it( "should return 504 with code=504 and sleep 1 second", async () => {
    const startTime = new Date();
    const response = await request( BASE_URL ).get( "/504?sleep=1" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 504 );
    const endTime = new Date() - startTime;
    expect( endTime ).toBeGreaterThanOrEqual( TIME_START_MAX );
    expect( endTime ).toBeLessThan( TIME_END_MAX );
  });

  it( "should return 200 with code=404 and sleep 1 second", async () => {
    const startTime = new Date();
    const response = await request( BASE_URL ).get( "/404?sleep=1" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 200 );
    const endTime = new Date() - startTime;
    expect( endTime ).toBeGreaterThanOrEqual( TIME_START_MAX );
    expect( endTime ).toBeLessThan( TIME_END_MAX );
  });

  it( "should return 200 with code=1000 and sleep 1 second", async () => {
    const startTime = new Date();
    const response = await request( BASE_URL ).get( "/1000?sleep=1" ).trustLocalhost( true );
    expect( response.statusCode ).toBe( 200 );
    const endTime = new Date() - startTime;
    expect( endTime ).toBeGreaterThanOrEqual( TIME_START_MAX );
    expect( endTime ).toBeLessThan( TIME_END_MAX );
  });

});