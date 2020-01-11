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

import { RouterModule, Routes } from '@angular/router';
import { HOME_PATH } from '../shared/paths';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';

// Route-Definitionen fuer das Feature-Modul "home":
// Zuordnung von Pfaden und Komponenten mit HTML-Templates
const routes: Routes = [
    {
        path: HOME_PATH,
        // TODO Lazy Loading der Child-Komponenten
        component: HomeComponent,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)],
})
export class HomeRoutingModule {}
