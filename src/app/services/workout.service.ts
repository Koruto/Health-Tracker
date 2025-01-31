import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private storageKey = 'workouts';

  getWorkouts() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  addWorkout(workout: any) {
    const workouts = this.getWorkouts();
    workouts.push(workout);
    localStorage.setItem(this.storageKey, JSON.stringify(workouts));
  }

  // // Add these methods to the component class
  // editWorkout(workout: Workout): void {
  //   // Implement edit logic
  //   console.log('Edit workout:', workout);
  // }

  // deleteWorkout(workout: Workout): void {
  //   // Implement delete logic
  //   console.log('Delete workout:', workout);
  // }
}
