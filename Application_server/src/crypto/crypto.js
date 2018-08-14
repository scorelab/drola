const CryptoJS = require("crypto-js"); //npm install --save-dev crypto-js
const config = require('../../config.js');

const plain_iv =  new Buffer( config.AES_IV , 'base64').toString('hex');
const iv = CryptoJS.enc.Hex.parse( plain_iv );
const key= CryptoJS.enc.Hex.parse( config.AES_KEY );

module.exports = {

  decrypt : function(data){ // Decrypt Data  ( data=base4_encode(aes256_encrypted )
    var bytes  = CryptoJS.AES.decrypt( data, key , { iv: iv} );
    var plaintext = bytes.toString(CryptoJS.enc.Base64);
    var decoded_b64msg =  new Buffer(plaintext , 'base64').toString('ascii');
    return decoded_b64msg;
    //console.log("Dec@JS:",data.substr(0,9),"->", decoded_b64msg);
    //write();// temporary reply to test
  },

  encrypt: function (data){
    var base64 =data.toString(CryptoJS.enc.Base64);
    var encrypted = CryptoJS.AES.encrypt(base64, key, {iv: iv});
    return encrypted;
  }
}
