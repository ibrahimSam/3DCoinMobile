import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { Page2Page } from "./page2.page";

const routes: Routes = [
  {
    path: "",
    component: Page2Page
  },
  {
    path: "page3",
    loadChildren: "../../page3/page3.module#Page3PageModule"
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Page2Page]
})
export class Page2PageModule {}
