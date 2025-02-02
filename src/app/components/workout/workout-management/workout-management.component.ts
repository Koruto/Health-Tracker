import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { WorkoutFormComponent } from '../workout-form/workout-form.component';
import { WorkoutListComponent } from '../workout-list/workout-list.component';

@Component({
  selector: 'app-workout-management',
  imports: [
    ButtonModule,
    InputTextModule,
    WorkoutFormComponent,
    WorkoutListComponent,
  ],
  templateUrl: './workout-management.component.html',
  styleUrl: './workout-management.component.scss',
})
export class WorkoutManagementComponent {
  @ViewChild(WorkoutListComponent) workoutList!: WorkoutListComponent;

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
