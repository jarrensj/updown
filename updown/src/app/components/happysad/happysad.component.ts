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
  whiteshoes:boolean;
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
    this.checkIfWednesday();
    this.checkToday();
  }

  happy() {
    this.whiteshoes = true;
  }

  sad() {
    this.whiteshoes = false;
  }

  submit(){
    // check if same day still before commit
    // this.checkToday();

    let token = this.authService.token;
    if(this.already) {
      // update feeling of the day
      var body = {
        username: this.username,
        whiteshoes: this.whiteshoes,
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
        whiteshoes: this.whiteshoes,
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
    this.dataService.today(this.username, this.authService.token).subscribe((res) => {
      if(res == false) {
        this.already = false;
      } else {
        this.already = true;
        this.whiteshoes = res.whiteshoes;
        this.date = res.dateTime;
      }
    });
  }

  checkIfWednesday() {
    var date = new Date();
    if(date.getDay() == 3) {
      return true;
    }
    else {
      return false;
    }
  }
}
