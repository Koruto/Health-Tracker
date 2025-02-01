import { Component, OnInit } from '@angular/core';

import { WorkoutService } from '../../../services/workout.service';
import { Workout } from '../../../interfaces/workout';
import { StreakCardComponent } from './components/streak-card/streak-card.component';
import { MostActiveExerciseCardComponent } from './components/most-active-exercise-card/most-active-exercise-card.component';
import { WeeklyProgressCardComponent } from './components/weekly-progress-card/weekly-progress-card.component';
import { CaloriesSummaryCardComponent } from './components/calories-summary-card/calories-summary-card.component';
import { WeeklyPerformanceChartComponent } from './components/weekly-performance-chart/weekly-performance-chart.component';
import { WorkoutDistributionComponent } from './components/workout-distribution-chart/workout-distribution-chart.component';
import { MoodSummaryCardComponent } from './components/mood-summary-card/mood-summary-card.component';
import { WeeklyActivityOverviewComponent } from './components/weekly-activity-overview/weekly-activity-overview.component';

@Component({
  selector: 'app-workout-analytics',
  standalone: true,
  imports: [
    StreakCardComponent,
    MostActiveExerciseCardComponent,
    WeeklyProgressCardComponent,
    CaloriesSummaryCardComponent,
    WeeklyPerformanceChartComponent,
    WorkoutDistributionComponent,
    MoodSummaryCardComponent,
    WeeklyActivityOverviewComponent,
  ],
  templateUrl: './workout-analytics.component.html',
})
export class WorkoutAnalyticsComponent implements OnInit {
  workouts: Workout[] = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workouts = this.workoutService.getWorkouts();
  }
}
