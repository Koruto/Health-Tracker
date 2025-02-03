import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WorkoutService } from '@services/workout/workout.service';
import { Workout } from '@interfaces/workout';
import { StreakCardComponent } from './components/streak-card/streak-card.component';
import { MostActiveExerciseCardComponent } from './components/most-active-exercise-card/most-active-exercise-card.component';
import { TotalActivitiesCardComponent } from './components/total-activities-card/total-activities-card.component';
import { CaloriesSummaryCardComponent } from './components/calories-summary-card/calories-summary-card.component';
import { WeeklyOverviewChartComponent } from './components/weekly-overview-chart/weekly-overview-chart.component';
import { WorkoutDistributionChartComponent } from './components/workout-distribution-chart/workout-distribution-chart.component';
import { MoodSummaryCardComponent } from './components/mood-summary-card/mood-summary-card.component';
import { WeeklyActivityChartComponent } from './components/weekly-activity-chart/weekly-activity-chart.component';

@Component({
  selector: 'app-workout-analytics',
  standalone: true,
  imports: [
    StreakCardComponent,
    MostActiveExerciseCardComponent,
    TotalActivitiesCardComponent,
    CaloriesSummaryCardComponent,
    WeeklyOverviewChartComponent,
    WorkoutDistributionChartComponent,
    MoodSummaryCardComponent,
    WeeklyActivityChartComponent,
    ListboxModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './workout-analytics.component.html',
})
export class WorkoutAnalyticsComponent implements OnInit {
  usernames: string[] = [];
  selectedUsername$ = new BehaviorSubject<string>('');
  filteredWorkouts$: Observable<Workout[]>;

  private avatarColors = [
    '#4F46E5', // indigo-600
    '#0891B2', // cyan-600
    '#DB2777', // pink-600
    '#7C3AED', // violet-600
    '#2563EB', // blue-600
    '#059669', // emerald-600
    '#DC2626', // red-600
    '#9333EA', // purple-600
  ];

  constructor(private workoutService: WorkoutService) {
    this.filteredWorkouts$ = combineLatest([
      this.workoutService.workouts$,
      this.selectedUsername$,
    ]).pipe(
      map(([workouts, username]) => {
        // Update usernames whenever workouts change
        this.usernames = Array.from(
          new Set(workouts.map((workout: Workout) => workout.username))
        ).sort();

        // Set default username if needed
        if (this.usernames.length > 0 && !this.selectedUsername$.value) {
          this.selectedUsername$.next(this.usernames[0]);
        }

        const effectiveUsername = username || this.usernames[0];
        const sevenDaysAgo = this.getSevenDaysAgo();

        return workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return (
            workout.username === effectiveUsername &&
            workoutDate >= sevenDaysAgo &&
            workoutDate <= new Date()
          );
        });
      }),
      shareReplay(1)
    );
  }

  // Helper function to get past week data
  private getSevenDaysAgo(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  ngOnInit() {
    // Initialize subscription
    this.filteredWorkouts$.subscribe();
  }

  onUsernameSelect(username: string | null) {
    const effectiveUsername = username || this.usernames[0];
    this.selectedUsername$.next(effectiveUsername);
  }

  getAvatarColor(username: string): string {
    const index = username.charCodeAt(0) % this.avatarColors.length;
    return this.avatarColors[index];
  }
}
