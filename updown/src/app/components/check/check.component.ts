import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  username:string;
  feelings:string;
  message:string;
  isLoggedIn:boolean;

  constructor(
    private dataService:DataService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  onSubmit({value, valid}:{value:any, valid:boolean}){
    this.dataService.today(this.username).subscribe((res) => {
      if(res) {
        this.feelings = res.feelings; // happy or sad
        this.message = this.username + " is " + this.feelings;
      }
      else {
        // they have not recorded yet today
        this.feelings = null;
        this.message = this.username + " has not shared yet today";
      }
    });
  }

}
