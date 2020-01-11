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

/* eslint-disable @typescript-eslint/no-magic-numbers */

// Charts mittes JavaScript, siehe http://www.jsgraphs.com und
// http://jqueryhouse.com/javascript-chart-and-graph-libraries
// - D3: fuehrend, flexibel, aber keine vorgefertigten Layouts fuer z.B.
// Balken-Diagramme
// - Google Charts: nur online benutzbar, JS-Datei *nicht* auf eigenem Server
// benutzbar
// - Chart.js 250.000 Downloads/Monat
// - NVD3 basiert auf D3, 40.000 Downloads/Monat
// - Power BI Visuals https://github.com/Microsoft/PowerBI-visuals
// - ...

import * as Chart from 'chart.js';
import { Injectable } from '@angular/core';

interface ColorHighlight {
    color: string;
    highlight: string;
}

/**
 * Service-Klasse f&uuml;r die Verwendung von Chart.js.
 */
// http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html
// http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html
@Injectable({ providedIn: 'root' })
export class DiagrammService {
    private readonly backgroundColors = new Map<number, ColorHighlight>();

    constructor() {
        // red
        this.backgroundColors.set(0, {
            color: '#F7464A',
            highlight: '#FF5A5E',
        });
        // green
        this.backgroundColors.set(1, {
            color: '#46BFBD',
            highlight: '#5AD3D1',
        });
        // yellow
        this.backgroundColors.set(2, {
            color: '#FDB45C',
            highlight: '#FFC870',
        });

        console.log(
            'DiagrammService.constructor(): backgroundColors=',
            this.backgroundColors,
        );
    }

    /**
     * @param elementId ID des HTML-Tags, bei dem das Chart eingesetzt wird.
     * @return Chart-Objekt
     */
    createChart(
        chartElement: HTMLCanvasElement | undefined,
        config: Chart.ChartConfiguration,
    ): Chart | undefined {
        if (chartElement === undefined) {
            console.error(
                'DiagrammService.createChart(): Kein HTML-Element fuer ein Chart gefunden:',
                chartElement,
            );
            return undefined;
        }

        const ctx = chartElement.getContext('2d');
        if (ctx === null) {
            console.error(
                'DiagrammService.createChart(): Kein 2D-Kontext gefunden',
                ctx,
            );
            return undefined;
        }

        console.log(
            'DiagrammService.createChart(): Chart wird erzeugt:',
            ctx,
            config,
        );
        return new Chart(ctx, config);
    }

    /**
     * @param idx Fortlaufende Nummer f&uuml;r die Farbe bei einem
     *        Tortendiagramm.
     * @return String mit dem Hex-Code der Farbe.
     */
    getBackgroundColor(idx: number) {
        const colorHighlight = this.backgroundColors.get(idx % 3);
        return colorHighlight.color;
    }

    /**
     * @param idx Fortlaufende Nummer f&uuml;r die Farbe zur Hervorhebung bei
     *        einem Tortendiagramm.
     * @return String mit dem Hex-Code dieser Farbe.
     */
    getHoverBackgroundColor(idx: number) {
        const backgroundColor = this.backgroundColors.get(idx % 3);
        return backgroundColor.highlight;
    }
}
