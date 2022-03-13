import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth', 
    pathMatch: 'full' 
  },
  {
    path: 'auth',
    component : AuthComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true }),
    HomeRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
