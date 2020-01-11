/* eslint-disable max-lines */

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

import { BASE_URI, FLUEGE_PATH_REST } from '../../shared';
import { Flug, FlugArt, FlugServer, Verlag } from './flug';
// Bereitgestellt durch HttpClientModule
// HttpClientModule enthaelt nur Services, keine Komponenten
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { DiagrammService } from '../../shared/diagramm.service';
import { Injectable } from '@angular/core';
// https://github.com/ReactiveX/rxjs/blob/master/src/internal/Subject.ts
// https://github.com/ReactiveX/rxjs/blob/master/src/internal/Observable.ts
import { Subject } from 'rxjs';

// Methoden der Klasse HttpClient
//  * get(url, options) – HTTP GET request
//  * post(url, body, options) – HTTP POST request
//  * put(url, body, options) – HTTP PUT request
//  * patch(url, body, options) – HTTP PATCH request
//  * delete(url, options) – HTTP DELETE request

// Eine Service-Klasse ist eine "normale" Klasse gemaess ES 2015, die mittels
// DI in eine Komponente injiziert werden kann, falls sie innerhalb von
// provider: [...] bei einem Modul oder einer Komponente bereitgestellt wird.
// Eine Komponente realisiert gemaess MVC-Pattern den Controller und die View.
// Die Anwendungslogik wird vom Controller an Service-Klassen delegiert.

/**
 * Die Service-Klasse zu B&uuml;cher wird zum "Root Application Injector"
 * hinzugefuegt und ist in allen Klassen der Webanwendung verfuegbar.
 */
@Injectable({ providedIn: 'root' })
export class FlugService {
    // Observables = Event-Streaming mit Promises
    // Subject statt Basisklasse Observable:
    // in find() und findById() wird next() aufgerufen
    /* eslint-disable no-underscore-dangle */
    readonly fluegeSubject = new Subject<Array<Flug>>();
    readonly flugSubject = new Subject<Flug>();
    readonly errorSubject = new Subject<string | number>();

    private readonly baseUriFluege!: string;

    private _flug!: Flug;

    /**
     * @param diagrammService injizierter DiagrammService
     * @param httpClient injizierter Service HttpClient (von Angular)
     * @return void
     */
    constructor(
        private readonly diagrammService: DiagrammService,
        private readonly httpClient: HttpClient,
    ) {
        this.baseUriFluege = `${BASE_URI}/${FLUEGE_PATH_REST}`;
        console.log(
            `FlugService.constructor(): baseUriFlug=${this.baseUriFluege}`,
        );
    }

    /**
     * Ein Flug-Objekt puffern.
     * @param flug Das Flug-Objekt, das gepuffert wird.
     * @return void
     */
    set flug(flug: Flug) {
        console.log('FlugService.set flug()', flug);
        this._flug = flug;
    }

    /**
     * Fluege suchen
     * @param suchkriterien Die Suchkriterien
     */
    find(suchkriterien: Suchkriterien) {
        console.log('FlugService.find(): suchkriterien=', suchkriterien);
        const params = this.suchkriterienToHttpParams(suchkriterien);
        const uri = this.baseUriFluege;
        console.log(`FlugService.find(): uri=${uri}`);

        const errorFn = (err: HttpErrorResponse) => {
            if (err.error instanceof ProgressEvent) {
                console.error('Client-seitiger oder Netzwerkfehler', err.error);
                this.errorSubject.next(-1);
                return;
            }

            const { status } = err;
            console.log(
                `FlugService.find(): errorFn(): status=${status}, ` +
                    'Response-Body=',
                err.error,
            );
            this.errorSubject.next(status);
        };

        // Observable.subscribe() aus RxJS liefert ein Subscription Objekt,
        // mit dem man den Request abbrechen ("cancel") kann
        // https://angular.io/guide/http
        // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md
        // http://stackoverflow.com/questions/34533197/what-is-the-difference-between-rx-observable-subscribe-and-foreach
        // https://xgrommx.github.io/rx-book/content/observable/observable_instance_methods/subscribe.html
        return this.httpClient
            .get<Array<FlugServer>>(uri, { params })
            .pipe(
                // Pipeable operators
                // http://reactivex.io/documentation/operators.html
                map(jsonArray =>
                    jsonArray.map(jsonObjekt => Flug.fromServer(jsonObjekt)),
                ),
            )
            .subscribe(fluege => this.fluegeSubject.next(fluege), errorFn);

        // Same-Origin-Policy verhindert Ajax-Datenabfragen an einen Server in
        // einer anderen Domain. JSONP (= JSON mit Padding) ermoeglicht die
        // Uebertragung von JSON-Daten ueber Domaingrenzen.
        // In Angular gibt es dafuer den Service Jsonp.
    }

