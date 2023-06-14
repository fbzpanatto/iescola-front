import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const localStorageToken = localStorage.getItem('token')

    if (localStorageToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + localStorageToken)
      })
      return next.handle(authReq)
    }

    return next.handle(req)
  }
}
