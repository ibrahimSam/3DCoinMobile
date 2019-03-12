import { PersistanceService } from './../../../providers/persistance/persistance.service';
import { WalletService } from "./../../../providers/wallet/wallet.service";
import { Router, RouterLink } from "@angular/router";
import { LoggerService } from "./../../../providers/logger/logger.service";
import { Component, OnInit } from "@angular/core";
import { EncdecService } from 'src/app/providers/encdecservice/encdec.service';

@Component({
  selector: "app-page1",
  templateUrl: "./page1.page.html",
  styleUrls: ["./page1.page.scss"]
})
export class Page1Page implements OnInit {
  seedValue: string;
  telNumber;
  constructor(
    private logger: LoggerService,
    private wallet: WalletService,
    private route: Router,
    private persistanceService : PersistanceService,
    private encdecService: EncdecService
  ) {}

  ngOnInit() {}

  doneWGBTNClick(seedValue, telNumber) {
    this.logger.log("seed  " + seedValue);
    if (!seedValue) {
      return;
    }
    this.logger.log("generate new keys ");
    this.wallet
      .newPrivkey(seedValue)
      .then(wallet => {
        console.log("wallet geberated : " + wallet);
        var t = JSON.parse(JSON.stringify(wallet));
        var opts = {
          seed : this.encdecService.encrypt(seedValue,"1234"),
          privkey: this.encdecService.encrypt(t.wif,"1234"),
          pubkey: t.address,
          onboardingCompleted: true
        };
        this.persistanceService.storeNewProfile(opts);
      })
      .then(() => {
        this.route.navigate([
          "wallet-generator/page1/page2",
          { telNumber: telNumber }
        ]); //, {telNumber: telNumber}
      })
      .catch(error => {
        console.log("error occured :  " + error);
      });
  }
}
