import { HttpClient } from '@angular/common/http';
import { ModalController } from "@ionic/angular";
import { LoggerService } from "src/app/providers/logger/logger.service";
import { PersistanceService } from "src/app/providers/persistance/persistance.service";
import { Profile } from "./../../../../models/profile/profile";
import { Component, OnInit } from "@angular/core";
import { UnspentInput } from '../../send-tab/send-tab.page';

export interface addressOpts {
  index: number;
  address: string;
  amount: number;
}

@Component({
  selector: "app-addresses",
  templateUrl: "./addresses.component.html",
  styleUrls: ["./addresses.component.scss"]
})
export class AddressesComponent implements OnInit {
  adressesList = [];
  selectedAddress: number;
  profile: Profile;
  _3dcstatsUrl = "https://3dcstats.net/insight-api/addr/";
  constructor(
    private storage: PersistanceService,
    private logger: LoggerService,
    private modalController: ModalController,
    private http : HttpClient
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.getProfile().then(async _profile => {
      this.profile = _profile;
      for (let i = 0; i < this.profile.hdWallet.length; i++) {
        this.logger.log(
          "this.profile.hdWallet[index].address; " +
            this.profile.hdWallet[i].address
        );
        let address = this.profile.hdWallet[i].address;
        let walletAmount = 0;

        let walletParams = await this.getAllUnspentInput(
          this.profile.hdWallet[i].address
        );
        for (let i = 0; i < walletParams.length; i++) {
          walletAmount += walletParams[i].amount;
        }
        let a = { index: i + 1, address: address, amount: walletAmount };
        this.adressesList.push(a);
      }
    });
  }

  itemClicked(index) {
    this.logger.debug("address selected : " + (index + 1));
  }

  dismiss() {
    this.modalController.dismiss({
      result: "123"
    });
  }

  getAllUnspentInput(pubkey: string) {
    return this.http
      .get<Array<UnspentInput>>(this._3dcstatsUrl + pubkey + "/utxo")
      .toPromise();
  }
}
