import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export interface RouteComponent {
  url?: string;
  title: string
}

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'year', loadComponent: () => import('./components/year/year.component').then(m => m.YearComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
