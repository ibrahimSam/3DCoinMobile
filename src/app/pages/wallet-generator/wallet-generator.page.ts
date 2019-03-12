import { LoggerService } from "./../../providers/logger/logger.service";
import { Component, OnInit } from "@angular/core";
import { WalletService } from "src/app/providers/wallet/wallet.service";
import { Router } from "@angular/router";
import { PersistanceService } from "src/app/providers/persistance/persistance.service";
import { EncdecService } from "src/app/providers/encdecservice/encdec.service";

@Component({
  selector: "app-wallet-generator",
  templateUrl: "./wallet-generator.page.html",
  styleUrls: ["./wallet-generator.page.scss"]
})
export class WalletGeneratorPage implements OnInit {
  notificationAlreadyReceived = false;
  seedValue: string;
  pinValue: string;
  constructor(
    private logger: LoggerService,
    private wallet: WalletService,
    private route: Router,
    private persistanceService: PersistanceService,
    private encdecService: EncdecService
  ) {}

  ngOnInit() {}

  async doneWGBTNClick(seed, pin) {
    this.logger.log("seed  " + seed);
    if (!seed || !pin) {
      return;
    }
    let newHashedPin = await this.encdecService.hashPin(pin);
    let _wallet = await this.wallet.newHDWallet(seed);
    this.encdecService.encrypt(_wallet.privkey, pin).then(cipherKey => {
      this.encdecService
        .encrypt(_wallet.derived.keys.wif, pin)
        .then(cipherWif => {
          let _hdwallet = [
            {
              wif: _wallet.derived.keys.wif,
              address: _wallet.derived.keys.address,
              childIndex: _wallet.derived.child_index
            }
          ];
          let opts = {
            //seed: this.encdecService.encrypt(seed, pin),
            masterPrivKey: cipherKey,
            hdWallet: _hdwallet,
            onboardingCompleted: true,
            hashedPin: newHashedPin,
            selectedPubKey : 0
          };
          this.persistanceService.storeNewProfile(opts).then(() => {
            this.route.navigate(["home"]);
          });
          let people = [{
            createdOn:  Date.now(),
            pubkey: _wallet.derived.keys.address,
            label: "moi",
            tel: "",
            email: "",
          }]
          this.persistanceService.storeNewContact(people);
        });
    });
  }
}

/* 
    let newHashedPin = await this.encdecService.hashPin(pin);
    this.logger.log("newHashedPin   " + newHashedPin);
    this.logger.log("generate new keys ");
    let wallet = await this.wallet.newPrivkey(seed);
    var t = JSON.parse(JSON.stringify(wallet));

    var opts = {};
    let encprivkey = this.encdecService.encrypt(t.wif, pin);
    encprivkey.then(cipher => {
      opts = {
        //seed: this.encdecService.encrypt(seed, pin),
        privkey: cipher,
        hashedPin: newHashedPin,
        pubkey: [t.address],
        onboardingCompleted: true,
        selectedPubKey: 0
      };
      this.persistanceService.storeNewProfile(opts).then(() => {
        this.route.navigate(["home"]);
      });
    });
 */

/*     var opts = {
      seed: this.encdecService.encrypt(seed, pin),
      privkey: this.encdecService.encrypt(t.wif, pin),
      hashedPin: newHashedPin,
      pubkey: t.address,
      onboardingCompleted: true
    }; */
