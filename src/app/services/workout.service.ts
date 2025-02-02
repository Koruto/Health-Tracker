import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Workout } from '../interfaces/workout';
import { INITIAL_WORKOUTS } from '../data/initial-workouts';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private storageKey = 'workouts';

  private workoutsSubject: BehaviorSubject<Workout[]>;
  workouts$;

  constructor() {
    // Initialize the subject with either saved or default data
    const savedData = localStorage.getItem(this.storageKey);
    const initialData = savedData ? JSON.parse(savedData) : INITIAL_WORKOUTS;

    // If no saved data, save the defaults
    if (!savedData) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_WORKOUTS));
    }

    this.workoutsSubject = new BehaviorSubject<Workout[]>(initialData);
    this.workouts$ = this.workoutsSubject.asObservable();
  }

  getWorkouts(): Workout[] {
    return this.workoutsSubject.getValue();
  }

  addWorkout(workout: Workout) {
    const currentWorkouts = [...this.workoutsSubject.getValue()];
    currentWorkouts.push(workout);
    localStorage.setItem(this.storageKey, JSON.stringify(currentWorkouts));
    this.workoutsSubject.next(currentWorkouts);
  }

  refreshWorkouts() {
    const savedData = localStorage.getItem(this.storageKey);
    const workouts = savedData ? JSON.parse(savedData) : INITIAL_WORKOUTS;
    this.workoutsSubject.next(workouts);
  }

  resetToDefault() {
    localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_WORKOUTS));
    this.workoutsSubject.next(INITIAL_WORKOUTS);
  }
}
