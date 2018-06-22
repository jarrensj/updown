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
  log:Log[]; // log of dates with recorded whiteshoes
  dates:any = []; // calendar (last 8 months)
  showWednesdays:boolean = true;

  constructor(private dataService:DataService,  public authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.user;
    let token = this.authService.token;
    this.setupCalendar();
    this.dataService.getProfile(this.user, token).subscribe((user)=> {
      this.firstName = user[0].firstName;
      if(user[0].log) {
        this.log = user[0].log.reverse();
      }
      else {
        this.log = [];
      }
      this.populate();
    });

  }

  // this.dates gets last 8 months of days
  setupCalendar() {
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
      for (var j = days_in_month[last8months[i]]; j > 0; --j) {
        temp = {
          dateTime: new Date((last8months[i] + 1)+ '/' + j + '/' + theYears[i]),
          whiteshoes: false
        }
        temp_month.push(temp);
      }
      this.dates.push(temp_month);
      temp_month = [];
    }
  }

  // transfer feelings from log to calendar (last 8 months)
  populate() {
    // put feelings from log into calendar display
    let temp;
    var j = 0;
    var k = 0;
    var diff;
    for(let i = 0; i < this.log.length; ++i) {
      temp = new Date(this.log[i].dateTime);
      // same day
      if(this.sameDay(this.dates[j][k].dateTime, temp)){
        this.difference(temp, this.dates[j][k].dateTime);
        // update
        this.dates[j][k].whiteshoes = this.log[i].whiteshoes;
        // move onto next day
        if(k < this.dates[j].length - 1) {
          ++k;
        }
        else {
          // move onto next month
          if(j < this.dates.length - 1){
            ++j;
            k = 0;
          }
          // if past last 8 months
          else {
            // done
            break;
          }
        }
      }
      else {
        // difference
        diff = this.difference(this.dates[j][k].dateTime, temp);
        // if different day but same month, jump to that day
        if(diff.m == 0 && diff.d > 0 && diff.y == 0) {
          k = k + diff.d; // jump to that day
          // update
          this.dates[j][k].whiteshoes = this.log[i].whiteshoes;
        }
        // if different month but same year, jump to month and that day
        else if(diff.m > 0 && diff.y == 0) {
          if(j + diff.m < this.dates.length) {
            j = j + diff.m; // jump to that month
            // jump to that day in that month
            k = this.dates[j].length - temp.getDate();
            // update
            this.dates[j][k].whiteshoes = this.log[i].whiteshoes;
          }
          else {
            // done
            break;
          }
        }
      }
    }
  }


  // check if same day
  sameDay(date1, date2){
    date1 = new Date(date1);
    date2 = new Date(date2);
    if(date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate() && date1.getFullYear() === date2.getFullYear()) {
      return true;
    } else {
      return false;
    }
  }

  difference(date1, date2) {
    date1 = new Date(date1); // log
    date2 = new Date(date2); // calendar
    let m = date1.getMonth() - date2.getMonth();
    let d = date1.getDate() - date2.getDate();
    let y = date1.getFullYear() - date2.getFullYear();
    let diff = {
      m: m,
      d: d,
      y: y
    }
    return diff;
  }

  toggleCalendar(){
    this.showWednesdays = !this.showWednesdays;
  }

}
