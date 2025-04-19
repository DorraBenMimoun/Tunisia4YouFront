import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddPlaceComponent } from './place/add-place/add-place.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListPlaceComponent } from './place/list-place/list-place.component';
import { UpdatePlaceComponent } from './place/update-place/update-place.component';
import { GestionTagComponent } from './tag/gestion-tag/gestion-tag.component';

@NgModule({
  declarations: [
    AdminComponent,
    AddPlaceComponent,
    DashboardComponent,
    ListPlaceComponent,
    UpdatePlaceComponent,
    GestionTagComponent,
 
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
