import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class DataService {
  apiURL = environment.apiURL;
  private headers = new Headers({'Content-Type': 'application/json'})
  constructor(public http:Http) { }

  save(whiteshoes, token) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + token);
    return this.http.post(this.apiURL + '/whiteshoes', JSON.stringify(whiteshoes), {headers: headers})
      .map(res => res.json());
  }

  update(whiteshoes, token) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + token);
    return this.http.put(this.apiURL + '/whiteshoes', JSON.stringify(whiteshoes), {headers: headers})
      .map(res => res.json());
  }

  getProfile(username, token){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + token);
    return this.http.get(this.apiURL + '/user/' + username, {headers: headers})
      .map(res => res.json());
  }

  register(account){
    return this.http.post(this.apiURL + '/register', JSON.stringify(account), {headers: this.headers})
      .map(res => res.json());
  }

  login(account){
    return this.http.post(this.apiURL + '/login', JSON.stringify(account), {headers: this.headers})
      .map(res => res.json());
  }

  today(username, token) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Bearer " + token);
    return this.http.get(this.apiURL + '/user/' + username + '/today', {headers: headers})
      .map(res => res.json());
  }

  getPhotos() {
    return this.http.get(this.apiURL + '/photos')
      .map(res => res.json());
  }

}
