import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserLoginDataService } from "./user-login-data.service";

@Injectable({
  providedIn: 'root'
})

export class AuthService implements HttpInterceptor {

  private userLoginDataService = inject(UserLoginDataService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userLoginDataService.isValidToken) {
      const token = this.userLoginDataService.token
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      })
      return next.handle(authReq)
    }
    return next.handle(req)
  }
}
