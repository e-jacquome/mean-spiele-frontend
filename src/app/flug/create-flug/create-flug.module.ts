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
import { CreateArtModule } from './create-art.module';
import { CreateSpielComponent } from './create-spiel.component';
import { CreateDatumModule } from './create-datum.module';
import { CreateIsbnModule } from './create-isbn.module';
import { CreateLieferbarModule } from './create-lieferbar.module';
import { CreatePreisModule } from './create-preis.module';
import { CreateRabattModule } from './create-rabatt.module';
import { CreateRatingModule } from './create-rating.module';
import { CreateSchlagwoerterModule } from './create-schlagwoerter.module';
import { CreateTitelModule } from './create-titel.module';
import { CreateVerlagModule } from './create-verlag.module';
import { ErrorMessageModule } from '../../shared/error-message.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

// Ein Modul enthaelt logisch zusammengehoerige Funktionalitaet.
// Exportierte Komponenten koennen bei einem importierenden Modul in dessen
// Komponenten innerhalb deren Templates (= HTML-Fragmente) genutzt werden.
// SpielModule ist ein "FeatureModule", das Features fuer Spiele bereitstellt
@NgModule({
    declarations: [CreateSpielComponent],
    exports: [CreateSpielComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        CreateArtModule,
        CreateDatumModule,
        CreateIsbnModule,
        CreateLieferbarModule,
        CreatePreisModule,
        CreateRabattModule,
        CreateRatingModule,
        CreateSchlagwoerterModule,
        CreateTitelModule,
        CreateVerlagModule,
        ErrorMessageModule,
    ],
    providers: [Title],
})
export class CreateSpielModule {}
