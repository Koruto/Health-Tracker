import { Component, OnInit } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';

import { WorkoutService } from '../../../services/workout.service';
import { Workout } from '../../../interfaces/workout';

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
  ],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.scss',
})
export class WorkoutListComponent implements OnInit {
  workouts: Workout[] = [];
  filteredWorkouts: Workout[] = [];

  // Pagination
  first = 0;
  rows = 5;
  totalRecords = 0;
  loading = false;

  // Filters
  searchQuery = '';
  selectedWorkoutTypes: { name: string; value: string }[] = [];
  selectedIntensities: { name: string; value: string }[] = [];
  workoutTypeOptions: { name: string; value: string }[] = [];
  intensityOptions = [
    { name: 'Low', value: 'Low' },
    { name: 'Medium', value: 'Medium' },
    { name: 'High', value: 'High' },
  ];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  private initializeWorkoutTypeOptions(): void {
    this.workoutTypeOptions = [
      ...new Set(this.workouts.map((workout) => workout.workoutType)),
    ].map((type) => ({ name: type, value: type }));
  }

  loadWorkouts(): void {
    this.loading = true;
    try {
      this.workouts = this.workoutService.getWorkouts();
      this.initializeWorkoutTypeOptions();
      this.applyFilters();
    } finally {
      this.loading = false;
    }
  }

  applyFilters(): void {
    let filtered = this.workouts;

    // Apply workout type filter
    if (this.selectedWorkoutTypes.length > 0) {
      filtered = filtered.filter((workout) =>
        this.selectedWorkoutTypes.some(
          (type) => type.value === workout.workoutType
        )
      );
    }

    // Apply intensity filter
    if (this.selectedIntensities.length > 0) {
      filtered = filtered.filter((workout) =>
        this.selectedIntensities.some(
          (intensity) => intensity.value === workout.intensity
        )
      );
    }

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (workout) =>
          workout.username.toLowerCase().includes(query) ||
          workout.workoutType.toLowerCase().includes(query) ||
          workout.intensity.toLowerCase().includes(query)
      );
    }

    this.filteredWorkouts = filtered;
    this.totalRecords = filtered.length;
  }

  // Pagination methods
  next(): void {
    this.first = Math.min(
      this.first + this.rows,
      this.totalRecords - this.rows
    );
  }

  prev(): void {
    this.first = Math.max(0, this.first - this.rows);
  }

  reset(): void {
    this.first = 0;
    this.selectedWorkoutTypes = [];
    this.selectedIntensities = [];
    this.searchQuery = '';
    this.applyFilters();
  }

  pageChange(event: TablePageEvent): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.totalRecords
      ? this.first + this.rows >= this.totalRecords
      : true;
  }

  isFirstPage(): boolean {
    return this.first === 0;
  }

  // Filter event handlers
  onSearch(): void {
    this.first = 0;
    this.applyFilters();
  }

  onWorkoutTypeFilter(event: any): void {
    this.selectedWorkoutTypes = event.value;
    this.first = 0;
    this.applyFilters();
  }

  onIntensityFilter(event: any): void {
    this.selectedIntensities = event.value;
    this.first = 0;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedWorkoutTypes = [];
    this.selectedIntensities = [];
    this.searchQuery = '';
    this.first = 0;
    this.applyFilters();
  }

  viewWorkout(workout: Workout): void {
    // Implement view details logic here
    console.log('View workout:', workout);
  }
}
