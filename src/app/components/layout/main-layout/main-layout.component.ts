import { Component } from '@angular/core';

import { WorkoutFormComponent } from '../../workout/workout-form/workout-form.component';
import { WorkoutListComponent } from '../../workout/workout-list/workout-list.component';
import { WorkoutAnalyticsComponent } from '../../workout/workout-analytics/workout-analytics.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    WorkoutFormComponent,
    WorkoutListComponent,
    WorkoutAnalyticsComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  activeSection = 'workouts';

  onScroll(event: any): void {
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
        this.activeSection = section.id;
      }
    });
  }
}
