import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username:string = "jarrensj";
  firstName:string;
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.dataService.getProfile(this.username).subscribe((user)=> {
      console.log(user);
      this.firstName = user[0].firstName;
    })
  }

}
