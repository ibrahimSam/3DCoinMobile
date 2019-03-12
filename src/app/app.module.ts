import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { File } from "@ionic-native/file/ngx";
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";
import { Profile } from "./models/profile/profile";
import { EncdecService } from "./providers/encdecservice/encdec.service";
import { QRCodeModule } from "angularx-qrcode";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { LockscreenComponent } from './pages/lockscreen/lockscreen.component';

@NgModule({
  declarations: [AppComponent, LockscreenComponent],
  entryComponents: [],
    
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,  QRCodeModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    QRScanner,
    FingerprintAIO,
    Profile,
    EncdecService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
