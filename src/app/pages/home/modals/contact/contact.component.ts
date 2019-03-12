import { ModalController } from '@ionic/angular';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      result: "123"
    });
  }

  open3dcoin(){
     window.open("https://www.3dcoin.io/", "location=yes");
  }

  openDistricts(){
    window.open("https://www.districts.io/", "_blank", "location=yes");
 }

  sendMSG(){

  }
}
