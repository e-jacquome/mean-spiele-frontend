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

import { RouterModule, Routes } from '@angular/router';
import { HOME_PATH } from './shared';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';

// Route-Definitionen fuer den Root-Router
const routes: Routes = [
    {
        path: '',
        redirectTo: HOME_PATH,
        // redirect erfordert pathMatch full
        pathMatch: 'full',
    },
    {
        path: HOME_PATH,
        component: HomeComponent,
    },
    {
        path: 'fluege',
        // Lazy Loading durch dynamische Imports
        // loadChildren statt component wie bei 'home'
        loadChildren: () =>
            import('./flug/flug-routing.module').then(
                mod => mod.FlugRoutingModule,
            ),
    },
];

@NgModule({
    exports: [RouterModule],
    // https://angular.io/guide/router
    // https://next.angular.io/api/router/RouterModule
    imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
