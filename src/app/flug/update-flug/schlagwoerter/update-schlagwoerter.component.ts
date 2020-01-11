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
import { FormControl, FormGroup } from '@angular/forms';
import { Flug } from '../../shared/flug';
import { FlugService } from '../../shared/flug.service';
import { HOME_PATH } from '../../../shared';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * Komponente f&uuml;r das Tag <code>hs-schlagwoerter</code>
 */
@Component({
    selector: 'hs-update-schlagwoerter',
    templateUrl: './update-schlagwoerter.component.html',
})
export class UpdateSchlagwoerterComponent implements OnInit, OnDestroy {
    // <hs-update-schlagwoerter [flug]="...">
    @Input()
    readonly flug!: Flug;

    form!: FormGroup;
    javascript!: FormControl;
    typescript!: FormControl;

    readonly faCheck = faCheck;

    private updateSubscription: Subscription | undefined;

    constructor(
        private readonly flugService: FlugService,
        private readonly router: Router,
    ) {
        console.log('UpdateSchlagwoerterComponent.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Schlagwoertern des zu &auml;ndernden Flugs vorbelegen.
     */
    ngOnInit() {
        console.log('flug=', this.flug);

        // Definition und Vorbelegung der Eingabedaten (hier: Checkbox)
        const hasJavaScript = this.flug.hasSchlagwort('JAVASCRIPT');
        this.javascript = new FormControl(hasJavaScript);
        const hasTypeScript = this.flug.hasSchlagwort('TYPESCRIPT');
        this.typescript = new FormControl(hasTypeScript);

        this.form = new FormGroup({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            javascript: this.javascript,
            typescript: this.typescript,
        });
    }

    ngOnDestroy() {
        if (this.updateSubscription !== undefined) {
            this.updateSubscription.unsubscribe();
        }
    }

    /**
     * Die aktuellen Schlagwoerter f&uuml;r das angezeigte Flug-Objekt
     * zur&uuml;ckschreiben.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    // eslint-disable-next-line max-lines-per-function
    onUpdate() {
        if (this.form.pristine) {
            console.log(
                'UpdateSchlagwoerterComponent.onUpdate(): keine Aenderungen',
            );
            return undefined;
        }

        if (this.flug === undefined) {
            console.error(
                'UpdateSchlagwoerterComponent.onUpdate(): flug === undefined',
            );
            return undefined;
        }

        this.flug.updateSchlagwoerter(
            this.javascript.value,
            this.typescript.value,
        );
        console.log('flug=', this.flug);

        const successFn = () => {
            console.log(
                `UpdateSchlagwoerterComponent.onUpdate(): successFn: path: ${HOME_PATH}`,
            );
            this.router.navigate([HOME_PATH]).then(
                navResult => {
                    if (navResult) {
                        console.log(
                            'UpdateSchlagwoerterComponent.onUpdate(): Navigation',
                        );
                    } else {
                        console.error(
                            'UpdateSchlagwoerterComponent.onUpdate(): Navigation fehlgeschlagen',
                        );
                    }
                },
                () =>
                    console.error(
                        'UpdateSchlagwoerterComponent.onUpdate(): Navigation fehlgeschlagen',
                    ),
            );
        };
        const errorFn: (
            status: number,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            errors: { [s: string]: any } | undefined,
        ) => void = (status, errors = undefined) => {
            console.error(
                `UpdateSchlagwoerterComponent.onUpdate(): errorFn(): status: ${status}, errors=`,
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
