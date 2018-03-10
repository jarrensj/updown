import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email:string;
  username:string;
  password:string;

  constructor(private dataService:DataService) { }

  ngOnInit() {
  }

  onSubmit({value, valid}:{value:any, valid:boolean}){
    console.log(value);
    let account = {
      email: value.email,
      username: value.username,
      password: value.password
    }
    this.dataService.register(account).subscribe();
  }

}
