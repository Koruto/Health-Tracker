//components/workout-analytics/components/workout-metrics-summary/workout-metrics-summary.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Workout } from '@interfaces/workout';

@Component({
  selector: 'app-weekly-performance-chart',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './weekly-performance-chart.component.html',
})
export class WeeklyPerformanceChartComponent implements OnInit {
  @Input() workouts: Workout[] = [];

  chartData: any;
  chartOptions: any;
  weeklyProgress: number = 0;
  intensityProgress: number = 0;
  weekRange: string = '';

  readonly WHO_WEEKLY_MINUTES = 150;
  readonly WHO_VIGOROUS_MINUTES = 75;

  ngOnInit() {
    this.calculateWeeklyMetrics();
  }

  private calculateWeeklyMetrics(): void {
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Set week range
    this.weekRange = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;

    const weeklyWorkouts = this.workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate >= weekStart &&
        workoutDate <= currentDate &&
        workout.username === 'John Doe'
      );
    });

    // Process daily data
    const dailyData = Array(7)
      .fill(0)
      .map(() => ({ minutes: 0, calories: 0 }));
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let totalMinutes = 0;
    let highIntensityMinutes = 0;

    weeklyWorkouts.forEach((workout) => {
      const day = new Date(workout.date).getDay();
      dailyData[day].minutes += workout.minutes;
      dailyData[day].calories += workout.calories;

      totalMinutes += workout.minutes;
      if (workout.intensity === 'High') {
        highIntensityMinutes += workout.minutes;
      }
    });

    // Calculate progress percentages
    this.weeklyProgress = Math.min(
      Math.round((totalMinutes / this.WHO_WEEKLY_MINUTES) * 100),
      100
    );
    this.intensityProgress = Math.min(
      Math.round((highIntensityMinutes / this.WHO_VIGOROUS_MINUTES) * 100),
      100
    );

    this.initializeChart(dailyData, daysOfWeek);
  }

  private initializeChart(dailyData: any[], daysOfWeek: string[]): void {
    this.chartData = {
      labels: daysOfWeek,
      datasets: [
        {
          type: 'bar',
          label: 'Minutes',
          data: dailyData.map((d) => d.minutes),
          yAxisID: 'y',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
        {
          type: 'bar',
          label: 'Calories',
          data: dailyData.map((d) => d.calories),
          yAxisID: 'y1',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 1,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const dataIndex = context.dataIndex;
              const minutes = dailyData[dataIndex].minutes;
              const calories = dailyData[dataIndex].calories;
              return `Duration: ${minutes} mins | Calories: ${calories}`;
            },
          },
        },
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Minutes',
          },
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Calories',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };
  }

  getProgressColorClass(progress: number): string {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-primary-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  }
}
