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
  constructor(
    private dataService:DataService,
    public authService: AuthService,
    public router:Router
  ) { }

  ngOnInit() {
    this.username = this.authService.user;
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
}
