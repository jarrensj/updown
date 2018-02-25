import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HappysadComponent } from './components/happysad/happysad.component';

const routes: Routes = [
  {path: 'happysad', component: HappysadComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
