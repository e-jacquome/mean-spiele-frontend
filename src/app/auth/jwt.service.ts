/*
 * Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
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

import { BASE_URI, HttpStatus } from '../shared';
import { CookieService } from './cookie.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService {
    private static readonly MILLIS_PER_SECOND = 1000;
    private static readonly SECOND_PER_MINUTE = 60;
    private static readonly TIMEZONE_OFFSET_MS =
        new Date().getTimezoneOffset() *
        JwtService.SECOND_PER_MINUTE *
        JwtService.MILLIS_PER_SECOND;

    constructor(private readonly cookieService: CookieService) {
        console.log('JwtService.constructor()');
    }

    // GET-Request durch fetch() von ES statt HttpClient von Angular
    /* eslint-disable max-lines-per-function,max-statements */
    async login(
        username: string | undefined,
        password: string | undefined,
    ): Promise<Array<string>> {
        const loginUri = `${BASE_URI}/login`;
        console.log(`JwtService.login(): loginUri=${loginUri}`);

        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const request = new Request(loginUri, {
            method: 'POST',
            headers,
            body: `username=${username}&password=${password}`,
        });

        let response: Response | undefined;
        try {
            // ky ist eine Alternative zu fetch
            // https://github.com/sindresorhus/ky
            response = await fetch(request);
            // Optional catch binding parameters
        } catch {
            console.error(
                'JwtService.login(): Kommunikationsfehler mit dem Appserver',
            );
            return Promise.reject(
                new Error('Kommunikationsfehler mit dem Appserver'),
            );
        }

        const { status } = response;
        console.log(`JwtService.login(): status=${status}`);
        if (status !== HttpStatus.OK) {
            return Promise.reject(new Error(response.statusText));
        }

        const json = await response.json();
        console.log('JwtService.login(): json', json);
        const { token, roles } = json;
        const authorization = `Bearer ${token}`;
        console.log(`JwtService.login(): authorization=${authorization}`);

        // Array von Strings als 1 String
        const rolesStr: string = roles.join();
        console.log(`JwtService.login(): rolesStr=${rolesStr}`);

        const decodedToken = this.decodeToken(token);
        console.log('JwtService.login(): decodedToken', decodedToken);
        if (decodedToken.exp === undefined) {
            return Promise.resolve([]);
        }

        // Expiration beim Token: Sekunden seit 1.1.1970 UTC
        // Cookie: Millisekunden in eigener Zeitzone
        const expiration =
            decodedToken.exp * JwtService.MILLIS_PER_SECOND +
            JwtService.TIMEZONE_OFFSET_MS;
        console.log(`JwtService.login(): expiration=${expiration}`);
        this.cookieService.saveAuthorization(
            authorization,
            rolesStr,
            expiration,
        );

        return Promise.resolve(roles);
    }

    // https://github.com/auth0/angular2-jwt/blob/master/angular2-jwt.ts#L147
    private decodeToken(token: string) {
        // Destructuring
        const [, payload, signature]: Array<string | undefined> = token.split(
            '.',
        );
        if (signature === undefined) {
            console.error(
                'JwtService.decodeToken(): JWT enthaelt keine Signature',
            );
            return undefined;
        }

        let base64Token = payload.replace(/-/gu, '+').replace(/_/gu, '/');
        switch (base64Token.length % 4) {
            case 0:
                break;
            case 2:
                base64Token += '==';
                break;
            case 3:
                base64Token += '=';
                break;
            default:
                console.error(
                    'JwtService.decodeToken(): Laenge des JWT in Base64 ist falsch.',
                );
                return undefined;
        }

        // http://xkr.us/articles/javascript/encode-compare
        // http://stackoverflow.com/questions/75980/when-are-you-supposed-to-use-escape-instead-of-encodeuri-encodeuricomponent#23842171
        const decodedStr = decodeURIComponent(
            encodeURIComponent(window.atob(base64Token)),
        );
        if (decodedStr === undefined) {
            console.error(
                'JwtService.decodeToken(): JWT kann nicht decodiert werden.',
            );
            return undefined;
        }
        return JSON.parse(decodedStr);
    }
}
