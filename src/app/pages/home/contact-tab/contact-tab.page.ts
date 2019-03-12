import { Contacts } from "./../../../models/contacts/contacts";
import { PersistanceService } from "src/app/providers/persistance/persistance.service";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { LoggerService } from "src/app/providers/logger/logger.service";
import { EncdecService } from "src/app/providers/encdecservice/encdec.service";
import { Component, OnInit } from "@angular/core";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertController, ToastController } from "@ionic/angular";

@Component({
  selector: "app-contact-tab",
  templateUrl: "./contact-tab.page.html",
  styleUrls: ["./contact-tab.page.scss"]
})
export class ContactTabPage implements OnInit {

  _result;
  people = Contacts[""];
  show = true;
  state;
  divstate = "divshow";
  constructor(
    private encdecService: EncdecService,
    private logger: LoggerService,
    private faio: FingerprintAIO,
    private qrScanner: QRScanner,
    private atrCtrl: AlertController,
    private storage: PersistanceService,
    private toastController: ToastController,
    private router: Router,
  ) { }

  ngOnInit() { }
  ionViewDidEnter() {
    this.initContactList();
  }
  initContactList(): any {
    this.people = [];
    this.storage.getContact().then(contact => {
      for (let index = 0; index < contact.length; index++) {
        let person = {
          createdOn: contact[index].createdOn,
          pubkey: contact[index].pubkey,
          label: contact[index].label,
          tel: contact[index].tel,
          email: contact[index].email
        };
        this.people.push(person);
      }
    });
  }

  showFP() {
    this.faio
      .isAvailable()
      .then(result => {
        if (result === "finger" || result === "face") {

          this.logger.log(" Fingerprint or Face Auth is available");
          this.faio
            .show({
              clientId: "myAppName",
              clientSecret: "0000", 
              disableBackup: false, 
              localizedFallbackTitle: "Use Pin",
              localizedReason: "Please Authenticate"
            })
            .then(result => {
              this.logger.log(" result " + JSON.stringify(result));
              this._result = result.withFingerprint;
              if (result == "Success") {
                this.logger.log(" result Success " + result.withFingerprint);
              } else {
                this.logger.log(" result err " + result);
              }
            })
            .catch((error: any) => {
              this.logger.log(" error  " + error);
            });
        }
      })
      .catch(() => {
        this._result = "Fingerprint is not available ";
      });
  }

  async addNewContact(address) {
    const alert = await this.atrCtrl.create({
      header: "Add new person",
      cssClass: "alertcssclass",
      inputs: [
        {
          name: "pubkey",
          placeholder: address
        },
        {
          name: "label",
          placeholder: "Label"
        },
        {
          name: "email",
          placeholder: "Email"
        },
        {
          name: "phone",
          placeholder: "Phone"
        }
      ],
      buttons: [
        {
          text: "Save",
          role: "Save",
          cssClass: "secondary",

          handler: data => {
            this.logger.log("add new person : " + address);
            let contact = {
              createdOn: Date.now(),
              pubkey: address,
              label: data.label,
              tel: data.tel || "",
              email: data.email || ""
            };
            this.storage.storeContact(contact);
            this.presentToast(address);
            this.people.push(contact);
          }
        }
      ]
    });
    await alert.present();
  }

  send(person) {
    this.logger.log("send to " + person.label + " key  " + person.pubkey);
    this.router.navigate(["/home/send-tab"], {
      queryParams: { pubkey: person.pubkey }
    });

  }
  remove(person) {
    this.logger.log("remove " + person.label);
    if (person.label != "moi") {
      this.storage.deleteContact(person).then(data => {
        this.logger.log("after remove  " + JSON.stringify(data));
        let contact = JSON.parse(JSON.stringify(data));
        this.people = [];
        for (let index = 0; index < contact.length; index++) {
          let person = {
            createdOn: contact[index].createdOn,
            pubkey: contact[index].pubkey,
            label: contact[index].label,
            tel: contact[index].tel,
            email: contact[index].email
          };
          this.people.push(person);
        }
        //this.initContactList();
      });
    }
  }

  scanqr() {
    // Optionally request the permission early
    this.state = "show";
    this.divstate = "divhide";
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          //alert("authorized");
          let scanSub = this.qrScanner.scan().subscribe((address: string) => {
            this.logger.log("Scanned address :  ", address);

            this.state = "hide";
            this.divstate = "divshow";
            this.qrScanner.destroy();
            this.qrScanner.hide();
            scanSub.unsubscribe();
            this.addNewContact(address);
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

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      animated: true,
      position: "top",
    });
    toast.present();
  }
}
