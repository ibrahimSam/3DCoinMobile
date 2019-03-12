import { Profile } from "./../../../models/profile/profile";
import { WalletService } from "src/app/providers/wallet/wallet.service";
import { ActivatedRoute } from "@angular/router";
import { EncdecService } from "./../../../providers/encdecservice/encdec.service";
import { PersistanceService } from "src/app/providers/persistance/persistance.service";
import { Component, OnInit } from "@angular/core";
import { LoggerService } from "src/app/providers/logger/logger.service";
import {
  ToastController,
  PopoverController,
  AlertController
} from "@ionic/angular";

@Component({
  selector: "app-receive-tab",
  templateUrl: "./receive-tab.page.html",
  styleUrls: ["./receive-tab.page.scss"]
})
export class ReceiveTabPage implements OnInit {
  public _3dcAddressQrCode: string = "null";
  pubKey: string;
  privKey: string;
  pubkeyList = [""];
  selectedPubKey: string;
  _profile: Profile;
  lastInex: number;
  nbrOfWalletTogenerate: number;

  constructor(
    private route: ActivatedRoute,
    private storage: PersistanceService,
    private logger: LoggerService,
    private encdecService: EncdecService,
    private walletService: WalletService,
    private toastController: ToastController,
    public popoverController: PopoverController,
    private atrCtrl: AlertController
  ) { }
  ngOnInit() { }

  ionViewWillEnter() {
    this.storage.getProfile().then(__profile => {
      this._profile = __profile;
      this._3dcAddressQrCode = this._profile.hdWallet[0].address;
      for (let index = 0; index < this._profile.hdWallet.length; index++) {
        this.pubkeyList.push(this._profile.hdWallet[index].address);
        this.lastInex = this._profile.hdWallet[index].childIndex;
        this.logger.log(
          "generate wallet get profile  : " + JSON.stringify(__profile)
        );
      }
    });
  }

  ionViewDidEnter() {
    this.logger.debug(
      "got from home page   " + this.route.snapshot.queryParams.address
    );
    //this.pubkeyList = this.route.snapshot.queryParams.address;
  }

  ionViewDidLeave() {
    this.pubkeyList = [];
  }

  onChange() {
    this.logger.log("changed  " + this.selectedPubKey);
    this._3dcAddressQrCode = this.selectedPubKey;
  }

  generateNewPubKey() {
    this.storage.getProfile().then(__profile => {
      this._profile = __profile;
      this._3dcAddressQrCode = this._profile.hdWallet[0].address;
      this.pubkeyList = [];
      for (let index = 0; index < this._profile.hdWallet.length; index++) {
        this.pubkeyList.push(this._profile.hdWallet[index].address);
        this.lastInex = this._profile.hdWallet[index].childIndex;
        this.logger.log(
          "generate wallet get profile  : " + JSON.stringify(__profile)
        );
      }
      this.presentPopover("").then(alert => { });
    });

  }

  async presentPopover(msg) {
    const alert = await this.atrCtrl.create({
      header: "Confirm pin",
      message: msg,
      cssClass: "pincssclass",
      inputs: [
        {
          name: "pin",
          placeholder: "pin"
        },
        {
          name: "confirmpin",
          placeholder: "confirm pin"
        }
      ],
      buttons: [
        {
          text: "Confirm",
          role: "Confirm",
          handler: async data => {
            let pin = data.pin;
            let cpin = data.confirmpin;
            if (pin && cpin) {
              if (pin == cpin) {
                this.logger.log("get pin  : " + pin);
                this.checkPIN(pin).then(async response => {
                  if (response == true) {
                    this.logger.log("pin are equals ... ");
                    this.encdecService
                      .decrypt(this._profile.masterPrivKey, pin)
                      .then(privkey => {
                        this.walletService
                          .newDerivedWallet(privkey, this.lastInex + 1)
                          .then(wallet => {
                            this.logger.debug("get new hd wallet " + wallet);
                            this.pubkeyList.push(wallet.derived.keys.address);
                            this.presentToast(
                              "new pub key \n" + wallet.derived.keys.address
                            );
                            this._profile.hdWallet.push({
                              address: wallet.derived.keys.address,
                              wif: wallet.derived.keys.wif,
                              childIndex: wallet.derived.child_index
                            });
                            this.storage.storeProfile(this._profile);
                          })
                          .catch(err =>
                            this.logger.debug("error get new hd wallet ")
                          );
                      });
                  } else {
                    this.logger.log(" Pin incorrect  ");
                    await alert.dismiss().then(() => { });
                    this.presentPopover(" Pin incorrect ");
                  }
                });
              }
              else {
                await alert.dismiss();
                this.presentPopover("Pin doesn't match");
              }
            }
          }
        }
      ]
    });
    return alert.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      animated: true,
      position: "top",
    });
    toast.present();
  }

  async checkPIN(pin: any) {
    let PIN = await this.encdecService.hashPin(pin);
    if (this._profile.hashedPin === PIN) return true;
    else return false;
  }

}