    /**
     * Ein Flug anhand der ID suchen
     * @param id Die ID des gesuchten Flugs
     */
    // eslint-disable-next-line max-lines-per-function
    findById(id: string | undefined) {
        console.log(`FlugService.findById(): id=${id}`);

        // Gibt es ein gepuffertes Flug mit der gesuchten ID und Versionsnr.?
        if (
            this._flug !== undefined &&
            this._flug._id === id &&
            this._flug.version !== undefined
        ) {
            console.log(
                `FlugService.findById(): Flug gepuffert, version=${this._flug.version}`,
            );
            this.flugSubject.next(this._flug);
            return;
        }
        if (id === undefined) {
            console.log('FlugService.findById(): Keine Id');
            return;
        }

        // Ggf wegen fehlender Versionsnummer (im ETag) nachladen
        const uri = `${this.baseUriFluege}/${id}`;

        const errorFn = (err: HttpErrorResponse) => {
            if (err.error instanceof ProgressEvent) {
                console.error(
                    'FlugService.findById(): errorFn(): Client- oder Netzwerkfehler',
                    err.error,
                );
                this.errorSubject.next(-1);
                return;
            }

            const { status } = err;
            console.log(
                `FlugService.findById(): errorFn(): status=${status}` +
                    `Response-Body=${err.error}`,
            );
            this.errorSubject.next(status);
        };

        console.log('FlugService.findById(): GET-Request');

        let body: FlugServer | null = null;
        let etag: string | null = null;
        return this.httpClient
            .get<FlugServer>(uri, { observe: 'response' })
            .pipe(
                filter(response => {
                    console.debug(
                        'FlugService.findById(): filter(): response=',
                        response,
                    );
                    ({ body } = response);
                    return body !== null;
                }),
                filter(response => {
                    etag = response.headers.get('ETag');
                    console.log(`etag = ${etag}`);
                    return etag !== null;
                }),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                map(_ => {
                    this._flug = Flug.fromServer(body, etag);
                    return this._flug;
                }),
            )
            .subscribe(flug => this.flugSubject.next(flug), errorFn);
    }

