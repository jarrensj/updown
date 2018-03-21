import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggedIn:string;

  constructor(private dataService:DataService, public router: Router) { }

  ngOnInit() {
  }

  onSubmit({value, valid}:{value:any, valid:boolean}){
    console.log(value);
    let account = {
      username: value.username,
      password: value.password
    }
    this.dataService.login(account).subscribe((user) => {
      // success
      this.loggedIn = user[0].username;
      console.log(this.loggedIn);
      this.router.navigate(['/profile']);
      console.log(this.loggedIn);
    });

  }
}
