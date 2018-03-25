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

  constructor(private dataService:DataService,  public authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.user;
    let token = this.authService.token;
    this.dataService.getProfile(this.user, token).subscribe((user)=> {
      this.firstName = user[0].firstName;
      this.log = user[0].log;
    })
  }

}
