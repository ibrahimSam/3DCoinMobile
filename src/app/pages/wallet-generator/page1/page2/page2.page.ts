import { LoggerService } from '../../../../providers/logger/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
})
export class Page2Page implements OnInit {
  confirmationCode;
  telNumber;
  constructor(
    private logger: LoggerService,
    private routerAcivate: ActivatedRoute,
    private route: Router
  ) {
    this.routerAcivate.params.subscribe((params)=>{
      this.logger.log("tel number : " + JSON.stringify(params['telNumber']));
      this.telNumber = params['telNumber'];
    });
   }

  ngOnInit() {
  }
  
  empreintBTNClick(){

  }

  doneWGBTNClick(confirmationCode){
    this.logger.log("confirmationCode  "+ confirmationCode);
    if(!confirmationCode){
      return;
    }
    this.route.navigate(['wallet-generator/page1/page2/page3']);
  }
}
