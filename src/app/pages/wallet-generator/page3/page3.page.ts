import { Router } from '@angular/router';
import { LoggerService } from './../../../providers/logger/logger.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page3',
  templateUrl: './page3.page.html',
  styleUrls: ['./page3.page.scss'],
})
export class Page3Page implements OnInit {
  pinVal: string;
  confPinVal: string;
  constructor(
    private logger: LoggerService,
    private route: Router
  ) { }

  ngOnInit() {
  }

  empreintBTNClick(){

  }

  doneWGBTNClick(pinVal, confPinVal){
    if(pinVal != confPinVal){
      return;
    }
    this.route.navigate(["/home"]);
  }
}
