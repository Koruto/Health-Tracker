import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Workout } from '@interfaces/workout';

@Component({
  selector: 'app-calories-summary-card',
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './calories-summary-card.component.html',
  styleUrl: './calories-summary-card.component.scss',
})
export class CaloriesSummaryCardComponent implements OnInit {
  @Input() workouts: Workout[] = [];

  totalCalories: number = 0;
  dailyAverage: number = 0;

  ngOnInit() {
    if (this.workouts.length) {
      this.calculateCalorieStats();
    }
  }

  private calculateCalorieStats(): void {
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyWorkouts = this.workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate >= weekStart &&
        workoutDate <= currentDate &&
        workout.username === 'John Doe'
      );
    });

    // Calculate total calories
    this.totalCalories = weeklyWorkouts.reduce(
      (sum, workout) => sum + workout.calories,
      0
    );

    // Calculate unique days with workouts
    const uniqueDays = new Set(
      weeklyWorkouts.map((workout) => new Date(workout.date).toDateString())
    );

    // Calculate daily average (if there are workout days)
    const activeDays = uniqueDays.size;
    this.dailyAverage =
      activeDays > 0 ? Math.round(this.totalCalories / activeDays) : 0;
  }

  formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }
}
