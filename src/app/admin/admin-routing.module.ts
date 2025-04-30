import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AddPlaceComponent } from './place/add-place/add-place.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListPlaceComponent } from './place/list-place/list-place.component';
import { UpdatePlaceComponent } from './place/update-place/update-place.component';
import { GestionTagComponent } from './tag/gestion-tag/gestion-tag.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'places',component: ListPlaceComponent},
  { path: 'places/add', component: AddPlaceComponent },
  { path: 'places/edit/:id', component: UpdatePlaceComponent },

  { path: 'tags', component: GestionTagComponent },
  { path: 'reports', component: ReportComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
