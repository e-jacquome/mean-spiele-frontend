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

/**
 * Pfade an der Weboberflaeche
 */
export const HOME_PATH = 'home';

// siehe proxy.conf.json und angular.json
const SCHEME = 'https';
const PORT = 443;
const SERVERNAME = 'localhost';
const BASE_PATH = '/rest';

// CORS statt Proxy:
// const SCHEME = 'https'
// const PORT = 8444
// const SERVERNAME = 'localhost'
// const BASE_PATH = '/'

/**
 * Basis-URI fuer den REST-Server
 */
export const BASE_URI = `${SCHEME}://${SERVERNAME}:${PORT}${BASE_PATH}`;

/**
 * Pfad beim REST-Server fuer spiele
 */
export const SPIELE_PATH_REST = 'spiele';
