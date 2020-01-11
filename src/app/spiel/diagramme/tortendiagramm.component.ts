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

import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { SpielService } from '../shared/spiel.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

/**
 * Komponente mit dem Tag &lt;hs-tortendiagramm&gt; zur Visualisierung
 * von Bewertungen durch ein Tortendiagramm.
 */
@Component({
    selector: 'hs-tortendiagramm',
    templateUrl: './diagramm.html',
})
export class TortendiagrammComponent implements AfterViewInit, OnDestroy {
    // query results available in ngAfterViewInit
    @ViewChild('chartCanvas', { static: false })
    chartCanvas!: ElementRef<HTMLCanvasElement>;

    private pieChartSubscription: Subscription | undefined;

    constructor(
        private readonly spielService: SpielService,
        private readonly titleService: Title,
    ) {
        console.log('TortendiagrammComponent.constructor()');
    }

    /**
     * Das Tortendiagramm beim Tag <code><canvas></code> einf&uuml;gen.
     * Erst in ngAfterViewInit kann auf ein Kind-Element aus dem Templates
     * zugegriffen werden.
     */
    ngAfterViewInit() {
        this.pieChartSubscription = this.spielService.createPieChart(
            this.chartCanvas.nativeElement,
        );
        this.titleService.setTitle('Tortendiagramm');
    }

    ngOnDestroy() {
        this.pieChartSubscription.unsubscribe();
    }
}
