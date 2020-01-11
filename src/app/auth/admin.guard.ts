/*
 * Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// https://angular.io/guide/router#can-activate-guard
// https://angular.io/api/router/CanActivate
// https://blog.angularindepth.com/new-in-angular-v7-1-updates-to-the-router-fd67d526ad05

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
    ) {
        console.log('AdminGuard.constructor()');
    }

    canActivate(
        _: ActivatedRouteSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
        __: RouterStateSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (this.authService.isAdmin) {
            console.log('AdminGuard.canActivate(): admin');
            return true;
        }

        console.warn('AdminGuard.canActivate(): nicht "admin"');
        // Navigation wird abgebrochen ("cancelled") und zum neuen Pfad umgeleitet
        return this.router.createUrlTree(['/']);
    }
}
