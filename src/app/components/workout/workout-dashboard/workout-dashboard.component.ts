import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { WorkoutFormComponent } from '../workout-form/workout-form.component';
import { WorkoutTableComponent } from '../workout-table/workout-table.component';

@Component({
  selector: 'app-workout-dashboard',
  imports: [
    ButtonModule,
    InputTextModule,
    WorkoutFormComponent,
    WorkoutTableComponent,
  ],
  templateUrl: './workout-dashboard.component.html',
  styleUrl: './workout-dashboard.component.scss',
})
export class WorkoutDashboardComponent {
  @ViewChild(WorkoutTableComponent) workoutList!: WorkoutTableComponent;

  visible = false;

  showDialog() {
    this.visible = true;
  }
}
