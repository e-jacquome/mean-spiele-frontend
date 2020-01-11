/*
 * Copyright (C) 2018 - present Juergen Zimmermann, Hochschule Karlsruhe
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

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * Komponente f&uuml;r das Tag <code>hs-update-titel</code>
 */
@Component({
    selector: 'hs-update-titel',
    templateUrl: './update-titel.component.html',
})
export class UpdateTitelComponent implements OnInit {
    private static readonly MIN_LENGTH = 2;

    // <hs-update-titel [form]="form" [currentValue]="...">
    @Input()
    readonly form!: FormGroup;
    @Input()
    readonly currentValue!: string;

    titel!: FormControl;

    readonly faExclamationCircle = faExclamationCircle;

    ngOnInit() {
        console.log(
            'UpdateTitelComponent.ngOnInit(): currentValue=',
            this.currentValue,
        );
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.titel = new FormControl(
            this.currentValue,
            Validators.compose([
                Validators.required,
                Validators.minLength(UpdateTitelComponent.MIN_LENGTH),
                Validators.pattern(/^\w.*$/u),
            ]),
        );
        this.form.addControl('titel', this.titel);
    }
}
