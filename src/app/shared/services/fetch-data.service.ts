import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, shareReplay } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  constructor(private http: HttpClient) { }

  all<T>(resource: string) {
    return this.http.get('http://localhost:3333/' + resource)
      .pipe(map((response: { [key: string]: any }) => { return response['payload'] as T[]}))
  }

  getOneData<T>(resource: string, id: number) {
    return this.http.get('http://localhost:3333/' + resource + '/' + id)
      .pipe(map((response: { [key: string]: any }) => { return response['payload'] as T}))
  }

  getQueryData<T>(resource: string, query: string) {
    return this.http.get('http://localhost:3333/' + resource + '?' + query)
      .pipe(map((response: { [key: string]: any }) => { return response['payload'] as T[]}))
  }

  updateOneData<T>(resource: string, id: number, data: T) {
    return this.http.put('http://localhost:3333/' + resource + '/' + id, data)
      .pipe(map((response: { [key: string]: any }) => { return response['payload'] as T}))
  }
}
