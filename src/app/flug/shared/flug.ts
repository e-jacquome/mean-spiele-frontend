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

const MIN_RATING = 0;
const MAX_RATING = 5;

export enum Verlag {
    IWI_VERLAG = 'IWI_VERLAG',
    HSKA_VERLAG = 'HSKA_VERLAG',
}

export enum SpielArt {
    KINDLE = 'KINDLE',
    DRUCKAUSGABE = 'DRUCKAUSGABE',
}

/**
 * Gemeinsame Datenfelder unabh&auml;ngig, ob die Spieldaten von einem Server
 * (z.B. RESTful Web Service) oder von einem Formular kommen.
 */
export interface SpielShared {
    _id?: string;
    titel: string;
    verlag?: Verlag | '';
    art: SpielArt;
    preis: number;
    rabatt: number;
    datum?: string;
    lieferbar?: boolean;
    isbn: string;
    version?: number;
}

interface Link {
    href: string;
}

/**
 * Daten vom und zum REST-Server:
 * <ul>
 *  <li> Arrays f&uuml;r mehrere Werte, die in einem Formular als Checkbox
 *       dargestellt werden.
 *  <li> Daten mit Zahlen als Datentyp, die in einem Formular nur als
 *       String handhabbar sind.
 * </ul>
 */
export interface SpielServer extends SpielShared {
    rating?: number;
    schlagwoerter?: Array<string>;
    _links?: {
        self: Link;
        list?: Link;
        add?: Link;
        update?: Link;
        remove?: Link;
    };
}

/**
 * Daten aus einem Formular:
 * <ul>
 *  <li> je 1 Control fuer jede Checkbox und
 *  <li> au&szlig;erdem Strings f&uuml;r Eingabefelder f&uuml;r Zahlen.
 * </ul>
 */
