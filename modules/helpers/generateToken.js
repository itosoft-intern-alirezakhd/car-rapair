const tokenKey = process.env.TOKEN_KEY;
const tokenIv = process.env.TOKEN_IV;
const aesjs = require("aes-js");
const { v4: uuidv4 } = require("uuid");

module.exports.generateToken = async () => {
  try {
    const key = JSON.parse(tokenKey);
    const iv = JSON.parse(tokenIv);
    const textBytes = aesjs.utils.utf8.toBytes(uuidv4());
    const aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
    const encryptedBytes = aesOfb.encrypt(textBytes);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  } catch (err) {
    console.log(err);
    return false;
  }
};
