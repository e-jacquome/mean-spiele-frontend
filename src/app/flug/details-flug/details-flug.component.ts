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

import { ActivatedRoute, Params } from '@angular/router';
import { AuthService, ROLLE_ADMIN } from '../../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Flug } from '../shared/flug';
import { FlugService } from '../shared/flug.service';
import { HttpStatus } from '../../shared';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

/**
 * Komponente f&uuml;r das Tag <code>hs-details-flug</code>
 */
@Component({
    selector: 'hs-details-flug',
    templateUrl: './details-flug.component.html',
})
export class DetailsFlugComponent implements OnInit, OnDestroy {
    waiting = true;
    flug: Flug | undefined;
    errorMsg: string | undefined;
    isAdmin!: boolean;

    private flugSubscription!: Subscription;
    private errorSubscription!: Subscription;
    private idParamSubscription!: Subscription;
    private isAdminSubscription!: Subscription;
    private findByIdSubscription: Subscription | undefined;

    // eslint-disable-next-line max-params
    constructor(
        private readonly flugService: FlugService,
        private readonly titleService: Title,
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
    ) {
        console.log('DetailsFlugComponent.constructor()');
    }

    ngOnInit() {
        // Die Beobachtung starten, ob es ein zu darzustellendes Flug oder
        // einen Fehler gibt.
        this.flugSubscription = this.subscribeFlug();
        this.errorSubscription = this.subscribeError();
        this.idParamSubscription = this.subscribeIdParam();

        // Initialisierung, falls zwischenzeitlich der Browser geschlossen wurde
        this.isAdmin = this.authService.isAdmin;
        this.isAdminSubscription = this.subscribeIsAdmin();
    }

    ngOnDestroy() {
        this.flugSubscription.unsubscribe();
        this.errorSubscription.unsubscribe();
        this.idParamSubscription.unsubscribe();
        this.isAdminSubscription.unsubscribe();

        if (this.findByIdSubscription !== undefined) {
            this.findByIdSubscription.unsubscribe();
        }
    }

    private subscribeFlug() {
        const next = (flug: Flug) => {
            this.waiting = false;
            this.flug = flug;
            console.log('DetailsFlugComponent.flug=', this.flug);
            const titel =
                this.flug === undefined
                    ? 'Details'
                    : `Details ${this.flug._id}`;
            this.titleService.setTitle(titel);
        };
        return this.flugService.flugSubject.subscribe(next);
    }

    private subscribeError() {
        const next = (err: string | number | undefined) => {
            this.waiting = false;
            if (err === undefined) {
                this.errorMsg = 'Ein Fehler ist aufgetreten.';
                return;
            }

            if (typeof err === 'string') {
                this.errorMsg = err;
                return;
            }

            this.errorMsg =
                err === HttpStatus.NOT_FOUND
                    ? 'Kein Flug gefunden.'
                    : 'Ein Fehler ist aufgetreten.';
            console.log(`DetailsFlugComponent.errorMsg: ${this.errorMsg}`);

            this.titleService.setTitle('Fehler');
        };

        return this.flugService.errorSubject.subscribe(next);
    }

    private subscribeIdParam() {
        // Pfad-Parameter aus /fluege/:id
        // UUID (oder Mongo-ID) ist ein String
        const next = (params: Params) => {
            console.log(
                'DetailsFlugComponent.subscribeIdParam(): params=',
                params,
            );
            this.findByIdSubscription = this.flugService.findById(params.id);
        };
        // ActivatedRoute.params ist ein Observable
        return this.route.params.subscribe(next);
    }

    private subscribeIsAdmin() {
        const nextIsAdmin = (event: Array<string>) => {
            this.isAdmin = event.includes(ROLLE_ADMIN);
            console.log(
                `DetailsFlugComponent.subscribeIsAdmin(): isAdmin=${this.isAdmin}`,
            );
        };
        return this.authService.rollenSubject.subscribe(nextIsAdmin);
    }
}
