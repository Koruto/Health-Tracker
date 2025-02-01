import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

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

// PrimeNG Imports
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    ListboxModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './workout-analytics.component.html',
})
export class WorkoutAnalyticsComponent implements OnInit {
  workouts: Workout[] = [];
  usernames: string[] = [];

  selectedUsername$ = new BehaviorSubject<string>(''); // Changed to string instead of string | null
  private workouts$ = new BehaviorSubject<Workout[]>([]);

  filteredWorkouts$ = combineLatest([
    this.workouts$,
    this.selectedUsername$,
  ]).pipe(
    map(([workouts, username]) => {
      // If no username is selected, use the first username
      const effectiveUsername = username || this.usernames[0];
      return workouts.filter(
        (workout) => workout.username === effectiveUsername
      );
    }),
    shareReplay(1) // Add shareReplay to prevent multiple subscriptions
  );

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    const workouts: Workout[] = this.workoutService.getWorkouts();
    this.workouts$.next(workouts);
    this.workouts = workouts;

    // Extract unique usernames
    this.usernames = Array.from(
      new Set(workouts.map((workout: Workout) => workout.username))
    );

    // Set the first username as default
    if (this.usernames.length > 0) {
      this.selectedUsername$.next(this.usernames[0]);
    }
  }

  onUsernameSelect(username: string | null) {
    // If username is null or empty, set it to the first username
    const effectiveUsername = username || this.usernames[0];
    this.selectedUsername$.next(effectiveUsername);
  }
}
