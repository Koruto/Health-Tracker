import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Workout } from '@interfaces/workout';

@Component({
  selector: 'app-weekly-progress-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './weekly-progress-card.component.html',
  styleUrl: './weekly-progress-card.component.scss',
})
export class WeeklyProgressCardComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  currentWeekCount: number = 0;
  progressPercentage: number = 0;
  isPositiveGrowth: boolean = true;

  ngOnChanges() {
    this.calculateWeeklyProgress();
  }

  private calculateWeeklyProgress(): void {
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

    // Calculate percentage change
    if (lastWeekCount === 0) {
      this.progressPercentage = this.currentWeekCount > 0 ? 100 : 0;
    } else {
      this.progressPercentage = Math.round(
        ((this.currentWeekCount - lastWeekCount) / lastWeekCount) * 100
      );
    }

    this.isPositiveGrowth = this.progressPercentage >= 0;
  }

  getProgressColor(): string {
    if (this.progressPercentage > 0) return 'text-green-500';
    if (this.progressPercentage < 0) return 'text-red-500';
    return 'text-gray-500';
  }

  getProgressIcon(): string {
    return this.progressPercentage > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down';
  }
}
