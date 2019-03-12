import { Injectable } from "@angular/core";
import { LoggerService } from "../logger/logger.service";
declare var Crypto: any;
declare var CryptoJS: any;

@Injectable({
  providedIn: "root"
})
export class EncdecService {

  constructor(private logger: LoggerService) {

  }

  async encrypt(plainText, key) {
    let iv = await CryptoJS.lib.WordArray.random(16);
    //this.logger.log("iv = " + iv);
    let aes_options = {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    };
    let cipherText = await CryptoJS.AES.encrypt(plainText, key, aes_options);
    cipherText += iv;
    return cipherText;
  }

  async decrypt(cipherText, key) {
    let iv = cipherText.substring(cipherText.length-32);
    let cipherLength = cipherText.length;
    cipherText = cipherText.slice(0, cipherLength-32);
    let aes_options = {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    };
    let plainText = await CryptoJS.AES.decrypt(
      cipherText,
      key,
      aes_options
    ); 
    return plainText.toString(CryptoJS.enc.Utf8);
  }

  async hashPin(pin: any) {
    return await Crypto.SHA256(pin);
  }

}
