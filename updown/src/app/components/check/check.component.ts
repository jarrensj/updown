import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  username:string;
  whiteshoes:boolean;

  constructor(
    private dataService:DataService
  ) { }

  ngOnInit() {
  }

  onSubmit({value, valid}:{value:any, valid:boolean}){
    this.dataService.today(this.username).subscribe((res) => {
      if(res) {
        this.whiteshoes = res.whiteshoes;
      }
      else {
        this.whiteshoes = false;
      }
    });
  }

}