export interface SpielForm extends SpielShared {
    rating: string;
    javascript?: boolean;
    typescript?: boolean;
}

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export class Spiel {
    private static readonly SPACE = 2;

    /* eslint-disable no-invalid-this */
    ratingArray: Array<boolean> =
        this.rating === undefined
            ? Array(MAX_RATING - MIN_RATING).fill(false)
            : Array(this.rating - MIN_RATING)
                  .fill(true)
                  .concat(Array(MAX_RATING - this.rating).fill(false));
    /* eslint-enable no-invalid-this */

    datum: Date | undefined;
    schlagwoerter: Array<string>;

    // wird aufgerufen von fromServer() oder von fromForm()
    // eslint-disable-next-line max-params
    private constructor(
        public _id: string | undefined,
        public titel: string,
        public rating: number | undefined,
        public art: SpielArt,
        public verlag: Verlag | undefined | '',
        datum: string | undefined,
        public preis: number,
        public rabatt: number,
        public lieferbar: boolean | undefined,
        schlagwoerter: Array<string> | undefined,
        public isbn: string,
        public version: number | undefined,
    ) {
        // TODO Parsing, ob der Datum-String valide ist
        this.datum = datum === undefined ? new Date() : new Date(datum);
        this.schlagwoerter = schlagwoerter === undefined ? [] : schlagwoerter;
        console.log('Spiel(): this=', this);
    }

    /**
     * Ein Spiel-Objekt mit JSON-Daten erzeugen, die von einem RESTful Web
     * Service kommen.
     * @param spiel JSON-Objekt mit Daten vom RESTful Web Server
     * @return Das initialisierte Spiel-Objekt
     */
    static fromServer(spielServer: SpielServer, etag?: string) {
        let selfLink: string | undefined;
        const { _links } = spielServer;
        if (_links !== undefined) {
            const { self } = _links;
            selfLink = self.href;
        }
        let id: string | undefined;
        if (selfLink !== undefined) {
            const lastSlash = selfLink.lastIndexOf('/');
            id = selfLink.substring(lastSlash + 1);
        }

        let version: number | undefined;
        if (etag !== undefined) {
            // Anfuehrungszeichen am Anfang und am Ende entfernen
            const versionStr = etag.substring(1, etag.length - 1);
            version = Number.parseInt(versionStr, 10);
        }

        const spiel = new Spiel(
            id,
            spielServer.titel,
            spielServer.rating,
            spielServer.art,
            spielServer.verlag,
            spielServer.datum,
            spielServer.preis,
            spielServer.rabatt,
            spielServer.lieferbar,
            spielServer.schlagwoerter,
            spielServer.isbn,
            version,
        );
        console.log('Spiel.fromServer(): spiel=', spiel);
        return spiel;
    }

    /**
     * Ein Spiel-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
     * @param spiel JSON-Objekt mit Daten vom Formular
     * @return Das initialisierte Spiel-Objekt
     */
    static fromForm(spielForm: SpielForm) {
        console.log('Spiel.fromForm(): spielForm=', spielForm);
        const schlagwoerter: Array<string> = [];
        if (spielForm.javascript === true) {
            schlagwoerter.push('JAVASCRIPT');
        }
        if (spielForm.typescript === true) {
            schlagwoerter.push('TYPESCRIPT');
        }

        const rabatt =
            spielForm.rabatt === undefined ? 0 : spielForm.rabatt / 100; // eslint-disable-line @typescript-eslint/no-magic-numbers
        const spiel = new Spiel(
            spielForm._id,
            spielForm.titel,
            Number(spielForm.rating),
            spielForm.art,
            spielForm.verlag,
            spielForm.datum,
            spielForm.preis,
            rabatt,
            spielForm.lieferbar,
            schlagwoerter,
            spielForm.isbn,
            spielForm.version,
        );
        console.log('Spiel.fromForm(): spiel=', spiel);
        return spiel;
    }

    // Property in TypeScript wie in C#
    // https://www.typescriptlang.org/docs/handbook/classes.html#accessors
    get datumFormatted() {
        // z.B. 7. Mai 2020
        const formatter = new Intl.DateTimeFormat('de', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return this.datum === undefined ? '' : formatter.format(this.datum);
    }

    /**
     * Abfrage, ob im Spieltitel der angegebene Teilstring enthalten ist. Dabei
     * wird nicht auf Gross-/Kleinschreibung geachtet.
     * @param titel Zu &uuml;berpr&uuml;fender Teilstring
     * @return true, falls der Teilstring im Spieltitel enthalten ist. Sonst
     *         false.
     */
    containsTitel(titel: string) {
        return this.titel === undefined
            ? false
            : this.titel.toLowerCase().includes(titel.toLowerCase());
    }

    /**
     * Die Bewertung ("rating") des Spieles um 1 erh&ouml;hen
     */
    rateUp() {
        if (this.rating !== undefined && this.rating < MAX_RATING) {
            this.rating++;
        }
    }

    /**
     * Die Bewertung ("rating") des Spieles um 1 erniedrigen
     */
    rateDown() {
        if (this.rating !== undefined && this.rating > MIN_RATING) {
            this.rating--;
        }
    }

    /**
     * Abfrage, ob das Spiel dem angegebenen Verlag zugeordnet ist.
     * @param verlag der Name des Verlags
     * @return true, falls das Spiel dem Verlag zugeordnet ist. Sonst false.
     */
    hasVerlag(verlag: string) {
        return this.verlag === verlag;
    }

    /**
     * Aktualisierung der Stammdaten des Spiel-Objekts.
     * @param titel Der neue Spieltitel
     * @param rating Die neue Bewertung
     * @param art Die neue Spielart (DRUCKAUSGABE oder KINDLE)
     * @param verlag Der neue Verlag
     * @param preis Der neue Preis
     * @param rabatt Der neue Rabatt
     */
    // eslint-disable-next-line max-params
    updateStammdaten(
        titel: string,
        art: SpielArt,
        verlag: Verlag | undefined | '',
        rating: number | undefined,
        datum: Date | undefined,
        preis: number,
        rabatt: number,
        isbn: string,
    ) {
        this.titel = titel;
        this.art = art;
        this.verlag = verlag;
        this.rating = rating;
        this.ratingArray =
            rating === undefined
                ? Array(MAX_RATING - MIN_RATING).fill(false)
                : Array(rating - MIN_RATING).fill(true);
        this.datum = datum === undefined ? new Date() : datum;
        this.preis = preis;
        this.rabatt = rabatt;
        this.isbn = isbn;
    }

    /**
     * Abfrage, ob es zum Spiel auch Schlagw&ouml;rter gibt.
     * @return true, falls es mindestens ein Schlagwort gibt. Sonst false.
     */
    hasSchlagwoerter() {
        if (this.schlagwoerter === undefined) {
            return false;
        }
        return this.schlagwoerter.length !== 0;
    }

    /**
     * Abfrage, ob es zum Spiel das angegebene Schlagwort gibt.
     * @param schlagwort das zu &uuml;berpr&uuml;fende Schlagwort
     * @return true, falls es das Schlagwort gibt. Sonst false.
     */
    hasSchlagwort(schlagwort: string) {
        if (this.schlagwoerter === undefined) {
            return false;
        }
        return this.schlagwoerter.includes(schlagwort);
    }

    /**
     * Aktualisierung der Schlagw&ouml;rter des Spiel-Objekts.
     * @param javascript ist das Schlagwort JAVASCRIPT gesetzt
     * @param typescript ist das Schlagwort TYPESCRIPT gesetzt
     */
    updateSchlagwoerter(javascript: boolean, typescript: boolean) {
        this.resetSchlagwoerter();
        if (javascript) {
            this.addSchlagwort('JAVASCRIPT');
        }
        if (typescript) {
            this.addSchlagwort('TYPESCRIPT');
        }
    }

    /**
     * Konvertierung des Spielobjektes in ein JSON-Objekt f&uuml;r den RESTful
     * Web Service.
     * @return Das JSON-Objekt f&uuml;r den RESTful Web Service
     */
    toJSON(): SpielServer {
        const datum =
            this.datum === undefined ? undefined : this.datum.toISOString();
        console.log(`toJson(): datum=${datum}`);
        return {
            _id: this._id,
            titel: this.titel,
            rating: this.rating,
            art: this.art,
            verlag: this.verlag,
            datum,
            preis: this.preis,
            rabatt: this.rabatt,
            lieferbar: this.lieferbar,
            schlagwoerter: this.schlagwoerter,
            isbn: this.isbn,
        };
    }

    toString() {
        return JSON.stringify(this, null, Spiel.SPACE);
    }

    private resetSchlagwoerter() {
        this.schlagwoerter = [];
    }

    private addSchlagwort(schlagwort: string) {
        if (this.schlagwoerter === undefined) {
            this.schlagwoerter = [];
        }
        this.schlagwoerter.push(schlagwort);
    }
}
