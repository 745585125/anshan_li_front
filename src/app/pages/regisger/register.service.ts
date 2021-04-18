import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(public http: HttpClient) { }

  register(body: any): Observable<any> {
    return this.http.post('/user/register', body);
  }
}
