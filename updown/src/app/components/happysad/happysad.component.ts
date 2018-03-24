import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-happysad',
  templateUrl: './happysad.component.html',
  styleUrls: ['./happysad.component.css']
})
export class HappysadComponent implements OnInit {
  feeling:string;
  username:string = "";
  constructor(private dataService:DataService, public authService: AuthService) { }

  ngOnInit() {
    this.username = this.authService.user;
  }

  happy() {
    console.log("happy");
    this.feeling = "happy";
  }

  sad() {
    console.log("sad");
    this.feeling = "sad";
  }

  submit(){
    var dateTime = new Date();
    var body = {
      username: this.username,
      feeling: this.feeling,
      dateTime: dateTime
    }
    this.dataService.save(body).subscribe();
  }
}
