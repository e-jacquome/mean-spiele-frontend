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
import { Suchkriterien } from '../shared/spiel.service';
import { Title } from '@angular/platform-browser';

/**
 * Komponente f&uuml;r das Tag <code>&lt;hs-suche-spiele&gt;</code>, die aus
 * den Kindkomponenten f&uuml;r diese Tags besteht:
 * <ul>
 *  <li> <code>hs-suchformular</code>
 *  <li> <code>hs-suchergebnis</code>
 * </ul>
 */
@Component({
    selector: 'hs-suche-spiele',
    template: `
        <hs-suchformular
            (suchkriterien)="setSuchkriterien($event)"
        ></hs-suchformular>
        <hs-suchergebnis [suchkriterien]="suchkriterien"></hs-suchergebnis>
    `,
})
export class SucheSpieleComponent implements OnInit {
    suchkriterien!: Suchkriterien;

    // Wird von der JS-Engine aufgerufen
    constructor(private readonly titleService: Title) {
        console.log('SucheSpieleComponent.constructor()');
    }

    // Wird von Angular aufgerufen, wenn der DOM-Baum fertig ist,
    // d.h. nach dem "Rendering".
    // Wird immer generiert, wenn Angular-CLI genutzt wird.
    ngOnInit() {
        this.titleService.setTitle('Suche');
    }

    /**
     * Das Attribut <code>suchkriterien</code> wird auf den Wert des Ereignisses
     * <code>$event</code> vom Typ Suchkriteriengesetzt. Diese Methode wird
     * aufgerufen, wenn in der Kindkomponente f&uuml;r
     * <code>hs-suchformular</code> das Ereignis ausgel&ouml;st wird.
     * Der aktuelle Wert vom Attribut <code>&lt;suchkriterien&gt;</code> an die
     * Kindkomponente f&uuml;r <code>&lt;suchergebnis&gt;</code> weitergereicht.
     * @param $event true f&uuml;r das Ausl&ouml;sen der Suche.
     */
    setSuchkriterien($event: Suchkriterien) {
        console.log(
            'SucheSpieleComponent.setSuchkriterien(): suchkriterien=',
            $event,
        );
        this.suchkriterien = $event;
    }
}
