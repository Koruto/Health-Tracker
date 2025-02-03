import { WorkoutType } from '@interfaces/workout-types';

export interface DailyWorkout {
  type: WorkoutType;
  duration: number;
  calories: number;
}
