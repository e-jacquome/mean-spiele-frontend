/*
 * Copyright (C) 2019 - present Juergen Zimmermann, Hochschule Karlsruhe
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

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateArtModule } from './update-art.module';
import { UpdateIsbnModule } from './update-isbn.module';
import { UpdateRatingModule } from './update-rating.module';
import { UpdateStammdatenComponent } from './update-stammdaten.component';
import { UpdateTitelModule } from './update-titel.module';
import { UpdateVerlagModule } from './update-verlag.module';

@NgModule({
    declarations: [UpdateStammdatenComponent],
    exports: [UpdateStammdatenComponent],
    imports: [
        ReactiveFormsModule,
        FontAwesomeModule,
        UpdateArtModule,
        UpdateIsbnModule,
        UpdateRatingModule,
        UpdateTitelModule,
        UpdateVerlagModule,
    ],
})
export class UpdateStammdatenModule {}
