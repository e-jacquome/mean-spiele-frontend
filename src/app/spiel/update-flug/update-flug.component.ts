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
import { Spiel } from '../shared/spiel';
import { SpielService } from '../shared/spiel.service';
import { HttpStatus } from '../../shared';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

/**
 * Komponente f&uuml;r das Tag <code>hs-update-spiel</code> mit Kindkomponenten
 * f&uuml;r die folgenden Tags:
 * <ul>
 *  <li> <code>hs-stammdaten</code>
 *  <li> <code>hs-schlagwoerter</code>
 * </ul>
 */
@Component({
    selector: 'hs-update-spiel',
    templateUrl: './update-spiel.component.html',
})
export class UpdateSpielComponent implements OnInit, OnDestroy {
    spiel: Spiel | undefined;
    errorMsg: string | undefined;

    private spielSubscription!: Subscription;
    private errorSubscription!: Subscription;
    private idParamSubscription!: Subscription;
    private findByIdSubscription: Subscription | undefined;

    constructor(
        private readonly spielService: SpielService,
        private readonly titleService: Title,
        private readonly route: ActivatedRoute,
    ) {
        console.log('UpdateSpielComponent.constructor()');
    }

    ngOnInit() {
        // Die Beobachtung starten, ob es ein zu aktualisierendes Spiel oder
        // einen Fehler gibt.
        this.spielSubscription = this.subscribeSpiel();
        this.errorSubscription = this.subscribeError();

        // Pfad-Parameter aus /spiele/:id/update
        this.idParamSubscription = this.subscribeIdParam();

        this.titleService.setTitle('Aktualisieren');
    }

    ngOnDestroy() {
        this.spielSubscription.unsubscribe();
        this.errorSubscription.unsubscribe();
        this.idParamSubscription.unsubscribe();

        if (this.findByIdSubscription !== undefined) {
            this.findByIdSubscription.unsubscribe();
        }
    }

    private subscribeSpiel() {
        const next = (spiel: Spiel) => {
            this.errorMsg = undefined;
            this.spiel = spiel;
            console.log('UpdateSpiel.spiel=', this.spiel);
        };
        return this.spielService.spielSubject.subscribe(next);
    }

    /**
     * Beobachten, ob es einen Fehler gibt.
     */
    private subscribeError() {
        const next = (err: string | number | undefined) => {
            this.spiel = undefined;

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
                    this.errorMsg = 'Kein Spiel vorhanden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`UpdateSpielComponent.errorMsg: ${this.errorMsg}`);
        };

        return this.spielService.errorSubject.subscribe(next);
    }

    private subscribeIdParam() {
        const next = (params: Params) => {
            console.log('params=', params);
            this.findByIdSubscription = this.spielService.findById(params.id);
        };
        // ActivatedRoute.params is an Observable
        return this.route.params.subscribe(next);
    }
}
