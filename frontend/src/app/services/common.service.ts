import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = "/api/v1/user_input";

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  constructor(private http: HttpClient) { }

  create(data): Observable<any> {
    return this.http.post(baseUrl, data);
  }
}
