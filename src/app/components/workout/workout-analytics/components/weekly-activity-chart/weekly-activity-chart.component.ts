import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

import { Workout } from '@interfaces/workout';
import { WorkoutType } from '@interfaces/workout-types';
import { DailyWorkout } from '@interfaces/daily-workout';

@Component({
  selector: 'app-weekly-activity-chart',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    CalendarModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './weekly-activity-chart.component.html',
})
export class WeeklyActivityChartComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  chartData: any;
  chartOptions: any;
  weekRange = '';

  private readonly workoutColors = {
    [WorkoutType.HIIT]: 'rgba(255, 99, 132, 0.8)',
    [WorkoutType.Running]: 'rgba(54, 162, 235, 0.8)',
    [WorkoutType.Yoga]: 'rgba(75, 192, 192, 0.8)',
    [WorkoutType.Cycling]: 'rgba(153, 102, 255, 0.8)',
  };

  ngOnChanges() {
    this.processWeeklyData();
  }

  private processWeeklyData(): void {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6);

    this.weekRange = `${sevenDaysAgo.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${currentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;

    // Initialize array to store combined workouts for each day using Map
    const dailyWorkouts: Map<WorkoutType, DailyWorkout>[] = Array(7)
      .fill(null)
      .map(() => new Map());

    // Process and combine workouts
    this.workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      const daysDiff = Math.floor(
        (workoutDate.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff >= 0 && daysDiff < 7) {
        const workoutType = workout.workoutType as WorkoutType;
        const dayMap = dailyWorkouts[daysDiff];

        if (dayMap.has(workoutType)) {
          // Combine with existing workout of same type
          const existing = dayMap.get(workoutType)!;
          existing.duration += workout.minutes;
          existing.calories += workout.calories;
        } else {
          // Add new workout type for the day
          dayMap.set(workoutType, {
            type: workoutType,
            duration: workout.minutes,
            calories: workout.calories,
          });
        }
      }
    });

    // Convert Maps to arrays for chart processing
    const combinedDailyWorkouts = dailyWorkouts.map(dayMap =>
      Array.from(dayMap.values())
    );

    this.prepareChartData(combinedDailyWorkouts);
  }

  private prepareChartData(dailyWorkouts: DailyWorkout[][]): void {
    const currentDate = new Date();
    const dates = Array(7)
      .fill(null)
      .map((_, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - (6 - i));
        return date;
      });

    const workoutTypes = Object.values(WorkoutType);

    const datasets = workoutTypes.map(type => ({
      label: type,
      data: dailyWorkouts.map(dayWorkouts => {
        const workout = dayWorkouts.find(w => w.type === type);
        return workout?.duration || 0;
      }),
      backgroundColor: this.workoutColors[type],
      borderWidth: 0,
    }));

    this.chartData = {
      labels: dates.map(date =>
        date.toLocaleDateString('en-US', { weekday: 'short' })
      ),
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
            title: (tooltipItems: any[]) => {
              const index = tooltipItems[0].dataIndex;
              return dates[index].toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              });
            },
            label: (context: any) => {
              const dayIndex = context.dataIndex;
              const workoutType = context.dataset.label;
              const dayWorkouts = dailyWorkouts[dayIndex];
              const workout = dayWorkouts.find(w => w.type === workoutType);

              if (!workout) return '';

              return [
                `${workoutType}`,
                `Total Duration: ${workout.duration} mins`,
                `Total Calories: ${workout.calories} cal`,
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
