import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { ObjectLiteral } from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  apiUrl = 'http://localhost:3333/'
  payload = 'payload'

  constructor(private http: HttpClient) { }

  all<T>(resource: string) {
    return this.http.get(this.apiUrl + resource)
      .pipe(map((response: ObjectLiteral) => { return response[this.payload] as T[]}))
  }

  getOneData<T>(resource: string, id: number) {
    return this.http.get(this.apiUrl + resource + '/' + id)
      .pipe(map((response: ObjectLiteral) => { return response[this.payload] as T}))
  }

  getQueryData<T>(resource: string, query: string) {
    return this.http.get(this.apiUrl + resource + '?' + query)
      .pipe(map((response: ObjectLiteral) => { return response[this.payload] as T[]}))
  }

  createOneData<T>(resource: string, data: T) {
    return this.http.post(this.apiUrl + resource, data)
      .pipe(map((response: ObjectLiteral) => { return response[this.payload] as T}))
  }

  updateOneDataWithId<T>(resource: string, id: number, data: T) {
    return this.http.put(this.apiUrl + resource + '/' + id, data)
      .pipe(map((response: ObjectLiteral) => { return response[this.payload] as T}))
  }

  updateOneDataWithBody<T>(resource: string, data: T) {
    return this.http.put(this.apiUrl + resource, data)
      .pipe(map((response: ObjectLiteral) => { return response[this.payload] as T}))
  }

  deleteOneData<T>(resource: string, id: number) {
    return this.http.delete(this.apiUrl + resource + '/' + id)
      .pipe(map((response: ObjectLiteral) => { return response[this.payload] as T}))
  }
}
