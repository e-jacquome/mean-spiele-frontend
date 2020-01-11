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

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Verlag } from '../../shared/flug';

/**
 * Komponente f&uuml;r das Tag <code>hs-update-verlag</code>
 */
@Component({
    selector: 'hs-update-verlag',
    templateUrl: './update-verlag.component.html',
})
export class UpdateVerlagComponent implements OnInit {
    // <hs-update-verlag [form]="form" [currentValue]="...">
    @Input()
    readonly form!: FormGroup;
    @Input()
    readonly currentValue: Verlag | undefined | '';

    verlag!: FormControl;

    ngOnInit() {
        console.log(
            'UpdateVerlagComponent.ngOnInit(): currentValue=',
            this.currentValue,
        );
        // siehe formControlName innerhalb @Component({templateUrl: ...})
        this.verlag = new FormControl(this.currentValue);
        this.form.addControl('verlag', this.verlag);
    }
}
