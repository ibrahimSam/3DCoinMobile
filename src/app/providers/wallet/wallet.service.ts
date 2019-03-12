import { LoggerService } from "src/app/providers/logger/logger.service";
import { Injectable } from "@angular/core";
declare var coinjs: any;
declare var CryptoJS: any;

export interface WalletInterface {
  pubkey: string;
  privkey: string;
  derived: {
    version: number;
    depth: number;
    parent_fingerprint: [];
    child_index: number;
    chain_code: [];
    key_bytes: [];
    type: string;
    keys: {
      privkey: string;
      pubkey: string;
      address: string;
      wif: string;
    };
    keys_extended: {
      privkey: string;
      pubkey: string;
    };
  };
}

@Injectable({
  providedIn: "root"
})
export class WalletService {
  constructor(private logger: LoggerService) {}

  newPrivkey(seed) {
    return new Promise((resolve, reject) => {
      var t = coinjs.newKeys(seed);
      if (t) {
        resolve(t);
      } else {
        reject();
      }
    });
  }

  async newTransaction() {
    var tx = await coinjs.transaction();
    return tx;
  }

  async newHDWallet(seed) {
    var hd = await coinjs.hd();
    var pair = await hd.master(seed);
    var hd2 = await coinjs.hd(pair.privkey);

    this.logger.log("pair.pubkey   " + pair.pubkey);
    this.logger.log("pair.privkey   " + pair.privkey);

    return this.newDerivedWallet(pair.privkey, 0, pair.pubkey);

    // var derived = await hd2.derive(0);

    /*     this.logger.log("derived.privkey   " + JSON.stringify(derived));

    let wallet: WalletInterface = <WalletInterface>{};

    wallet.privkey = pair.privkey;
    wallet.pubkey = pair.pubkey;
    wallet.derived = {
      version: derived.version,
      depth: derived.depth,
      parent_fingerprint: derived.parent_fingerprint,
      child_index: derived.child_index,
      chain_code: derived.version,
      key_bytes: derived.version,
      type: derived.type,
      keys: {
        privkey: derived.keys_extended.privkey,
        pubkey: derived.keys.pubkey,
        address: derived.keys.address,
        wif: derived.keys.wif
      },
      keys_extended: {
        privkey: derived.keys_extended.privkey,
        pubkey: derived.keys_extended.pubkey
      }
    };
    return wallet; */
  }


async decodeaddress(address: string){
    let data = await coinjs.addressDecode(address);
    this.logger.debug("decoded address  " + JSON.stringify(data));
    return data;
}

  async newDerivedWallet(xprivkey: string, fromeindex: number, xpubkey?) {
    this.logger.log("xprivkey  " + xprivkey);
    let hd = await coinjs.hd(xprivkey);
    let derived = await hd.derive(fromeindex);

    let wallet: WalletInterface = <WalletInterface>{};

    wallet.privkey = xprivkey;
    wallet.pubkey = "";
    wallet.derived = {
      version: derived.version,
      depth: derived.depth,
      parent_fingerprint: derived.parent_fingerprint,
      child_index: derived.child_index,
      chain_code: derived.version,
      key_bytes: derived.version,
      type: derived.type,
      keys: {
        privkey: derived.keys_extended.privkey,
        pubkey: derived.keys.pubkey,
        address: derived.keys.address,
        wif: derived.keys.wif
      },
      keys_extended: {
        privkey: derived.keys_extended.privkey,
        pubkey: derived.keys_extended.pubkey
      }
    };
    return wallet;
  }
}

/*
         var hd = coinjs.hd(pair.privkey);
		var index_start = 0;
    var index_end = 5;
    for(var i=index_start;i<=index_end;i++){
      var derived = hd.derive(i);
      this.logger.log("derived privkey   "+JSON.stringify(derived));
    } 
*/

/**
 * 
 * 
 * {
      pubkey: pair.pubkey,
      privkey: pair.privkey,
      derived: {
        version: derived.version,
        depth: derived.depth,
        parent_fingerprint: derived.parent_fingerprint,
        child_index: derived.child_index,
        chain_code: derived.version,
        key_bytes: derived.version,
        type: derived.type,
        keys: {
          pubkey: derived.keys.pubkey,
          address: derived.keys.address
        },
        keys_extended: {
     {
      pubkey: pair.pubkey,
      privkey: pair.privkey,
      derived: {
        version: derived.version,
        depth: derived.depth,
        parent_fingerprint: derived.parent_fingerprint,
        child_index: derived.child_index,
        chain_code: derived.version,
        key_bytes: derived.version,
        type: derived.type,
        keys: {
          pubkey: derived.keys.pubkey,
          address: derived.keys.address
        },
        keys_extended: {
          pubkey: derived.keys_extended.pubkey
        }
      }
    };     pubkey: derived.keys_extended.pubkey
        }
      }
    };
 */
