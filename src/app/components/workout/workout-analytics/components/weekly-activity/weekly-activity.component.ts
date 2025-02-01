import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

import { Workout } from '@interfaces/workout';
import { WorkoutType } from '@interfaces/workout-types';

interface DailyWorkout {
  type: WorkoutType;
  duration: number;
  calories: number;
}

@Component({
  selector: 'app-weekly-activity',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    CalendarModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './weekly-activity.component.html',
})
export class WeeklyActivityComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  chartData: any;
  chartOptions: any;
  weekRange: string = '';

  private readonly workoutColors = {
    [WorkoutType.HIIT]: 'rgba(255, 99, 132, 0.8)',
    [WorkoutType.Running]: 'rgba(54, 162, 235, 0.8)',
    [WorkoutType.Yoga]: 'rgba(75, 192, 192, 0.8)',
    [WorkoutType.Strength]: 'rgba(255, 206, 86, 0.8)',
    [WorkoutType.Cycling]: 'rgba(153, 102, 255, 0.8)',
    [WorkoutType.Rest]: 'rgba(232, 244, 248, 0.8)',
  };

  // Calculate default week range
  private calculateDefaultWeekRange() {
    const currentDate = new Date();
    currentDate.setHours(23, 59, 59, 999); // Set to end of day

    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6); // Change to -6 to include today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return { start: sevenDaysAgo, end: currentDate };
  }

  ngOnChanges() {
    this.processWeeklyData();
  }

  private processWeeklyData(): void {
    const { start: weekStart, end: weekEnd } = this.calculateDefaultWeekRange();

    this.weekRange = `${weekStart.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${weekEnd.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;

    // Initialize array for each day
    const dailyWorkouts: DailyWorkout[][] = Array(7)
      .fill(null)
      .map(() => []);

    // Group workouts by day
    this.workouts
      .filter((workout) => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      })
      .forEach((workout) => {
        const dayIndex = new Date(workout.date).getDay();
        dailyWorkouts[dayIndex].push({
          type: workout.workoutType as WorkoutType,
          duration: workout.minutes,
          calories: workout.calories,
        });
      });

    this.prepareChartData(dailyWorkouts);
  }

  private prepareChartData(dailyWorkouts: DailyWorkout[][]): void {
    // Get all workout types in the data
    const workoutTypes = Object.values(WorkoutType);

    const datasets = workoutTypes.map((type) => ({
      label: type,
      data: dailyWorkouts.map((dayWorkouts) => {
        const workout = dayWorkouts.find((w) => w.type === type);
        // If it's a rest day, show a fixed duration
        if (type === WorkoutType.Rest && workout) {
          return 30; // Fixed duration for visual consistency
        }
        return workout?.duration || 0;
      }),
      backgroundColor: this.workoutColors[type],
      borderWidth: 0,
    }));

    this.chartData = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets,
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: true,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const dayIndex = context.dataIndex;
              const workoutType = context.dataset.label;
              const dayWorkouts = dailyWorkouts[dayIndex];
              const workout = dayWorkouts.find((w) => w.type === workoutType);

              if (!workout) return '';
              if (workoutType === WorkoutType.Rest) return 'Rest Day';

              return [
                `${workoutType}`,
                `Duration: ${workout.duration} mins`,
                `Calories: ${workout.calories} cal`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
          grid: {
            color: 'rgba(0,0,0,0.05)',
          },
          title: {
            display: true,
            text: 'Minutes',
          },
        },
      },
    };
  }
}
