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
  feeling:string;
  username:string = "";
  token:string = "";
  already:boolean; // if they already registered a feeling today

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
    this.feeling = "happy";
  }

  sad() {
    this.feeling = "sad";
  }

  submit(){
    var dateTime = new Date();
    var body = {
      username: this.username,
      feeling: this.feeling,
      dateTime: dateTime
    }
    let token = this.authService.token;
    this.dataService.save(body, token).subscribe((res) => {
      // success
      this.router.navigate(['/profile']);
    });
  }

  // check if registered up or down already today
  checkToday() {
    this.dataService.today(this.username, this.authService.token).subscribe((res) => {
      if(res == false) {
        this.already = false;
      } else {
        this.already = true;
        this.feeling = res.feeling;
      }
    });
  }
}
