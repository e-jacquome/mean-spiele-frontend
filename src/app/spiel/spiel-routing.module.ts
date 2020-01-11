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
import { AdminGuard } from '../auth/admin.guard';
import { BalkendiagrammComponent } from './diagramme/balkendiagramm.component';
import { CreateSpielComponent } from './create-spiel/create-spiel.component';
import { CreateSpielGuard } from './create-spiel/create-spiel.guard';
import { DetailsSpielComponent } from './details-spiel/details-spiel.component';
import { LiniendiagrammComponent } from './diagramme/liniendiagramm.component';
import { NgModule } from '@angular/core';
import { SucheSpieleComponent } from './suche-spiele/suche-spiele.component';
import { TortendiagrammComponent } from './diagramme/tortendiagramm.component';
import { UpdateSpielComponent } from './update-spiel/update-spiel.component';

// Route-Definitionen fuer das Feature-Modul "spiel":
// Zuordnung von Pfaden und Komponenten mit HTML-Templates
const routes: Routes = [
    {
        path: 'suche',
        component: SucheSpieleComponent,
    },
    {
        path: 'create',
        component: CreateSpielComponent,
        canActivate: [AdminGuard],
        canDeactivate: [CreateSpielGuard],
    },
    {
        path: 'balkendiagramm',
        component: BalkendiagrammComponent,
        canActivate: [AdminGuard],
    },
    {
        path: 'liniendiagramm',
        component: LiniendiagrammComponent,
        canActivate: [AdminGuard],
    },
    {
        path: 'tortendiagramm',
        component: TortendiagrammComponent,
        canActivate: [AdminGuard],
    },

    // id als Pfad-Parameter
    {
        path: ':id',
        component: DetailsSpielComponent,
    },
    {
        path: ':id/update',
        component: UpdateSpielComponent,
        canActivate: [AdminGuard],
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)],
})
export class SpielRoutingModule {}
