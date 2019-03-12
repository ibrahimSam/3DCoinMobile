import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { Page1Page } from "./page1.page";

const routes: Routes = [
  {
    path: "",
    component: Page1Page
  },
  {
    path:"page2",
    loadChildren: "./page2/page2.module#Page2PageModule",
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Page1Page]
})
export class Page1PageModule {}
