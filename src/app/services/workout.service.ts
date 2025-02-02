import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Workout } from '../interfaces/workout';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private storageKey = 'workouts';
  private workoutsSubject = new BehaviorSubject<Workout[]>(this.loadWorkouts());
  workouts$ = this.workoutsSubject.asObservable();

  private loadWorkouts(): Workout[] {
    const workouts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    console.log('Loading workouts from storage:', workouts);
    return workouts;
  }

  getWorkouts(): Workout[] {
    return this.workoutsSubject.value;
  }

  addWorkout(workout: Workout) {
    console.log('Adding new workout:', workout);
    const workouts = this.getWorkouts();
    workouts.push(workout);
    localStorage.setItem(this.storageKey, JSON.stringify(workouts));
    this.workoutsSubject.next(workouts);
    console.log('Workouts after adding:', workouts);
  }

  refreshWorkouts() {
    console.log('Refreshing workouts');
    const workouts = this.loadWorkouts();
    this.workoutsSubject.next(workouts);
  }
}
