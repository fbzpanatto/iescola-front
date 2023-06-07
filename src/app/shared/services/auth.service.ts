import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { map, Observable, shareReplay, tap } from "rxjs";
import { ObjectLiteral } from "../interfaces/interfaces";
import {LoginModalService} from "./login-modal.service";

export interface Payload { token: string, expiresIn: number, role: number }

@Injectable({
  providedIn: 'root'
})

export class AuthService implements HttpInterceptor {

  private _token: string | null = null
  private _expiresIn: number | null = null
  private _role: number | null = null

  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:3333/'
  private payload = 'payload'

  private loginModal = inject(LoginModalService)

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')

    if(token && !this.isExpired()) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token)
      })
      return next.handle(cloned)
    } else {
      return next.handle(req)
    }
  }

  doLogin<T>(resource: string, data: T) {
    return this.http.post(this.apiUrl + resource, data)
      .pipe(
        map((response: ObjectLiteral) => { return response[this.payload] as Payload}),
        tap( async (payload) => { await this.setSession(payload ) } ),
        shareReplay()
      )
  }

  private async setSession(authResult: Payload) {

    const { token, expiresIn, role } = authResult

    this._token = token
    this._expiresIn = expiresIn
    this._role = role

    await this.setLocalData(authResult)
  }

  isExpired() {

    if(this._expiresIn) {
      return this._expiresIn * 1000 >= Date.now()
    }

    return !!this._expiresIn
  }

  private async getLocalData(key: string) {
    return localStorage.getItem(key)
  }

  private async setLocalData(authResult: Payload) {

    const { token, expiresIn} = authResult

    localStorage.setItem('token', token)
  }

  private async logout() {
    await this.removeLocalData()
  }

  private async removeLocalData() {
    localStorage.removeItem('token')
  }

  async token() {
    if (this._token) {
      return this._token;
    }

    const token = await this.getLocalData('token')
    if(token) {
      this._token = token
    }
    return this._token
  }

}
