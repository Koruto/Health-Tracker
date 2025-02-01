import { Component } from '@angular/core';

import { WorkoutAnalyticsComponent } from '../../workout/workout-analytics/workout-analytics.component';
import { WorkoutManagementComponent } from '../../workout/workout-management/workout-management.component';

@Component({
  selector: 'app-main-layout',
  imports: [WorkoutAnalyticsComponent, WorkoutManagementComponent],
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
