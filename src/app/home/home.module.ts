import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from '../auth/auth.component';
import { AuthentificationService } from '../core/services/auth.service';
import { ElectronService } from 'ngx-electron';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

@NgModule({
  declarations: [HomeComponent, AuthComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, ReactiveFormsModule,
    FormsModule],
  providers: [AuthentificationService, ElectronService, DatePipe, { provide: LOCALE_ID, useValue: "fr-FR" }],
})
export class HomeModule {}
