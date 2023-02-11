import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export const isLoggedIn = () => !!localStorage.getItem('token');

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('object', isLoggedIn(), state.url);

    switch (state.url) {
      case '/auth':
        if (isLoggedIn()) return this.router.navigate(['']).then(() => false);
        return true;

      default:
        if (isLoggedIn()) return true;
        return this.router.navigate(['/auth']).then(() => false);
    }
  }
}
