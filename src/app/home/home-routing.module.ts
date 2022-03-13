import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

const routes: Routes = [
  {
    path: 'bottom-nav',
    component: BottomNavComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: '',
        redirectTo : 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      /*{
        path: 'data',
        component: DataComponent
      },
      {
        path: 'absence-tabs',
        component: AbsenceTabsComponent
      },
      {
        path: 'absence-input',
        component: AbsenceInputComponent
      },
      {
        path: 'absence-stats',
        component: AbsenceStatsComponent
      },
      {
        path: 'patients',
        component: PatientsComponent
      },
      {
        path: 'drivers',
        component: DriversComponent
      },
      {
        path: 'places',
        component: PlacesComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: 'calendar/:p1',
        component: CalendarComponent
      },
      {
        path: 'absence',
        component: AbsenceComponent
      },
      {
        path: 'advanced',
        component: AdvancedComponent
      },
      {
        path: 'guide',
        component: UserGuideComponent
      }*/
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
