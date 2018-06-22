import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  password: string;
  newPassword: string;

  username:string;
  token:any;

  constructor(
    private dataService:DataService,
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.username = this.authService.user;
    this.token = this.authService.token;
  }

  onSubmit({value, valid}:{value:any, valid:boolean}){
    this.dataService.changePassword(this.username, this.password, this.newPassword, this.token).subscribe((res) => {
      if(res){
        this.router.navigate(['/profile']);
      }
      else {

      }
    });
  }
}
