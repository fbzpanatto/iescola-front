import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'year', loadComponent: () => import('./components/year/year.component').then(m => m.YearComponent) },
  {
    path: 'test',
    children: [
      { path: '', loadComponent: () => import('./components/test/test.component').then(m => m.TestComponent) },
      { path: ':command', loadComponent: () => import('./components/test/test.component').then(m => m.TestComponent) },
      {
        path: ':command/classroom/:classId',
        children: [
          { path: ':answers', loadComponent: () => import('./components/test/tabs/tabs.component').then(m => m.TabsComponent) },
          { path: ':totals', loadComponent: () => import('./components/test/tabs/tabs.component').then(m => m.TabsComponent) },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
