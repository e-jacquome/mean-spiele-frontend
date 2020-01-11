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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HOME_PATH } from '../../shared';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Komponente f&uuml;r das Login mit dem Tag &lt;hs-login-logout&gt;.
 */
@Component({
    selector: 'hs-login-logout',
    templateUrl: './login-logout.component.html',
})
export class LoginLogoutComponent implements OnInit, OnDestroy {
    username: string | undefined;
    password: string | undefined;
    notLoggedIn!: boolean;

    readonly faSignOutAlt = faSignOutAlt;

    private isLoggedInSubscription!: Subscription;

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
    ) {
        console.log('LoginLogoutComponent.constructor()');
    }

    ngOnInit() {
        // Initialisierung, falls zwischenzeitlich der Browser geschlossen wurde
        this.notLoggedIn = !this.authService.isLoggedIn;
        this.isLoggedInSubscription = this.subscribeLogin();
    }

    ngOnDestroy() {
        this.isLoggedInSubscription.unsubscribe();
    }

    onLogin() {
        console.log('LoginLogoutComponent.onLogin()');
        return this.authService.login(this.username, this.password);
    }

    /**
     * Ausloggen und dabei Benutzername und Passwort zur&uuml;cksetzen.
     */
    onLogout() {
        console.log('LoginLogoutComponent.onLogout()');
        this.authService.logout();
        return this.router.navigate([HOME_PATH]);
    }

    /**
     * Methode, um den injizierten <code>AuthService</code> zu beobachten,
     * ob es Login-Informationen gibt. Diese private Methode wird in der Methode
     * <code>ngOnInit</code> aufgerufen.
     */
    private subscribeLogin() {
        const next = (event: boolean) => {
            if (this.notLoggedIn && !event) {
                // Noch nicht eingeloggt und ein Login-Event kommt, d.h.
                // es gab einen Login-Versuch, der aber fehlerhaft (= false) war
                // TODO: Anzeige des fehlgeschlagenen Logins
                console.warn('AuthComponent: Falsche Login-Daten', event);
            }
            this.notLoggedIn = !event;
            console.log('AuthComponent.notLoggedIn:', this.notLoggedIn);
        };

        // Observable.subscribe() aus RxJS liefert ein Subscription Objekt,
        // mit dem man den Request abbrechen ("cancel") kann
        // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md
        // http://stackoverflow.com/questions/34533197/what-is-the-difference-between-rx-observable-subscribe-and-foreach
        // https://xgrommx.github.io/rx-book/content/observable/observable_instance_methods/subscribe.html
        // Funktion als Funktionsargument, d.h. Code als Daten uebergeben
        return this.authService.isLoggedInSubject.subscribe(next);
    }
}
