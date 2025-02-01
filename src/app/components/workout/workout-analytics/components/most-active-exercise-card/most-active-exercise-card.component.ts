import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Workout } from '@interfaces/workout';

interface ExerciseSummary {
  type: string;
  totalMinutes: number;
}

@Component({
  selector: 'app-most-active-exercise-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './most-active-exercise-card.component.html',
  styleUrl: './most-active-exercise-card.component.scss',
})
export class MostActiveExerciseCardComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  mostActiveExercise: string = '';
  exerciseDuration: string = '';

  ngOnChanges() {
    this.calculateMostActiveExercise();
  }

  private calculateMostActiveExercise(): void {
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // Filter workouts for current week - removed username filter
    const weeklyWorkouts = this.workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= weekStart && workoutDate <= currentDate;
    });

    // Group and sum minutes by workout type
    const exerciseSummary = weeklyWorkouts.reduce((acc, workout) => {
      const existing = acc.find((item) => item.type === workout.workoutType);
      if (existing) {
        existing.totalMinutes += workout.minutes;
      } else {
        acc.push({ type: workout.workoutType, totalMinutes: workout.minutes });
      }
      return acc;
    }, [] as ExerciseSummary[]);

    // Find exercise with maximum minutes
    if (exerciseSummary.length > 0) {
      const mostActive = exerciseSummary.reduce((max, current) =>
        current.totalMinutes > max.totalMinutes ? current : max
      );

      this.mostActiveExercise = mostActive.type;
      this.exerciseDuration = this.formatDuration(mostActive.totalMinutes);
    } else {
      this.mostActiveExercise = '';
      this.exerciseDuration = '';
    }
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes}m`;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }
}
