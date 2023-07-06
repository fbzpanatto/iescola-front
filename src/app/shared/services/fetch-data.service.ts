import { inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import { ObjectLiteral } from "../interfaces/interfaces";
import { LoginModalService } from "../components/login/login-modal.service";
import { Router} from "@angular/router";
import {
  SystemDialogMessagesServiceService
} from "../components/system-dialog-messages/system-dialog-messages-service.service";

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

  private systemDialogService = inject(SystemDialogMessagesServiceService)

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

    const { payload, resource } = error.error
    const { message } = payload

    switch (error.status) {
      case 401:
        this.loginModal.openLoginModal()
        break
      case 403:
        this.systemDialog({ title: 'Acesso negado', message: message, navigateTo: resource })
        break
      case 404:
        this.systemDialog({ title: 'Não encontrado', message: 'Não foi possível encontrar o registro solicitado.', navigateTo: resource })
        break
      case 409:
        this.systemDialog({ title: 'Conflito', message: 'Já existe um registro com o dado informado.', navigateTo: resource })
        break
      default:
        this.systemDialog({ title: 'Erro', message: 'Ocorreu um erro inesperado.', navigateTo: resource })
        this.router.navigate([''])
        break
    }
    return error
  }

  systemDialog(options: { title: string, message: string, navigateTo?: string}) {
    const { title, message } = options
    return this.systemDialogService.openPopup({ title, message })
      .afterClosed()
      .subscribe(() => this.router.navigate([options.navigateTo || '']))
  }
}
