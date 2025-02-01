import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Workout } from '@interfaces/workout';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-calories-summary-card',
  standalone: true,
  imports: [CommonModule, CardModule, Ripple],
  templateUrl: './calories-summary-card.component.html',
})
export class CaloriesSummaryCardComponent implements OnInit {
  @Input() workouts: Workout[] = [];
  totalCalories: number = 0;

  ngOnInit() {
    if (this.workouts.length) {
      this.calculateCalorieStats();
    }
  }

  ngOnChanges() {
    this.calculateCalorieStats();
  }

  private calculateCalorieStats(): void {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyWorkouts = this.workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= sevenDaysAgo && workoutDate <= currentDate;
    });

    console.log(this.workouts, weeklyWorkouts);

    this.totalCalories = weeklyWorkouts.reduce(
      (sum, workout) => sum + workout.calories,
      0
    );
  }

  formatCalories(): string {
    if (this.totalCalories >= 1000) {
      return (this.totalCalories / 1000).toFixed(1) + ' kcal';
    }
    return this.totalCalories + ' cal';
  }
}
