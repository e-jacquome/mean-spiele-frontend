/*
 * Copyright (C) 2015 - present Juergen Zimmermann, Hochschule Karlsruhe
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
    CanDeactivate,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { CreateFlugComponent } from './create-flug.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// https://angular.io/api/router/CanDeactivate
// https://angular.io/guide/router#can-deactivate-guard

@Injectable({ providedIn: 'root' })
export class CreateFlugGuard implements CanDeactivate<CreateFlugComponent> {
    constructor() {
        console.log('CreateFlugGuard.constructor()');
    }

    canDeactivate(
        createFlug: CreateFlugComponent,
        _: ActivatedRouteSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
        __: RouterStateSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (createFlug.fertig) {
            // Seite darf zur gewuenschten URL verlassen werden
            return true;
        }

        createFlug.showWarning = true;
        createFlug.fertig = true;
        console.warn('CreateFlugGuard.canDeactivate(): Verlassen der Seite');
        return false;
    }
}
