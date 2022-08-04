import aesjs from 'aes-js'
import {
  v4 as uuidv4
} from 'uuid'

export default async () => {
  try {
    const tokenKey = process.env.TOKEN_KEY;
    const tokenIv = process.env.TOKEN_IV;
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