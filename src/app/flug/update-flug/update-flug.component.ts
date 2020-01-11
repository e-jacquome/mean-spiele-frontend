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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Flug } from '../shared/flug';
import { FlugService } from '../shared/flug.service';
import { HttpStatus } from '../../shared';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

/**
 * Komponente f&uuml;r das Tag <code>hs-update-flug</code> mit Kindkomponenten
 * f&uuml;r die folgenden Tags:
 * <ul>
 *  <li> <code>hs-stammdaten</code>
 *  <li> <code>hs-schlagwoerter</code>
 * </ul>
 */
@Component({
    selector: 'hs-update-flug',
    templateUrl: './update-flug.component.html',
})
export class UpdateFlugComponent implements OnInit, OnDestroy {
    flug: Flug | undefined;
    errorMsg: string | undefined;

    private flugSubscription!: Subscription;
    private errorSubscription!: Subscription;
    private idParamSubscription!: Subscription;
    private findByIdSubscription: Subscription | undefined;

    constructor(
        private readonly flugService: FlugService,
        private readonly titleService: Title,
        private readonly route: ActivatedRoute,
    ) {
        console.log('UpdateFlugComponent.constructor()');
    }

    ngOnInit() {
        // Die Beobachtung starten, ob es ein zu aktualisierendes Flug oder
        // einen Fehler gibt.
        this.flugSubscription = this.subscribeFlug();
        this.errorSubscription = this.subscribeError();

        // Pfad-Parameter aus /fluege/:id/update
        this.idParamSubscription = this.subscribeIdParam();

        this.titleService.setTitle('Aktualisieren');
    }

    ngOnDestroy() {
        this.flugSubscription.unsubscribe();
        this.errorSubscription.unsubscribe();
        this.idParamSubscription.unsubscribe();

        if (this.findByIdSubscription !== undefined) {
            this.findByIdSubscription.unsubscribe();
        }
    }

    private subscribeFlug() {
        const next = (flug: Flug) => {
            this.errorMsg = undefined;
            this.flug = flug;
            console.log('UpdateFlug.flug=', this.flug);
        };
        return this.flugService.flugSubject.subscribe(next);
    }

    /**
     * Beobachten, ob es einen Fehler gibt.
     */
    private subscribeError() {
        const next = (err: string | number | undefined) => {
            this.flug = undefined;

            if (err === undefined) {
                this.errorMsg = 'Ein Fehler ist aufgetreten.';
                return;
            }

            if (typeof err === 'string') {
                this.errorMsg = err;
                return;
            }

            switch (err) {
                case HttpStatus.NOT_FOUND:
                    this.errorMsg = 'Kein Flug vorhanden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`UpdateFlugComponent.errorMsg: ${this.errorMsg}`);
        };

        return this.flugService.errorSubject.subscribe(next);
    }

    private subscribeIdParam() {
        const next = (params: Params) => {
            console.log('params=', params);
            this.findByIdSubscription = this.flugService.findById(params.id);
        };
        // ActivatedRoute.params is an Observable
        return this.route.params.subscribe(next);
    }
}
