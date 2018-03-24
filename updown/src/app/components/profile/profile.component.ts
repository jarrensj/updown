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
  username:string = "";
  firstName:string;
  log:Log[];

  constructor(private dataService:DataService,  public authService: AuthService) { }

  ngOnInit() {
    console.log(this.username);
    this.username = this.authService.user;
    console.log(this.username);

    this.dataService.getProfile(this.username).subscribe((user)=> {
      console.log(user);
      this.firstName = user[0].firstName;
      this.log = user[0].log;
    })
  }

}
