import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  private headers = new Headers({'Content-Type': 'application/json'})
  constructor(public http:Http) { }

  save(whiteshoes, token) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + token);
    return this.http.post('http://localhost:3000/whiteshoes', JSON.stringify(whiteshoes), {headers: headers})
      .map(res => res.json());
  }

  update(whiteshoes, token) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + token);
    return this.http.put('http://localhost:3000/whiteshoes', JSON.stringify(whiteshoes), {headers: headers})
      .map(res => res.json());
  }

  getProfile(username, token){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + token);
    return this.http.get('http://localhost:3000/user/'+username, {headers: headers})
      .map(res => res.json());
  }

  register(account){
    return this.http.post('http://localhost:3000/register', JSON.stringify(account), {headers: this.headers})
      .map(res => res.json());
  }

  login(account){
    return this.http.post('http://localhost:3000/login', JSON.stringify(account), {headers: this.headers})
      .map(res => res.json());
  }

  today(username, token) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + token);
    return this.http.get('http://localhost:3000/'+username+'/today', {headers: headers})
      .map(res => res.json());
  }

  getPhotos() {
    return this.http.get('http://localhost:3000/photos')
      .map(res => res.json());
  }

}
