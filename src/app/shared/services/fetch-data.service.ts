import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  constructor(private http: HttpClient) { }

  getAllData<T>() {
    return this.http.get<T>('http://localhost:3333/year');
  }
}
