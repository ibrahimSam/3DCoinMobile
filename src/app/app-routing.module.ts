import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LockscreenComponent } from "./pages/lockscreen/lockscreen.component";

const routes: Routes = [
  //{ path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule'  },
  { path: 'root', loadChildren: './pages/root/root.module#RootPageModule' },
  { path: 'introduction', loadChildren: './pages/introduction/introduction.module#IntroductionPageModule' },
  { path: 'wallet-generator', loadChildren: './pages/wallet-generator/wallet-generator.module#WalletGeneratorPageModule' },
  { path: 'lockscreen', component: LockscreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
