import { UnspentInput } from "./../home.page";
import { LoggerService } from "./../../../providers/logger/logger.service";
import { Profile } from "./../../../models/profile/profile";
import { PersistanceService } from "./../../../providers/persistance/persistance.service";
import { WalletService } from "./../../../providers/wallet/wallet.service";
import { Component, OnInit } from "@angular/core";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { HttpClient } from "@angular/common/http";
import * as $ from "jquery";
import { AlertController, LoadingController } from "@ionic/angular";
import { EncdecService } from "src/app/providers/encdecservice/encdec.service";
import { ActivatedRoute } from "@angular/router";

export interface UnspentInput {
  address: string;
  txid: string;
  vout: string;
  scriptPubKey: string;
  amount: number;
  satoshis: number;
  height: number;
  confirmationss: number;
}

@Component({
  selector: "app-send-tab",
  templateUrl: "./send-tab.page.html",
  styleUrls: ["./send-tab.page.scss"]
})
export class SendTabPage implements OnInit {
  constructor(
    private qrScanner: QRScanner,
    private http: HttpClient,
    private walletService: WalletService,
    private storage: PersistanceService,
    private profile: Profile,
    private atrCtrl: AlertController,
    private loadingController: LoadingController,
    private logger: LoggerService,
    private encdecService: EncdecService,
    private route: ActivatedRoute
  ) {}
  _3dctitle: string = "3DCoin wallet";
  receiverAddress: string = "";
  amountToSend: number;
  state: string = "hide";
  divstate: string = "divshow";
  totalBalance: number = 0;
  _pin;
  fees: number = 0;
  allwalletBlanace: number = 0;
  lockScreenTime: number = 5000;
  allwallet = [];

  _3dcstatsUrl: string = "https://3dcstats.net/insight-api/addr/";
  postURL : string = "https://3dcstats.net/insight-api/tx/send";

  _profile: Profile;
  ngOnInit() {
    this.receiverAddress = "";
    this.amountToSend;
    //this.initProfile();
  }

  initProfile() {
    this.storage.getProfile().then(profile => {
      this._profile = profile;
    });
  }

  ionViewWillEnter() {
    this.initProfile();
    this.totalBalance = parseInt(this.route.snapshot.queryParams.totalbalance);
    this.receiverAddress = this.route.snapshot.queryParams.pubkey;
    setTimeout(() => {
      //this.route.navigate(['/lockscreen']);
    }, this.lockScreenTime);
  }

