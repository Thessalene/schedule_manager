import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { HomeComponent } from './home.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [HomeComponent,BottomNavComponent],
  imports: [
    CommonModule, SharedModule, HomeRoutingModule,
    ReactiveFormsModule, FormsModule,
  ]
})
export class HomeModule {}
