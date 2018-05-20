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

  constructor(
    private dataService:DataService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit({value, valid}:{value:any, valid:boolean}){
    let account = {
      email: value.email,
      username: value.username,
      password: value.password
    }
    this.dataService.register(account).subscribe((res) => {
      if(res){
        // successful registration
        this.router.navigate(['/login']);
      }
      else {

      }
    });
  }
}
