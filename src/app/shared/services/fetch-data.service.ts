import { inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import { ObjectLiteral } from "../interfaces/interfaces";
import { LoginModalService } from "../components/login/login-modal.service";
import { Router} from "@angular/router";

const PAYLOAD = 'payload'

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
    return this.http.get<T>(this.apiUrl + resource + '/' + id)
      .pipe(
        map((response: T) => { return response[PAYLOAD as keyof T]}),
        catchError((error: any) => this.errorHandling(error))
      ) as Observable<T>
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

    // TODO: improve error handling with an popup

    switch (error.status) {
      case 401:
        this.loginModal.openLoginModal()
        break
      case 403:
        alert('Você não tem permissão editar esse registro')
        this.router.navigate([''])
        break
      case 404:
        alert(error.error.payload ?? 'Registro não encontrado')
        break
      case 409:
        alert('Já existe um registro com esses dados')
        break
      default:
        alert('Algo deu errado, tente novamente mais tarde')
        this.router.navigate([''])
        break
    }
    return error
  }
}
