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
  whiteshoes:boolean;
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
        this.whiteshoes = res.whiteshoes;
        this.message = this.username + " is wearing white shoes today!";
      }
      else {
        this.whiteshoes = false;
        this.message = this.username + " is not wearing white shoes today!";
      }
    });
  }

}
