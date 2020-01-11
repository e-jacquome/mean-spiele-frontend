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
 * You should have received a copy oSf the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, Output, ViewChild } from '@angular/core';
import { faInfoCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { SucheArtComponent } from './suche-art.component';
import { SucheSchlagwoerterComponent } from './suche-schlagwoerter.component';
import { SucheTitelComponent } from './suche-titel.component';
import { SucheVerlagComponent } from './suche-verlag.component';
import { Suchkriterien } from '../../shared/spiel.service';
import { fadeIn } from '../../../shared';

/**
 * Komponente f&uuml;r das Tag <code>hs-suchformular</code>
 */
@Component({
    selector: 'hs-suchformular',
    templateUrl: './suchformular.component.html',
    animations: [fadeIn],
})
export class SuchformularComponent {
    // Event Binding: <hs-suchformular (waiting)="...">
    // in RxJS: Observables = Event-Streaming mit Promises
    // Subject statt der Basisklasse Observable, damit next() in onFind() aufgerufen werden kann
    // https://angular.io/guide/component-interaction#parent-listens-for-child-event
    @Output()
    readonly suchkriterien = new Subject<Suchkriterien>();

    readonly faInfoCircle = faInfoCircle;
    readonly faSearch = faSearch;

    // DI der Child-Komponente, um auf deren Attribut (hier: "titel") zuzugreifen
    // @Output in SucheTitelComponent wuerde Subject<> erfordern
    // https://angular.io/guide/component-interaction#parent-calls-an-viewchild
    // query results available in ngOnInit
    @ViewChild(SucheTitelComponent, { static: true })
    private readonly sucheTitelComponent!: SucheTitelComponent;

    @ViewChild(SucheVerlagComponent, { static: true })
    private readonly sucheVerlagComponent!: SucheVerlagComponent;

    @ViewChild(SucheArtComponent, { static: true })
    private readonly sucheArtComponent!: SucheArtComponent;

    @ViewChild(SucheSchlagwoerterComponent, { static: true })
    private readonly sucheSchlagwoerterComponent!: SucheSchlagwoerterComponent;

    // DI: Constructor Injection (React hat uebrigens keine DI)
    // Empfehlung: Konstruktor nur fuer DI
    constructor() {
        console.log('SuchformularComponent.constructor()');
    }

    /**
     * Suche nach Spielen, die den spezfizierten Suchkriterien entsprechen
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    onFind() {
        const { titel } = this.sucheTitelComponent;
        const { verlag } = this.sucheVerlagComponent;
        const { art } = this.sucheArtComponent;
        const { solo } = this.sucheSchlagwoerterComponent;
        const { team } = this.sucheSchlagwoerterComponent;
        console.log(
            `SuchformularComponent.onFind(): titel=${titel}, verlag=${verlag}, art=${art}, javascript=${solo}, typescript=${team}`,
        );

        this.suchkriterien.next({
            titel,
            verlag,
            art,
            schlagwoerter: { solo, team },
        });

        // Inspektion der Komponente mit dem Tag-Namen "app" im Debugger
        // Voraussetzung: globale Variable ng deklarieren (s.o.)
        // const app: any = document.querySelector('app')
        // global.ng.probe(app)

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite.
        return false;
    }
}
