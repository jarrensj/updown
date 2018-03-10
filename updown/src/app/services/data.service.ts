import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  private headers = new Headers({'Content-Type': 'application/json'})
  constructor(public http:Http) { }

  save(feeling) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/feeling', JSON.stringify(feeling), {headers: this.headers})
      .map(res => res.json());
  }

  getProfile(username){
    return this.http.get('http://localhost:3000/user/'+username)
      .map(res => res.json());
  }

  register(account){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/register', JSON.stringify(account), {headers: this.headers})
      .map(res => res.json());
  }

}
