import { Component, Input, OnInit, OnChanges } from '@angular/core';
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
export class CaloriesSummaryCardComponent implements OnInit, OnChanges {
  @Input() workouts: Workout[] = [];
  totalCalories = 0;

  ngOnInit() {
    if (this.workouts.length) {
      this.calculateCalorieStats();
    }
  }

  ngOnChanges() {
    this.calculateCalorieStats();
  }

  private calculateCalorieStats(): void {
    this.totalCalories = this.workouts.reduce(
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
