import { Component, Input, OnChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Workout } from '@interfaces/workout';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-streak-card',
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule],
  templateUrl: './streak-card.component.html',
  styleUrl: './streak-card.component.scss',
})
export class StreakCardComponent implements OnChanges {
  @Input() workouts: Workout[] = [];
  currentStreak: number = 0;
  bestStreak: number = 0;

  ngOnChanges() {
    this.calculateStreaks();
  }

  private calculateStreaks() {
    // Remove username filter as it's handled by parent
    const userWorkouts = this.workouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (!userWorkouts.length) {
      this.currentStreak = 0;
      this.bestStreak = 0;
      return;
    }

    // Calculate current streak
    this.currentStreak = this.getCurrentStreak(userWorkouts);

    // Calculate best streak
    this.bestStreak = this.getBestStreak(userWorkouts);
  }

  private getCurrentStreak(workouts: Workout[]): number {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = new Date(workouts[0].date);
    currentDate.setHours(0, 0, 0, 0);

    // If the latest workout is not from today or yesterday, return 0
    if ((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) > 1) {
      return 0;
    }

    // Count consecutive days
    for (let i = 0; i < workouts.length - 1; i++) {
      const currentDay = new Date(workouts[i].date);
      const nextDay = new Date(workouts[i + 1].date);

      currentDay.setHours(0, 0, 0, 0);
      nextDay.setHours(0, 0, 0, 0);

      const diffDays =
        (currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak + 1;
  }

  private getBestStreak(workouts: Workout[]): number {
    let currentStreak = 1;
    let maxStreak = 1;

    for (let i = 0; i < workouts.length - 1; i++) {
      const currentDay = new Date(workouts[i].date);
      const nextDay = new Date(workouts[i + 1].date);

      currentDay.setHours(0, 0, 0, 0);
      nextDay.setHours(0, 0, 0, 0);

      const diffDays =
        (currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }
}
