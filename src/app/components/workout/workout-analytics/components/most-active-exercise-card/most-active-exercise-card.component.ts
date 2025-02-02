import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Workout } from '@interfaces/workout';
import { Ripple } from 'primeng/ripple';

interface ExerciseSummary {
  type: string;
  totalMinutes: number;
}

@Component({
  selector: 'app-most-active-exercise-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, Ripple],
  templateUrl: './most-active-exercise-card.component.html',
  styleUrl: './most-active-exercise-card.component.scss',
})
export class MostActiveExerciseCardComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  mostActiveExercise: string = '';

  ngOnChanges() {
    this.calculateMostActiveExercise();
  }

  private calculateMostActiveExercise(): void {
    // Group and sum minutes by workout type
    const exerciseSummary = this.workouts.reduce((acc, workout) => {
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
    } else {
      this.mostActiveExercise = '';
    }
  }
}
