import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Workout } from '@interfaces/workout';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-total-activities-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, Ripple],
  templateUrl: './total-activities-card.component.html',
  styleUrl: './total-activities-card.component.scss',
})
export class TotalActivitiesCardComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  currentWeekCount: number = 0;

  ngOnChanges() {
    this.calculateTotalActivities();
  }

  private calculateTotalActivities(): void {
    const currentDate = new Date();

    // Calculate current week's range
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    // Calculate last week's range
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(currentWeekStart);
    lastWeekEnd.setHours(23, 59, 59, 999);

    // Get workouts for current week - removed username filter
    const currentWeekWorkouts = this.workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= currentWeekStart && workoutDate <= currentDate;
    });

    // Get workouts for last week - removed username filter
    const lastWeekWorkouts = this.workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= lastWeekStart && workoutDate < currentWeekStart;
    });

    this.currentWeekCount = currentWeekWorkouts.length;
    const lastWeekCount = lastWeekWorkouts.length;
  }
}
