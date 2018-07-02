import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-happysad',
  templateUrl: './happysad.component.html',
  styleUrls: ['./happysad.component.css']
})
export class HappysadComponent implements OnInit {
  feelings:string;
  username:string = "";
  token:string = "";
  already:boolean;
  date:string;

  constructor(
    private dataService:DataService,
    public authService: AuthService,
    public router:Router
  ) { }

  ngOnInit() {
    this.username = this.authService.user;
    this.checkToday();
  }

  happy() {
    this.feelings = "happy";
  }

  sad() {
    this.feelings = "sad";
  }

  submit(){
    let token = this.authService.token;
    if(this.already) {
      // update feeling of the day
      var body = {
        username: this.username,
        feelings: this.feelings,
        dateTime: this.date // dateTime to modify
      }
      this.dataService.update(body, token).subscribe((res) => {
        // success
        this.router.navigate(['/profile']);
      });
    }
    else {
      // add feeling of the day
      var dateTime = new Date();
      var body = {
        username: this.username,
        feelings: this.feelings,
        dateTime: dateTime.toString()
      }
      this.dataService.save(body, token).subscribe((res) => {
        // success
        this.router.navigate(['/profile']);
      });
    }
  }

  // check if registered whiteshoes today
  checkToday() {
    this.dataService.today(this.username).subscribe((res) => {
      if(res == false) {
        this.already = false;
      } else {
        this.already = true;
        this.feelings = res.feelings;
        this.date = res.dateTime;
      }
    });
  }
}
