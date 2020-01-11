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

import { Component, Input } from '@angular/core';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * Komponente f&uuml;r die Darstellung einer Fehlermeldung durch das Tag
 * &lt;hs-error-message [text]="..."&gt;
 */
@Component({
    selector: 'hs-error-message',
    // ggf. Sweetalert2 https://github.com/sweetalert2/sweetalert2
    template: `
        <div class="text-danger" *ngIf="text">
            <fa-icon [icon]="faExclamationCircle"></fa-icon>
            <span class="font-weight-bold ml-1">{{ text }}</span>
        </div>
    `,
})
export class ErrorMessageComponent {
    // Property Binding: <hs-error-message [text]="...">
    // siehe InputMetadata
    @Input()
    text: string | undefined;

    readonly faExclamationCircle = faExclamationCircle;

    constructor() {
        console.log('ErrorMessageComponent.constructor()');
    }
}
