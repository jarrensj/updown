import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email:string;
  username:string;
  password:string;
  message:string;

  constructor(
    private dataService:DataService,
    public router: Router
  ) { }

  ngOnInit() {
    var script = document.createElement("script");
    script.setAttribute("id", "script");
    script.setAttribute("src", 'https://www.google.com/recaptcha/api.js');
    document.body.appendChild(script);
  }

  onSubmit({value, valid}:{value:any, valid:boolean}){
    let account = {
      email: value.email.toLowerCase(),
      username: value.username.toLowerCase(),
      password: value.password,
      captcha: (<HTMLInputElement>document.querySelector('#g-recaptcha-response')).value
    }
    this.dataService.register(account).subscribe((res) => {
      if(res === true){
        // successful registration
        this.router.navigate(['/login']);
      }
      else {
        console.log(res);
        this.message = res.message;

      }
    });
  }
}
