import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  filenames:string[];
  constructor(
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.dataService.getPhotos().subscribe((res) => {
      this.filenames = res;
    });
  }

}
