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

/**
 * Komponente f&uuml;r das Tag <code>hs-details-titel</code>
 */
@Component({
    selector: 'hs-details-titel',
    template: `
        <div class="row mt-2">
            <label class="col col-1"> Titel </label>
            <div class="col col-11">{{ titel }}</div>
        </div>
    `,
})
export class DetailsTitelComponent implements OnInit {
    @Input()
    readonly titel!: string;

    ngOnInit() {
        console.log(`DetailsTitelComponent.titel=${this.titel}`);
    }
}
