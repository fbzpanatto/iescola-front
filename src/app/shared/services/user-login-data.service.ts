import { inject, Injectable} from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { LoginComponent } from "../components/login/login.component";
import { map, shareReplay } from "rxjs";

export interface Payload { token: string, expiresIn: number, role: number }

@Injectable({
  providedIn: 'root'
})
export class UserLoginDataService {

  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:3333/'
  private payload = 'payload'

  private _token: string | null = null
  private _expiresIn: number | null = null

  nextUserLoginData(data: any, dialogRef: MatDialogRef<LoginComponent>) {

    this.http.post(this.apiUrl + 'login', data)
      .pipe(
        map((r: any) => r[this.payload] as Payload),
        shareReplay()
      )
      .subscribe({
        next: async (r: Payload) => {
          await this.sessionConfigs(r)
          dialogRef.close(r)
        },
        error: (e: any) => { console.log('dialogError', e) },
        complete: () => { this.reloadCurrentPage() }
      })
  }

  async sessionConfigs(authResult: Payload) {

    this._token = authResult.token
    this._expiresIn = authResult.expiresIn

    localStorage.setItem('token', authResult.token)
  }

  get isValidToken() {
    return this._token !== null && this._expiresIn !== null && this._expiresIn * 1000 > Date.now()
  }

  get token() {
    return this._token
  }

  reloadCurrentPage() {
    location.reload()
  }
}
