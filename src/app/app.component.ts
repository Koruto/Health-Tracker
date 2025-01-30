import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WorkoutFormComponent, WorkoutListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'health-tracker';
}
