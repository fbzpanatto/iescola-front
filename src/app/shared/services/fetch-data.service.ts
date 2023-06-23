import { inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs";
import { ObjectLiteral } from "../interfaces/interfaces";
import { LoginModalService } from "../components/login/login-modal.service";
import { Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  apiUrl = 'http://localhost:3333/'
  payload = 'payload'

  private loginModal = inject(LoginModalService)
  private router = inject(Router)
  private http = inject(HttpClient)

  all<T>(resource: string) {
    return this.http.get(this.apiUrl + resource)
      .pipe(
        map((response: ObjectLiteral) => { return response[this.payload] as T[]}),
        catchError((error: any) => this.errorHandling(error))
      )
  }

  getOneData<T>(resource: string, id: number) {
    return this.http.get(this.apiUrl + resource + '/' + id)
      .pipe(
        map((response: ObjectLiteral) => { return response[this.payload] as T}),
        catchError((error: any) => this.errorHandling(error))
      )
  }

  getQueryData<T>(resource: string, query: string) {
    return this.http.get(this.apiUrl + resource + '?' + query)
      .pipe(
        map((response: ObjectLiteral) => { return response[this.payload] as T[]}),
        catchError((error: any) => this.errorHandling(error))
      )
  }

  createOneData<T>(resource: string, data: T) {
    return this.http.post(this.apiUrl + resource, data)
      .pipe(
        map((response: ObjectLiteral) => { return response[this.payload] as T}),
        catchError((error: any) => this.errorHandling(error))
      )
  }

  updateOneDataWithId<T>(resource: string, id: number, data: T) {
    return this.http.put(this.apiUrl + resource + '/' + id, data)
      .pipe(
        map((response: ObjectLiteral) => { return response[this.payload] as T}),
        catchError((error: any) => this.errorHandling(error))
      )
  }

  updateOneDataWithBody<T>(resource: string, data: T) {
    return this.http.put(this.apiUrl + resource, data)
      .pipe(
        map((response: ObjectLiteral) => { return response[this.payload] as T}),
        catchError((error: any) => this.errorHandling(error))
      )
  }

  deleteOneData<T>(resource: string, id: number) {
    return this.http.delete(this.apiUrl + resource + '/' + id)
      .pipe(
        map((response: ObjectLiteral) => { return response[this.payload] as T}),
        catchError((error: any) => this.errorHandling(error))
      )
  }

  errorHandling(error: any) {

    switch (error.status) {
      case 401:
        this.loginModal.openLoginModal()
        break
      default:
        this.router.navigate([''])
        break
    }
    return error
  }
}
