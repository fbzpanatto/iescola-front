import {inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Injectable({providedIn: 'root'})
class PermissionsService {
  canActivate(authService: AuthenticationService): boolean {

    return authService.isExpired();
  }
}

export const canActivateTeam: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(PermissionsService).canActivate(inject(AuthenticationService));
  };
