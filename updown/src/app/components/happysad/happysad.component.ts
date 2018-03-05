import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-happysad',
  templateUrl: './happysad.component.html',
  styleUrls: ['./happysad.component.css']
})
export class HappysadComponent implements OnInit {
  feeling:string;
  username:string = "jarrensj";
  constructor(private dataService:DataService) { }

  ngOnInit() {
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
