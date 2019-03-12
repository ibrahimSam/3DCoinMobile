import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSlides } from "@ionic/angular";
@Component({
  selector: "app-introduction",
  templateUrl: "./introduction.page.html",
  styleUrls: ["./introduction.page.scss"]
})

export class IntroductionPage implements OnInit {
  @ViewChild('slider') slider: IonSlides;
  Skip: string = "SKIP";
  constructor() {}
  ngOnInit() {}

  ionSlideDidChange(){
   this.slider.getActiveIndex().then(index=>{
     console.log("current index : "+ index);
     if(index==1){
      this.Skip = "Got it !";
     }else{
      this.Skip = "SKIP";
     }
   })
  }
}
