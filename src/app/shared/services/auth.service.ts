import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _token?: string = 'super_secret'

  constructor() { }

  get token() {
    return this._token
  }

  set token(token ) {
    this._token = token
  }
}
