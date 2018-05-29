import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Log } from '../../models/Log';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:string = "";
  firstName:string;
  log:Log[];
  dates:any;

  constructor(private dataService:DataService,  public authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.user;
    let token = this.authService.token;

    this.dataService.getProfile(this.user, token).subscribe((user)=> {
      this.firstName = user[0].firstName;
      this.log = user[0].log;
    });
    this.dates = [];
    this.calendar();
  }

  calendar() {
    var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // get date
    var today = new Date();
    // get last eight months
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var last8months = [];
    var theYears = [];
    var temp;
    var prevYear = false;
    for (var i = 1; i < 9; ++i) {
      temp = month - i;
      if(temp < 0) {
        temp = temp + 12;
        theYears.push(year - 1);
        prevYear = true;
      }
      else {
        prevYear = false;
      }
      if(temp >= 0) {
        last8months.push(temp);
        if(!prevYear) {
          theYears.push(year);
        }
      }
    }
    // make an array of all the dates in the last eight months
    // last eight months
    var temp_month = [];
    for (var i = 0; i < 8; ++i) {
      // go through the amount of days in each of those months
      for (var j = days_in_month[last8months[i]]; j > 1; --j) {
        temp = (last8months[i] + 1)+ '/' + j + '/' + theYears[i];
        temp_month.push(new Date(temp));
      }
      this.dates.push(temp_month);
      temp_month = [];
    }
    console.log(this.dates);
  }

}
