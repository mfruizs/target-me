const fs                = require("fs");
const {X509Certificate} = require('crypto');
const config            = require( "../utils/configuration" ).getConfiguration();
const path              = config.certificate_path;

const KEY_PERM  = path + "key.pem";
const CERT_PERM = path + "cert.pem";
const CSR_PERM  = path + "csr.pem";

module.exports = {
    obtainCertifies: obtainCertifies,
    checkIfExistFile: checkIfExistFile,
    allowCertificateServer: allowCertificateServer
}

async function obtainCertifies() {
    const allowCert = await allowCertificateServer();
    if ( !allowCert ) {
        console.log( "Secure server not permitted" );
        return {};
    }

    return {
        key: fs.readFileSync( KEY_PERM ),
        cert: fs.readFileSync( CERT_PERM ),
    };
}

async function allowCertificateServer() {
    return await checkIfExistFile( KEY_PERM )
            && await checkIfExistFile( CERT_PERM )
            && await checkIfExistFile( CSR_PERM )
            && validateCertificate();
}

function checkIfExistFile(file) {
  return fs.promises.access( file, fs.constants.F_OK )
           .then( () => {
                return true;
           })
           .catch( () => {
                return false;
           })
}

function validateCertificate() {
    try {
        const x509 = new X509Certificate(fs.readFileSync( CERT_PERM ));
        return x509.verify(x509.publicKey);
    } catch( err ) {
        console.log( "Invalid certificate :: " + err );
        return false;
    }
}