// workout-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

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
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.scss',
})
export class WorkoutListComponent implements OnInit {
  workouts: Workout[] = [];
  filteredWorkouts: Workout[] = [];

  workoutTypes = [
    { name: 'All', value: 'All' },
    { name: 'Cardio', value: 'Cardio' },
    { name: 'Strength', value: 'Strength' },
    { name: 'Yoga', value: 'Yoga' },
    { name: 'HIIT', value: 'HIIT' },
  ];

  selectedWorkoutType = 'All';
  searchQuery = '';

  first = 0;
  rows = 5;
  totalRecords = 0;

  loading = false;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.loading = true;
    try {
      this.workouts = this.workoutService.getWorkouts();
      this.applyFilters();
    } finally {
      this.loading = false;
    }
  }

  applyFilters(): void {
    this.filteredWorkouts = this.workouts.filter(
      (workout) =>
        (this.selectedWorkoutType === 'All' ||
          workout.workoutType === this.selectedWorkoutType) &&
        workout.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalRecords = this.filteredWorkouts.length;
  }

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
    this.selectedWorkoutType = 'All';
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

  onSearchChange(): void {
    this.first = 0; // Reset to first page when searching
    this.applyFilters();
  }

  onWorkoutTypeChange(): void {
    this.first = 0; // Reset to first page when filtering
    this.applyFilters();
  }
}
