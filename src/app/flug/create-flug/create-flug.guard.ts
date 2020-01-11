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
import { CreateSpielComponent } from './create-spiel.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// https://angular.io/api/router/CanDeactivate
// https://angular.io/guide/router#can-deactivate-guard

@Injectable({ providedIn: 'root' })
export class CreateSpielGuard implements CanDeactivate<CreateSpielComponent> {
    constructor() {
        console.log('CreateSpielGuard.constructor()');
    }

    canDeactivate(
        createSpiel: CreateSpielComponent,
        _: ActivatedRouteSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
        __: RouterStateSnapshot, // eslint-disable-line @typescript-eslint/no-unused-vars
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (createSpiel.fertig) {
            // Seite darf zur gewuenschten URL verlassen werden
            return true;
        }

        createSpiel.showWarning = true;
        createSpiel.fertig = true;
        console.warn('CreateSpielGuard.canDeactivate(): Verlassen der Seite');
        return false;
    }
}
