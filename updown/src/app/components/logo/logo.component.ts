import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})

export class LogoComponent implements OnInit {
  logo = [
    "assets/Blue-W.png",
    "assets/Mint-W.png",
    "assets/Pink-W.png"
  ]
  state = 0;

  constructor() { }

  ngOnInit() { }

  changeLogo() {
    ++this.state;
    if(this.state > this.logo.length-1){
      this.state = 0;
    }
  }

}
