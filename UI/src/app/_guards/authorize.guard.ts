import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(this.authService, route, state);
    let destination = ["login"].concat(state.url.replace('/', '').split('/').map(x => x.replace('/', '')));
    let currentSection = destination[1];
    let requiredRole = "";
    switch (currentSection) {
        case 'errors':
        case 'settings':
            requiredRole = 'admin';
            break;

        case 'producer':
            requiredRole = 'producer';
            break;
    }
    if(this.authService.profile === undefined) {
      console.log("not logged in");
      this.router.navigate(destination);
      return false;
    } else {
      let checkRole = this.authService.requireRole(requiredRole);
      console.log("checkRole", checkRole); 
      if(checkRole) {
        return true;
      } else {
        this.router.navigate(destination);
        return false;
      }
    }
  }
}