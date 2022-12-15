import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignaturaPage } from './asignatura.page';

const routes: Routes = [
  {
    path: '',
    component: AsignaturaPage
  },
  {
    path: ':id2',
    loadChildren: () => import('./clase/clase.module').then( m => m.ClasePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignaturaPageRoutingModule {}
