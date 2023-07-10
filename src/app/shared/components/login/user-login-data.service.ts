import { inject, Injectable} from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { LoginComponent } from "./login.component";
import {catchError, map} from "rxjs";
import { Router } from "@angular/router";
import {FetchDataService} from "../../services/fetch-data.service";

export interface Payload { token: string, expiresIn: number, role: number }

@Injectable({
  providedIn: 'root'
})
export class UserLoginDataService {

  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:3333/'
  private payload = 'payload'
  private router = inject(Router)

  private _tokenIsValid = false

  nextUserLoginData(data: any, dialogRef: MatDialogRef<LoginComponent>) {

    this.http.post(this.apiUrl + 'login', data)
      .pipe(
        map((r: any) => r[this.payload] as Payload)
      )
      .subscribe({
        next: async (r: Payload) => {
          this.tokenIsValid = true
          await this.reloadCurrentPage(r)
          dialogRef.close(r)
        },
        error: (e: any) => { console.log('loginError', e) }
      })
  }

  async sessionConfigs(authResult: Payload) {

    localStorage.setItem('token', authResult.token)
  }

  get token() {
    return localStorage.getItem('token')
  }

  async reloadCurrentPage(r: Payload) {
    window.location.reload()
    await this.sessionConfigs(r)
  }

  async clear() {
    localStorage.removeItem('token')
    await this.router.navigate(['/'])
  }

  get tokenIsValid() {
    return this._tokenIsValid
  }

  set tokenIsValid(value: boolean) {
    this._tokenIsValid = value
  }
}
