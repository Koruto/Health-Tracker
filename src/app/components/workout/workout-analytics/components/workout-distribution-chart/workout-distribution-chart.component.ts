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
export class WorkoutDistributionChartComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  chartData: any;
  chartOptions: any;

  private readonly colorPalette = [
    'rgba(79, 166, 255, 0.65)', // Soft Blue
    'rgba(255, 145, 173, 0.65)', // Soft Pink
    'rgba(98, 210, 187, 0.65)', // Soft Teal
    'rgba(255, 178, 115, 0.65)', // Soft Orange
    'rgba(176, 147, 255, 0.65)', // Soft Purple
    'rgba(255, 218, 121, 0.65)', // Soft Yellow
  ];

  ngOnChanges() {
    this.processWorkoutData();
  }

  private processWorkoutData(): void {
    // Get date range for last 7 days
    const currentDate = new Date();
    currentDate.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6); // Changed from -7 to -6 to include today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Filter workouts for last 7 days
    const recentWorkouts = this.workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= sevenDaysAgo && workoutDate <= currentDate;
    });

    // Count workouts by type
    const workoutCounts = recentWorkouts.reduce(
      (acc, workout) => {
        acc[workout.workoutType] = (acc[workout.workoutType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Sort workout types by count (descending)
    const sortedWorkouts = Object.entries(workoutCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Prepare chart data
    this.chartData = {
      labels: sortedWorkouts.map(w => w.type),
      datasets: [
        {
          data: sortedWorkouts.map(w => w.count),
          backgroundColor: this.colorPalette.slice(0, sortedWorkouts.length),
          borderColor: this.colorPalette.map(color =>
            color.replace('0.65', '0.8')
          ),
          borderWidth: 1,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.26,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle',
            color: '#64748b', // slate-500
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#334155', // slate-700
          bodyColor: '#64748b', // slate-500
          padding: 12,
          boxPadding: 6,
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} workouts (${percentage}%)`;
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
            color: 'rgba(0, 0, 0, 0.03)',
            lineWidth: 1,
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.03)',
            lineWidth: 1,
          },
        },
      },
    };
  }
}
