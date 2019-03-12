import { PersistanceService } from "./providers/persistance/persistance.service";
import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  profile;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private persistanceService: PersistanceService
  ) {
    this.initializeApp();
    this.platform.pause.subscribe(() => {
      //this.router.navigate(['/lockscreen']);
    });

    platform.resume.subscribe(() => {

    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.persistanceService
        .getProfile()
        .then(profile => {
          if (profile === undefined) {
            this.profile = false;
          }else{
            this.profile = true;
          }
        })
        .then(() => {
          if (this.profile) {
            this.router.navigate(["home"]);
          } else if (!this.profile){
            this.router.navigate(["introduction"]);
          }
        });
    });
  }
}
