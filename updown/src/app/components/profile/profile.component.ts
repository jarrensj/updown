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
      this.log = user[0].log.reverse();

      this.dates = [];
      this.calendar();
      this.populate();
    });

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
    console.log(this.dates);
  }

  populate() {
    // put feelings from log into calendar display
    console.log("log length: " + this.log.length);
    let temp;
    var j = 0;
    var k = 0;
    var diff;
    for(let i = 0; i < this.log.length; ++i) {
      temp = new Date(this.log[i].dateTime);
      console.log("temp(log): " + temp);
      console.log("j: " + j);
      console.log("k: " + k);
      console.log("calendar:" + this.dates[j][k].dateTime);
      console.log("same day: " + this.sameDay(this.dates[j][k].dateTime, temp));
      // same day
      if(this.sameDay(this.dates[j][k].dateTime, temp)){
        console.log("same day");
        this.difference(temp, this.dates[j][k].dateTime);
        // update
        console.log("update");
        this.dates[j][k].whiteshoes = this.log[i].whiteshoes;
        console.log(this.dates[j][k]);
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
          console.log("update");
          this.dates[j][k].whiteshoes = this.log[i].whiteshoes;
          console.log(this.dates[j][k]);
        }
        // if different month but same year, jump to month and that day
        else if(diff.m > 0 && diff.y == 0) {
          if(j + diff.m < this.dates.length) {
            j = j + diff.m; // jump to that month
            // jump to that day in that month
            k = this.dates[j].length - temp.getDate();
            // update
            console.log("update");
            this.dates[j][k].whiteshoes = this.log[i].whiteshoes;
            console.log(this.dates[j][k]);
          }
          else {
            // done
            break;
          }
        }
      }
      console.log("----");
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
    console.log("m: " + m);
    console.log("d: " + d);
    console.log("y: " + y);
    let diff = {
      m: m,
      d: d,
      y: y
    }
    return diff;
  }

}
