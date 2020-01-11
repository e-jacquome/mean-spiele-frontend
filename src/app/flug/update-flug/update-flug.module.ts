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

import { CommonModule } from '@angular/common';
import { ErrorMessageModule } from '../../shared/error-message.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UpdateFlugComponent } from './update-flug.component';
import { UpdateSchlagwoerterModule } from './schlagwoerter/update-schlagwoerter.module';
import { UpdateStammdatenModule } from './stammdaten/update-stammdaten.module';

@NgModule({
    declarations: [UpdateFlugComponent],
    exports: [UpdateFlugComponent],
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        ErrorMessageModule,
        UpdateSchlagwoerterModule,
        UpdateStammdatenModule,
    ],
    providers: [Title],
})
export class UpdateFlugModule {}
