import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Workout } from '@interfaces/workout';

@Component({
  selector: 'app-workout-distribution-chart',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './workout-distribution-chart.component.html',
})
export class WorkoutDistributionComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  chartData: any;
  chartOptions: any;

  private readonly colorPalette = [
    'rgba(54, 162, 235, 0.7)', // Blue
    'rgba(255, 99, 132, 0.7)', // Red
    'rgba(75, 192, 192, 0.7)', // Teal
    'rgba(255, 159, 64, 0.7)', // Orange
    'rgba(153, 102, 255, 0.7)', // Purple
    'rgba(255, 205, 86, 0.7)', // Yellow
  ];

  ngOnChanges() {
    this.processWorkoutData();
  }

  private processWorkoutData(): void {
    // Count workouts by type - removed username filter
    const workoutCounts = this.workouts.reduce((acc, workout) => {
      acc[workout.workoutType] = (acc[workout.workoutType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and ensure all workout types have values
    const workoutTypes = [...new Set(this.workouts.map((w) => w.workoutType))];
    const sortedWorkouts = workoutTypes.map((type) => ({
      type,
      count: workoutCounts[type] || 0,
    }));

    // Prepare chart data
    this.chartData = {
      labels: sortedWorkouts.map((w) => w.type),
      datasets: [
        {
          data: sortedWorkouts.map((w) => w.count),
          backgroundColor: this.colorPalette.slice(0, sortedWorkouts.length),
          borderColor: this.colorPalette.map((color) =>
            color.replace('0.7', '1')
          ),
          borderWidth: 1,
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'right',
          align: 'start',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} times (${percentage}%)`;
            },
          },
        },
      },
      scales: {
        r: {
          ticks: {
            display: false,
            stepSize: 1,
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    };
  }
}
