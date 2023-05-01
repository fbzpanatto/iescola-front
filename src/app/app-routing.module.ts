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
      {
        path: ':id',
        children: [
          { path: '', loadComponent: () => import('./components/test/edit/edit-test.component').then(m => m.EditTest) },
          { path: 'students', loadComponent: () => import('./components/test/test-students/test-students.component').then(m => m.TestStudentsComponent) }
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
