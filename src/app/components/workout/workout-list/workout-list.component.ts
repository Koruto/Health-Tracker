import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';

import { WorkoutService } from '../../../services/workout/workout.service';
import { Workout } from '@interfaces/workout';
import { CalendarModule } from 'primeng/calendar';
import { MoodDonutComponent } from '../workout-analytics/components/mood-donut/mood-donut.component';
import { map, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    RatingModule,
    TooltipModule,
    RippleModule,
    CalendarModule,
    TagModule,
    MoodDonutComponent,
  ],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.scss',
})
export class WorkoutListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  filteredWorkouts$: Observable<Workout[]>;
  tableData: Workout[] = [];

  searchQuery = '';
  selectedWorkoutTypes: { name: string; value: string }[] = [];
  selectedIntensities: { name: string; value: string }[] = [];
  workoutTypeOptions: { name: string; value: string }[] = [];
  intensityOptions = [
    { name: 'Low', value: 'Low' },
    { name: 'Medium', value: 'Medium' },
    { name: 'High', value: 'High' },
  ];

  // Pagination properties
  first = 0;
  rows = 5;
  totalRecords = 0;

  constructor(
    private workoutService: WorkoutService,
    private cdr: ChangeDetectorRef
  ) {
    this.filteredWorkouts$ = this.workoutService.workouts$.pipe(
      map((workouts: Workout[]) => {
        this.initializeWorkoutTypeOptions(workouts);
        return this.applyFilters(workouts);
      }),
      tap((workouts: Workout[]) => {
        this.tableData = [...workouts]; // Create a new reference
        this.totalRecords = workouts.length;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to workouts updates
    this.subscription.add(
      this.filteredWorkouts$.subscribe(filtered => {
        this.totalRecords = filtered.length;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeWorkoutTypeOptions(workouts: Workout[]): void {
    this.workoutTypeOptions = [
      ...new Set(workouts.map(workout => workout.workoutType)),
    ].map(type => ({ name: type, value: type }));
  }

  private applyFilters(workouts: Workout[]): Workout[] {
    let filtered = workouts;

    if (this.selectedWorkoutTypes.length > 0) {
      filtered = filtered.filter(workout =>
        this.selectedWorkoutTypes.some(
          type => type.value === workout.workoutType
        )
      );
    }

    if (this.selectedIntensities.length > 0) {
      filtered = filtered.filter(workout =>
        this.selectedIntensities.some(
          intensity => intensity.value === workout.intensity
        )
      );
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        workout =>
          workout.username.toLowerCase().includes(query) ||
          workout.workoutType.toLowerCase().includes(query) ||
          workout.intensity.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  onSearch(): void {
    this.first = 0;
    this.refreshData();
  }

  onWorkoutTypeFilter(event: {
    value: { name: string; value: string }[];
  }): void {
    this.selectedWorkoutTypes = event.value;
    this.first = 0;
    this.refreshData();
  }

  onIntensityFilter(event: { value: { name: string; value: string }[] }): void {
    this.selectedIntensities = event.value;
    this.first = 0;
    this.refreshData();
  }

  clearFilters(): void {
    this.selectedWorkoutTypes = [];
    this.selectedIntensities = [];
    this.searchQuery = '';
    this.first = 0;
    this.refreshData();
  }

  private refreshData(): void {
    // Force a new emission from the service
    this.workoutService.refreshWorkouts();
  }
}
