import { ContactComponent } from "./modals/contact/contact.component";
import { AddressesComponent } from "./modals/addresses/addresses.component";
import { Network } from "@ionic-native/network/ngx";
import { LoggerService } from "./../../providers/logger/logger.service";
import { Profile } from "./../../models/profile/profile";
import { PersistanceService } from "./../../providers/persistance/persistance.service";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MenuController, ModalController } from "@ionic/angular";
import { EncdecService } from "./../../providers/encdecservice/encdec.service";
import { HttpClient } from "@angular/common/http";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { map } from "rxjs/operators";
import { OverlayEventDetail } from "@ionic/core";
import { SecurityComponent } from "./modals/security/security.component";
import { ExchangeComponent } from "./modals/exchange/exchange.component";
import { DisconnectComponent } from "./modals/disconnect/disconnect.component";
import { T3dcoinComponent } from "./modals/t3dcoin/t3dcoin.component";

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

export interface DATAT {
  pagesTotal: number;
  txs: [
    {
      blockhash: string;
      blockheight: number;
      blocktime: number;
      confirmations: number;
      fees: number;
      locktime: number;
      size: number;
      time: number;
      txid: string;
      valueIn: number;
      valueOut: number;
      version: number;
      vin: [
        {
          addr: string;
          doubleSpentTxID: string;
          n: number;
          scriptSig: {
            hex: string;
            asm: string;
          };
          sequence: number;
          txid: string;
          value: number;
          valueSat: number;
          vout: number;
        }
      ];
      vout: [
        {
          n: number;
          scriptPubKey: {
            addresses: [];
            asm: string;
            hex: string;
            type: string;
          };
          spentHeight: string;
          spentIndex: string;
          spentTxId: string;
          value: number;
        }
      ];
    }
  ];
}

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  menuItems: any[] = [
    "Security",
    "Exchange",
    "Addresses",
    "3Dcoin",
    "Contact",
    "Disconnect"
  ];
  pubKey: string = "";
  privKey: string = "";
  _3dctitle = "3DCoin wallet";
  _yourBalance = "Your Balance :   ";
  _balanceAmount: number = 0;
  _3dcAddressQrCode = [];
  inputs = [];
  menuQRCode: string = " ";
  _yourWebURL = "https://3dcstats.net/address/";
  _yourWebURL2 = "";
  _addressBalance: number;
  _addressBalanceURL = "https://3dcstats.net/insight-api/addr/+";
  _3dcstatsUrl = "https://3dcstats.net/insight-api/addr/";
  addressesList = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menu: MenuController,
    private storage: PersistanceService,
    private encdecService: EncdecService,
    private http: HttpClient,
    private profile: Profile,
    private logger: LoggerService,
    private network: Network,
    private modalctrl: ModalController
  ) { }

  initProfile(): any {
    this.storage.getProfile().then(async profile => {

      this.pubKey = profile.hdWallet[0].address;
      this.menuQRCode = this.pubKey;

      this._3dcAddressQrCode = [];
      this._balanceAmount = 0;
      this.addressesList = [];
      for (let i = 0; i < profile.hdWallet.length; i++) {
        this._3dcAddressQrCode.push(profile.hdWallet[i].address);

        let address = profile.hdWallet[i].address;
        let walletAmount = 0;

        let walletParams = await this.getAllUnspentInput(
          profile.hdWallet[i].address
        );
        for (let i = 0; i < walletParams.length; i++) {
          walletAmount += walletParams[i].amount;
        }
        let a = { index: i + 1, address: address, amount: walletAmount };
        this.addressesList.push(a);
        this._balanceAmount += walletAmount;
      }

      //this.addressesList = this.orderAddressesList(this.addressesList);
      this._yourWebURL2 = this._yourWebURL + this.pubKey;
    });
  }

  getAllUnspentInput(pubkey: string) {
    return this.http
      .get<Array<UnspentInput>>(this._3dcstatsUrl + pubkey + "/utxo")
      .toPromise();
  }

  openWebWallet(address) {
    window.open(
      "https://3dcstats.net/address/" + address,
      "_blank",
      "location=yes"
    );
  }
  openFWebWallet() {
    window.open(
      "https://3dcstats.net/address/" + this.pubKey,
      "_blank",
      "location=yes"
    );
  }

  ionViewDidEnter() {
    this.initProfile();
    setTimeout(() => {
      this.logger.log("lock wallet ");
    }, 1000);
  }

  goToReceive() {
    this.router.navigate(["/home/receive-tab"], {
      queryParams: { address: this._3dcAddressQrCode }
    });
  }
  goToSend() {
    this.router.navigate(["/home/send-tab"], { queryParams: { totalbalance: this._balanceAmount } });
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
  ngOnInit() {
    this.menu.enable(true, "first");
  }

  menuOpen() {
    this.logger.log("open menu " + this.menuQRCode);
    this.menu.open("first");
  }

  menuClose() {
    this.logger.log("close menu ");
    this.menu.close("first");
  }

  async openModal(modal) {
    this.logger.log("item clicked " + modal);
    switch (modal) {
      case "Security":
        const securityModal = await this.modalctrl.create({
          component: SecurityComponent,
          componentProps: { value: 123 },
          showBackdrop: true,
          backdropDismiss: true
        });

        await securityModal.present();
        securityModal.onDidDismiss().then(data => {
          console.log("data " + JSON.stringify(data));
        });

        break;

      case "Exchange":
        const exchangeModal = await this.modalctrl.create({
          component: ExchangeComponent,
          componentProps: { value: 123 },
          showBackdrop: true,
          backdropDismiss: true
        });

        await exchangeModal.present();
        exchangeModal.onDidDismiss().then(data => { });

        break;

      case "Addresses":
        const addressesModal = await this.modalctrl.create({
          component: AddressesComponent,
          componentProps: { value: 123 },
          showBackdrop: true,
          backdropDismiss: true
        });

        await addressesModal.present();
        addressesModal.onDidDismiss().then(data => {
          console.log("data " + data.data.result);
        });

        break;

      case "3Dcoin":
        const _3dcoinModal = await this.modalctrl.create({
          component: T3dcoinComponent,
          componentProps: { value: 123 },
          showBackdrop: true,
          backdropDismiss: true
        });

        await _3dcoinModal.present();
        _3dcoinModal.onDidDismiss().then(data => { });

        break;

      case "Contact":
        const contactModal = await this.modalctrl.create({
          component: ContactComponent,
          componentProps: { value: 123 },
          showBackdrop: true,
          backdropDismiss: true
        });

        await contactModal.present();
        contactModal.onDidDismiss().then(data => { });

        break;

      case "Disconnect":
        const disconnectModal = await this.modalctrl.create({
          component: DisconnectComponent,
          componentProps: { value: 123 },
          showBackdrop: true,
          backdropDismiss: true
        });

        await disconnectModal.present();
        disconnectModal.onDidDismiss().then(data => { });
        break;

      default:
        break;
    }
    this.menu.close();
  }

  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }
}

/*       this.http
        .get<DATAT>(
          "https://3dcstats.net/insight-api/txs/?address=" + this.pubKey
        )
        .subscribe(data => {
          this.inputs = [];
          for (let index = 0; index < data.txs.length; index++) {
            const element = data.txs[index];

            for (let index = 0; index < element.vin.length; index++) {
              const e = element.vin[index];
              let elementType = e.vout == 0 ? "input" : "output";
              let elementTime = this.timeConverter(element.time);
              let value = e.value;
              let opts = { elementType, elementTime, value };
              console.log("opts " + opts);
              this.inputs.push(opts);
            }
          }
        }); */

/*
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log("network was disconnected :-(");
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log("network connected!");
      setTimeout(() => {
        if (this.network.type === "wifi") {
          console.log("we got a wifi connection, woohoo!");
        }
      }, 3000);
    }); */
