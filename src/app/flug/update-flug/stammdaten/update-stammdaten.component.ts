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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    faCheck,
    faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Flug } from '../../shared/flug';
import { FlugService } from '../../shared/flug.service';
import { FormGroup } from '@angular/forms';
import { HOME_PATH } from '../../../shared';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Komponente f&uuml;r das Tag <code>hs-update-stammdaten</code>
 */
@Component({
    selector: 'hs-update-stammdaten',
    templateUrl: './update-stammdaten.component.html',
})
export class UpdateStammdatenComponent implements OnInit, OnDestroy {
    // <hs-update-stammdaten [flug]="...">
    @Input()
    readonly flug!: Flug;

    readonly form = new FormGroup({});

    readonly faCheck = faCheck;
    readonly faExclamationCircle = faExclamationCircle;

    private updateSubscription: Subscription | undefined;

    constructor(
        private readonly flugService: FlugService,
        private readonly router: Router,
    ) {
        console.log('UpdateStammdatenComponent.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Stammdaten des zu &auml;ndernden Flugs vorbelegen.
     */
    ngOnInit() {
        console.log('UpdateStammdatenComponent.ngOnInit(): flug=', this.flug);
    }

    ngOnDestroy() {
        if (this.updateSubscription !== undefined) {
            this.updateSubscription.unsubscribe();
        }
    }

    /**
     * Die aktuellen Stammdaten f&uuml;r das angezeigte Flug-Objekt
     * zur&uuml;ckschreiben.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    // eslint-disable-next-line max-lines-per-function
    onUpdate() {
        if (this.form.pristine) {
            console.log(
                'UpdateStammdatenComponent.onUpdate(): keine Aenderungen',
            );
            return undefined;
        }

        if (this.flug === undefined) {
            console.error(
                'UpdateStammdatenComponent.onUpdate(): flug === undefined',
            );
            return undefined;
        }

        // rating, preis und rabatt koennen im Formular nicht geaendert werden
        this.flug.updateStammdaten(
            this.form.value.titel,
            this.form.value.art,
            this.form.value.verlag,
            this.form.value.rating,
            this.flug.datum,
            this.flug.preis,
            this.flug.rabatt,
            this.form.value.isbn,
        );
        console.log('flug=', this.flug);

        const successFn = () => {
            console.log(
                `UpdateStammdaten.onUpdate(): successFn: path: ${HOME_PATH}`,
            );
            this.router.navigate([HOME_PATH]).then(
                navResult => {
                    if (navResult) {
                        console.log('UpdateStammdaten.onUpdate(): Navigation');
                    } else {
                        console.error(
                            'UpdateStammdaten.onUpdate(): Navigation fehlgeschlagen',
                        );
                    }
                },
                () =>
                    console.error(
                        'UpdateStammdaten.onUpdate(): Navigation fehlgeschlagen',
                    ),
            );
        };
        const errorFn: (
            status: number,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            errors: { [s: string]: any } | undefined,
        ) => void = (status, errors = undefined) => {
            console.error(
                `UpdateStammdatenComponent.onUpdate(): errorFn(): status: ${status}, errors=`,
                errors,
            );
        };

        this.updateSubscription = this.flugService.update(
            this.flug,
            successFn,
            errorFn,
        );

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false;
    }
}
