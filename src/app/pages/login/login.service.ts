import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(public http: HttpClient) { }

  login(body: any): Observable<any> {
    return this.http.post('/user/login', body);
  }
}
