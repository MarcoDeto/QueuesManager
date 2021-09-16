import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeGuard } from '../Shared/Guards/home.guard';
import { HomeComponent } from './Components/home/home.component';
import { QueueComponent } from './Components/queue/queue.component';

const coreRoutes: Routes = [
  { path: 'home', component: HomeComponent/*, canActivate: [HomeGuard]*/ } ,
  { path: 'queue/:name/:count', component: QueueComponent/*, canActivate: [HomeGuard]*/ }
];

@NgModule({
  imports: [RouterModule.forChild(coreRoutes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

