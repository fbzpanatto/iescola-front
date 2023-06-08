import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import {catchError, map, Observable, of, tap} from "rxjs";
import { UserLoginDataService } from "../services/user-login-data.service";
import {ActivatedRoute} from "@angular/router";
import {LoginModalService} from "../services/login-modal.service";

@Injectable({
  providedIn: 'root'
})

export class AuthService implements HttpInterceptor {

  private userLoginDataService = inject(UserLoginDataService)
  private state = inject(ActivatedRoute)
  private popup = inject(LoginModalService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.userLoginDataService.isValidToken) {
      const token = this.userLoginDataService.token
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      })
      return next.handle(authReq)
    }

    console.log('intercepted', req.url)

    return next.handle(req)
      .pipe(
        catchError((error: any) => {
          this.popup.openLoginModal()
          throw error
        })
      )
  }
}
