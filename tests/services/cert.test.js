const request = require( "supertest" );
const certSvr = require( "../../services/certService" );

const FILE_EXIST = "./services/certService.js";
const FILE_NO_EXIST = "./not_found.js"

describe( "Cert Service - method: checkIfExistFile", () => {

    it( "should return true an existing file", async () => {
        const response = await certSvr.checkIfExistFile( FILE_EXIST );
        expect( response ).toBe( true );
    });

    it( "should return false on a non-existent file", async () => {
        const response = await certSvr.checkIfExistFile( FILE_NO_EXIST );
        expect( response ).toBe( false );
    });

});


describe( "Cert Service - method: obtainCertifies", () => {

    it( "should return object with key and cert valuates", async () => {
        const response = await certSvr.obtainCertifies();
        expect( response.key ).not.toBe( null );
        expect( response.cert ).not.toBe( null );
    });

    it("should return an empty object", () => {
		const mockAllowCertificateServer = jest.spyOn(certSvr, 'allowCertificateServer');
		mockAllowCertificateServer.mockResolvedValue( Promise.resolve(false) );

		const response = certSvr.obtainCertifies();

		expect(response).toEqual(Promise.resolve({}));

		mockAllowCertificateServer.mockRestore();
    });

});
