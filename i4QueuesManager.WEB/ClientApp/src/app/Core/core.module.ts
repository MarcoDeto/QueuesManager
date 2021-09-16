import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './Components/home/home.component';
import { SharedModule } from '../Shared/shared.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreRoutingModule } from './core-routing.module';
import { QueueComponent } from './Components/queue/queue.component';
import { MoveComponent } from './Components/queue/move/move.component';

@NgModule({
  declarations: [
    HomeComponent,
    QueueComponent,
    MoveComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    HomeComponent,
    QueueComponent
  ]
})
export class CoreModule { }
