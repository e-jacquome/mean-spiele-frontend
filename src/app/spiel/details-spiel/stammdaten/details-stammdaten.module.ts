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

import { CommonModule } from '@angular/common';
import { DetailsArtModule } from './details-art.module';
import { DetailsBewertungModule } from './details-bewertung.module';
import { DetailsDatumModule } from './details-datum.module';
import { DetailsIsbnModule } from './details-isbn.module';
import { DetailsLieferbarModule } from './details-lieferbar.module';
import { DetailsPreisModule } from './details-preis.module';
import { DetailsRabattModule } from './details-rabatt.module';
import { DetailsStammdatenComponent } from './details-stammdaten.component';
import { DetailsTitelModule } from './details-titel.module';
import { DetailsVerlagModule } from './details-verlag.module';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [DetailsStammdatenComponent],
    exports: [DetailsStammdatenComponent],
    imports: [
        CommonModule,
        DetailsArtModule,
        DetailsBewertungModule,
        DetailsDatumModule,
        DetailsIsbnModule,
        DetailsLieferbarModule,
        DetailsPreisModule,
        DetailsRabattModule,
        DetailsTitelModule,
        DetailsVerlagModule,
    ],
})
export class DetailsStammdatenModule {}
