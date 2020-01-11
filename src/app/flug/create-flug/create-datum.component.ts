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
import { FormControl, FormGroup } from '@angular/forms';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * Komponente mit dem Tag &lt;hs-create-datum&gt;, um das Erfassungsformular
 * f&uuml;r ein neues Flug zu realisieren.
 */
@Component({
    selector: 'hs-create-datum',
    templateUrl: './create-datum.component.html',
})
export class CreateDatumComponent implements OnInit {
    @Input()
    readonly form!: FormGroup;

    readonly datum = new FormControl(undefined);

    readonly faExclamationCircle = faExclamationCircle;

    ngOnInit() {
        console.log('CreateDatumComponent.ngOnInit');
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.form.addControl('datum', this.datum);
    }
}
