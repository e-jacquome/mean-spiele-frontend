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

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'hs-home',
    template: `
        <h1 class="display-1 mt-4">Hallo!</h1>
        <router-outlet></router-outlet>
    `,
})
export class HomeComponent implements OnInit {
    constructor(private readonly title: Title) {
        console.log('HomeComponent.constructor()');
    }

    ngOnInit() {
        this.title.setTitle('Beispiel');
    }
}
