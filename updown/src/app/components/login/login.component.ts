import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggedIn:string;
  status: boolean;

  constructor(
    private dataService:DataService,
    public router: Router,
    public authService: AuthService
  ) {
    this.setStatus();
  }

  ngOnInit() {
  }

  setStatus() {
    this.status = this.authService.isLoggedIn;
  }
  onSubmit({value, valid}:{value:any, valid:boolean}){
    let account = {
      username: value.username,
      password: value.password
    }
    this.dataService.login(account).subscribe((res) => {
      // login successful
      this.loggedIn = res.user[0].username;
      this.authService.user = res.user[0].username;
      this.authService.token = res.token;
      this.authService.isLoggedIn = true;
      this.router.navigate(['/profile']);
    });

  }
}