  scanqr() {
    // Optionally request the permission early
    this.state = "show";
    this.divstate = "divhide";
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((address: string) => {
            this.logger.log("Scanned address :  ", address);

            this.receiverAddress = address;
            this.qrScanner.destroy();
            this.qrScanner.hide();
            scanSub.unsubscribe();
            setTimeout(()=>{
              this.state = "hide";
              this.divstate = "divshow";
            },200);
          });
          this.qrScanner.resumePreview();
          this.qrScanner.show();
        } else if (status.denied) alert("permission was denied permanently");
        else alert("permission was denied ");
      })
      .catch((e: any) => {
        alert("Error is" + e);
      });
  }

  ionViewDidLeave() {
    this.qrScanner.destroy();
    this.qrScanner.hide();
  }

  async sendTX() {
    this.totalBalance = 0;
    let walletAmount: number;
    this.allwalletBlanace = 0;

    const tx = await this.walletService.newTransaction();

    for (let index = 0; index < this._profile.hdWallet.length; index++) {
      walletAmount = 0;
      let walletParams = await this.getAllUnspentInput(
        this._profile.hdWallet[index].address
      );

      for (let i = 0; i < walletParams.length; i++) {
        walletAmount += walletParams[i].amount;
      }
      this.totalBalance += walletAmount;
      if (walletAmount != 0 && this.allwalletBlanace < this.amountToSend) {
        let opts = {
          address: this._profile.hdWallet[index].address,
          wif: this._profile.hdWallet[index].wif,
          amount: walletAmount,
          walletParams: walletParams
        };
        this.allwallet.push(opts);
        this.allwalletBlanace += walletAmount;
      }
    }

    if (this.totalBalance <= 0) {
      alert("Insufficient funds");
      return;
    }

    if (this.amountToSend <= 0) {
      alert("Insufficient Amount");
      return;
    }

    this.allwallet = this.orderAddressesList(this.allwallet);

    this.logger.log("ordered array  -->   " + JSON.stringify(this.allwallet));

    for (let index = 0; index < this.allwallet.length; index++) {
      await this.addInputToTx(tx, this.allwallet[index].walletParams);
    }

    this.walletService.decodeaddress(this.receiverAddress).then(type => {
      if (type.type != "standard" || type.version != 23) {
        alert("not 3dc address ");
        return;
      }
    });

    this.fees = tx.size() * 200 * 1e-10;
    if (this.amountToSend > this.totalBalance) {
      alert("amount > balance");
      return;
    } else if (this.amountToSend + this.fees != this.allwalletBlanace) {
      tx.addoutput(
        this.allwallet[this.allwallet.length - 1].address,
        this.allwalletBlanace - (this.amountToSend + this.fees)
      );
      tx.addoutput(this.receiverAddress, this.amountToSend);
    } else if (this.amountToSend == this.allwalletBlanace) {
      tx.addoutput(this.receiverAddress, this.amountToSend - this.fees);
    }
    this.logger.debug("allwallet  : " + JSON.stringify(tx));
    this.showPromptAlert(tx, this.allwallet);
  }

  async signAndBroadcast(tx, allwallet) {
    let privateKey = "ezazeaaz";
    let decPrivateKey = this.encdecService.decrypt(privateKey, this._pin);
    decPrivateKey.then(pk => {
      var t = tx.deserialize(tx.serialize());
      // this.logger.debug("pk : " + pk);
      this.logger.debug("tx : " + JSON.stringify(t));
      let sign;
      for (let index = 0; index < allwallet.length; index++) {
        sign = t.sign(allwallet[index].wif, 1);
      }
      this.logger.debug("signed tx : " + JSON.stringify(sign));

      if (sign) {
        let data = { rawtx: sign };
        this.http
          .post(this.postURL, data)
          .subscribe(response => {
            this.logger.log(
              "txid : \n" + JSON.parse(JSON.stringify(response)).txid
            );
            alert("txid : \n" + JSON.parse(JSON.stringify(response)).txid);
          });
      } else {
        alert("couldn't sign transaction !");
      }

      this.amountToSend = 0;
      this.receiverAddress = "";
      this.fees = 0;
      this.allwallet = [];
      this.encdecService.encrypt(pk, this._pin).then(encryptedPK => {
        this.storage.setPK(encryptedPK);
      });
    });
  }

  async showPromptAlert(tx, allwallet) {
    const alert = await this.atrCtrl.create({
      header: "Confirmations",
      message:
        "Your are sending " +
        this.amountToSend +
        " 3DC to : " +
        this.receiverAddress +
        "\n Enter your pin to confirme your transaction ",
      backdropDismiss: true,
      inputs: [
        {
          name: "pin",
          placeholder: "Enter PIN"
        }
      ],
      buttons: [
        {
          text: "Confirm",
          role: "confirm",
          cssClass: "secondary",
          handler: data => {
            this.checkPIN(data.pin).then(result => {
              if (result == true) {
                this._pin = data.pin;
                this.signAndBroadcast(tx, allwallet);
              } else this.showPromptAlert(tx, allwallet);
            });
          }
        }
      ]
    });
    alert.onDidDismiss().then(() => {
      this.receiverAddress = "";
      this.amountToSend = 0;
      this.allwallet = [];
      this.fees = 0;
    });
    await alert.present();
  }

  async checkPIN(pin: any) {
    let PIN = await this.encdecService.hashPin(pin);
    if (this._profile.hashedPin === PIN) return true;
    else return false;
  }

  async addInputToTx(tx, walletParams: UnspentInput[]) {
    if (this.receiverAddress != null && this.receiverAddress != "") {
      for (let index = 0; index < walletParams.length; index++) {
        let element = walletParams[index];
        tx.addinput(element.txid, element.vout, element.scriptPubKey, null);
      }
    } else {
      alert("Receiver address invalid, please scan it again");
    }
  }

  async createTansaction() {
    var tx = await this.walletService.newTransaction();
  }

  getAllUnspentInput(pubkey: string) {
    return this.http
      .get<Array<UnspentInput>>(this._3dcstatsUrl + pubkey + "/utxo")
      .toPromise();
  }

  orderAddressesList(allwallet: any[]): any[] {
    let orderedList = [];

    let time = allwallet.length;

    for (let k = 0; k < time; k++) {
      let max = allwallet[0].amount;
      let i = 0;
      for (let j = 0; j < allwallet.length; j++) {
        if (max < allwallet[j].amount) {
          max = allwallet[j];
          i = j;
        }
      }
      orderedList.push(allwallet[i]);
      allwallet.splice(i, 1);
    }
    return orderedList;
  }
}