    /**
     * Ein neues Flug anlegen
     * @param neuesFlug Das JSON-Objekt mit dem neuen Flug
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    save(
        flug: Flug,
        successFn: (location: string | undefined) => void,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorFn: (status: number, errors: { [s: string]: any }) => void,
    ) {
        console.log('FlugService.save(): flug=', flug);
        flug.datum = new Date();

        const errorFnPost = (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.error(
                    'FlugService.save(): errorFnPost(): Client- oder Netzwerkfehler',
                    err.error.message,
                );
            } else if (errorFn === undefined) {
                console.error('errorFnPost', err);
            } else {
                // z.B. {titel: ..., verlag: ..., isbn: ...}
                errorFn(err.status, err.error);
            }
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'text/plain',
        });
        return this.httpClient
            .post(this.baseUriFluege, flug.toJSON(), {
                headers,
                observe: 'response',
                responseType: 'text',
            })
            .pipe(
                map(response => {
                    console.debug(
                        'FlugService.save(): map(): response',
                        response,
                    );
                    const headersResponse = response.headers;
                    let location = headersResponse.get('Location');
                    if (location === null) {
                        location = undefined;
                    }
                    return location;
                }),
            )
            .subscribe(location => successFn(location), errorFnPost);
    }

    /**
     * Ein vorhandenes Flug aktualisieren
     * @param flug Das JSON-Objekt mit den aktualisierten Flugdaten
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    update(
        flug: Flug,
        successFn: () => void,
        errorFn: (
            status: number,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            errors: { [s: string]: any } | undefined,
        ) => void,
    ) {
        console.log('FlugService.update(): flug=', flug);

        const { version } = flug;
        if (version === undefined) {
            console.error(`Keine Versionsnummer fuer das Flug ${flug._id}`);
            return;
        }
        const successFnPut = () => {
            successFn();
            // Wenn Update erfolgreich war, dann wurde serverseitig die Versionsnr erhoeht
            flug.version++;
        };
        const errorFnPut = (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.error(
                    'Client-seitiger oder Netzwerkfehler',
                    err.error.message,
                );
            } else if (errorFn === undefined) {
                console.error('errorFnPut', err);
            } else {
                errorFn(err.status, err.error);
            }
        };

        const uri = `${this.baseUriFluege}/${flug._id}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'text/plain',
            'If-Match': `"${version}"`,
        });
        console.log('headers=', headers);
        return this.httpClient
            .put(uri, flug, { headers })
            .subscribe(successFnPut, errorFnPut);
    }

    /**
     * Ein Flug l&ouml;schen
     * @param flug Das JSON-Objekt mit dem zu loeschenden Flug
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    remove(
        flug: Flug,
        successFn: (() => void) | undefined,
        errorFn: (status: number) => void,
    ) {
        console.log('FlugService.remove(): flug=', flug);
        const uri = `${this.baseUriFluege}/${flug._id}`;

        const errorFnDelete = (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.error(
                    'Client-seitiger oder Netzwerkfehler',
                    err.error.message,
                );
            } else if (errorFn === undefined) {
                console.error('errorFnPut', err);
            } else {
                errorFn(err.status);
            }
        };

        return this.httpClient.delete(uri).subscribe(successFn, errorFnDelete);
    }

    // http://www.sitepoint.com/15-best-javascript-charting-libraries
    // http://thenextweb.com/dd/2015/06/12/20-best-javascript-chart-libraries
    // http://mikemcdearmon.com/portfolio/techposts/charting-libraries-using-d3

    // D3 (= Data Driven Documents) https://d3js.org ist das fuehrende Produkt
    // fuer Datenvisualisierung:
    //  initiale Version durch die Dissertation von Mike Bostock
    //  gesponsort von der New York Times, seinem heutigen Arbeitgeber
    //  basiert auf SVG = scalable vector graphics: Punkte, Linien, Kurven, ...
    //  ca 250.000 Downloads/Monat bei https://www.npmjs.com
    //  https://github.com/mbostock/d3 mit ueber 100 Contributors

    // Weitere Alternativen:
    // Google Charts: https://google-developers.appspot.com/chart
    // Chartist.js:   http://gionkunz.github.io/chartist-js
    // n3-chart:      http://n3-charts.github.io/line-chart

    // Chart.js ist deutlich einfacher zu benutzen als D3
    //  basiert auf <canvas>
    //  ca 25.000 Downloads/Monat bei https://www.npmjs.com
    //  https://github.com/nnnick/Chart.js mit ueber 60 Contributors

    /**
     * Ein Balkendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    createBarChart(chartElement: HTMLCanvasElement) {
        console.log('FlugService.createBarChart()');
        const uri = this.baseUriFluege;
        return this.httpClient
            .get<Array<FlugServer>>(uri)
            .pipe(
                // ID aus Self-Link
                map(fluege => fluege.map(flug => this.setFlugId(flug))),
                map(fluege => {
                    const fluegeGueltig = fluege.filter(
                        b => b._id !== null && b.rating !== undefined,
                    );
                    const labels = fluegeGueltig.map(b => b._id);
                    console.log(
                        'FlugService.createBarChart(): labels: ',
                        labels,
                    );

                    const data = fluegeGueltig.map(b => b.rating);
                    const datasets = [{ label: 'Bewertung', data }];

                    return {
                        type: 'bar',
                        data: { labels, datasets },
                    };
                }),
            )
            .subscribe(config =>
                this.diagrammService.createChart(chartElement, config),
            );
    }

    /**
     * Ein Liniendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    createLinearChart(chartElement: HTMLCanvasElement) {
        console.log('FlugService.createLinearChart()');
        const uri = this.baseUriFluege;

        return this.httpClient
            .get<Array<FlugServer>>(uri)
            .pipe(
                // ID aus Self-Link
                map(fluege => fluege.map(b => this.setFlugId(b))),
                map(fluege => {
                    const fluegeGueltig = fluege.filter(
                        b => b._id !== null && b.rating !== undefined,
                    );
                    const labels = fluegeGueltig.map(b => b._id);
                    console.log(
                        'FlugService.createLinearChart(): labels: ',
                        labels,
                    );

                    const data = fluegeGueltig.map(b => b.rating);
                    const datasets = [{ label: 'Bewertung', data }];

                    return {
                        type: 'line',
                        data: { labels, datasets },
                    };
                }),
            )
            .subscribe(config =>
                this.diagrammService.createChart(chartElement, config),
            );
    }

    /**
     * Ein Tortendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    createPieChart(chartElement: HTMLCanvasElement) {
        console.log('FlugService.createPieChart()');
        const uri = this.baseUriFluege;

        return this.httpClient
            .get<Array<FlugServer>>(uri)
            .pipe(
                // ID aus Self-Link
                map(fluege => fluege.map(flug => this.setFlugId(flug))),
                map(fluege => {
                    const fluegeGueltig = fluege.filter(
                        b => b._id !== null && b.rating !== undefined,
                    );
                    const labels = fluegeGueltig.map(b => b._id);
                    console.log(
                        'FlugService.createPieChart(): labels: ',
                        labels,
                    );
                    const ratings = fluegeGueltig.map(b => b.rating);

                    const anzahl = ratings.length;
                    const backgroundColor = new Array<string>(anzahl);
                    const hoverBackgroundColor = new Array<string>(anzahl);
                    Array(anzahl)
                        .fill(true)
                        .forEach((_, i) => {
                            backgroundColor[
                                i
                            ] = this.diagrammService.getBackgroundColor(i);
                            hoverBackgroundColor[
                                i
                            ] = this.diagrammService.getHoverBackgroundColor(i);
                        });

                    const data: Chart.ChartData = {
                        labels,
                        datasets: [
                            {
                                data: ratings,
                                backgroundColor,
                                hoverBackgroundColor,
                            },
                        ],
                    };

                    return { type: 'pie', data };
                }),
            )
            .subscribe(config =>
                this.diagrammService.createChart(chartElement, config),
            );
    }

    /**
     * Suchkriterien in Request-Parameter konvertieren.
     * @param suchkriterien Suchkriterien fuer den GET-Request.
     * @return Parameter fuer den GET-Request
     */
    private suchkriterienToHttpParams(
        suchkriterien: Suchkriterien,
    ): HttpParams {
        console.log(
            'FlugService.suchkriterienToHttpParams(): suchkriterien=',
            suchkriterien,
        );
        let httpParams = new HttpParams();

        const { titel, verlag, art, schlagwoerter } = suchkriterien;
        const { javascript, typescript } = schlagwoerter;

        if (titel !== '') {
            httpParams = httpParams.set('titel', titel);
        }
        if (art !== '') {
            httpParams = httpParams.set('art', art);
        }
        if (verlag !== '') {
            httpParams = httpParams.set('verlag', verlag);
        }
        if (javascript === true) {
            httpParams = httpParams.set('javascript', 'true');
        }
        if (typescript === true) {
            httpParams = httpParams.set('typescript', 'true');
        }
        return httpParams;
    }

    private setFlugId(flug: FlugServer) {
        const { _links } = flug;
        if (_links !== undefined) {
            const selfLink = flug._links.self.href;
            if (typeof selfLink === 'string') {
                const lastSlash = selfLink.lastIndexOf('/');
                flug._id = selfLink.substring(lastSlash + 1);
            }
        }
        if (flug._id === undefined) {
            flug._id = 'undefined';
        }
        return flug;
    }
}

export interface Suchkriterien {
    titel: string;
    verlag: Verlag | '';
    art: FlugArt | '';
    schlagwoerter: { javascript: boolean; typescript: boolean };
}
