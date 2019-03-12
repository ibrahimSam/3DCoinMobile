import { QRCodeModule } from "angularx-qrcode";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { HomePage } from "./home.page";
import { AddressesComponent } from "./modals/addresses/addresses.component";
import { ContactComponent } from "./modals/contact/contact.component";
import { SecurityComponent } from "./modals/security/security.component";
import { ExchangeComponent } from "./modals/exchange/exchange.component";
import { DisconnectComponent } from "./modals/disconnect/disconnect.component";
import { T3dcoinComponent } from "./modals/t3dcoin/t3dcoin.component";

const routes: Routes = [
  {
    path: "",
    component: HomePage,
    children: []
  },
  {
    path: "contact-tab",
    loadChildren: "./contact-tab/contact-tab.module#ContactTabPageModule"
  },
  {
    path: "send-tab",
    loadChildren: "./send-tab/send-tab.module#SendTabPageModule"
  },
  {
    path: "send-tab/:totalbalane:/pubkey",
    loadChildren: "./send-tab/send-tab.module#SendTabPageModule"
  },
  {
    path: "receive-tab",
    loadChildren: "./receive-tab/receive-tab.module#ReceiveTabPageModule"
  },
  {
    path: "receive-tab/:address",
    loadChildren: "./receive-tab/receive-tab.module#ReceiveTabPageModule"
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HomePage,
    AddressesComponent,
    ContactComponent,
    SecurityComponent,
    ExchangeComponent,
    T3dcoinComponent,
    DisconnectComponent
  ],
  entryComponents: [
    AddressesComponent,
    ContactComponent,
    SecurityComponent,
    ExchangeComponent,
    T3dcoinComponent,
    DisconnectComponent
  ]
})
export class HomePageModule {}
