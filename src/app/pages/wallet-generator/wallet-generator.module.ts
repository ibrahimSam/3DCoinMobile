import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { WalletGeneratorPage } from "./wallet-generator.page";

const routes: Routes = [
  {
    path: "",
    component: WalletGeneratorPage
  },
  {
    path: "page1",
    loadChildren: "./page1/page1.module#Page1PageModule"
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WalletGeneratorPage]
})
export class WalletGeneratorPageModule {}
