import { Component, Input, OnChanges } from '@angular/core';
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
export class WeeklyPerformanceChartComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  chartData: any;
  chartOptions: any;
  weekRange: string = '';

  ngOnChanges() {
    this.calculateWeeklyMetrics();
  }

  private calculateWeeklyMetrics(): void {
    const currentDate = new Date();
    currentDate.setHours(23, 59, 59, 999); // Set to end of day
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6); // Changed from -7 to -6 to include today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Format date range
    this.weekRange = `${sevenDaysAgo.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${currentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;

    // Filter workouts for last 7 days
    const weeklyWorkouts = this.workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= sevenDaysAgo && workoutDate <= currentDate;
    });

    // Initialize daily data for the past 7 days
    const dailyData: { date: Date; minutes: number; calories: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      dailyData.push({ date, minutes: 0, calories: 0 });
    }

    let totalMinutes = 0;
    let highIntensityMinutes = 0;

    // Process workout data
    weeklyWorkouts.forEach((workout) => {
      const workoutDate = new Date(workout.date);
      const dayIndex = dailyData.findIndex(
        (day) => day.date.toDateString() === workoutDate.toDateString()
      );

      if (dayIndex !== -1) {
        dailyData[dayIndex].minutes += workout.minutes;
        dailyData[dayIndex].calories += workout.calories;

        totalMinutes += workout.minutes;
        if (workout.intensity === 'High') {
          highIntensityMinutes += workout.minutes;
        }
      }
    });

    this.initializeChart(dailyData);
  }

  private initializeChart(dailyData: any[]): void {
    this.chartData = {
      labels: dailyData.map((d) =>
        d.date.toLocaleDateString('en-US', { weekday: 'short' })
      ),
      datasets: [
        {
          type: 'bar',
          label: 'Minutes',
          data: dailyData.map((d) => d.minutes),
          yAxisID: 'y',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          order: 1,
        },
        {
          type: 'bar',
          label: 'Calories',
          data: dailyData.map((d) => d.calories),
          yAxisID: 'y1',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 1,
          order: 2,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 3,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
        },
        tooltip: {
          callbacks: {
            title: (context: any) => {
              const index = context[0].dataIndex;
              return dailyData[index].date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              });
            },
            label: (context: any) => {
              const dataIndex = context.dataIndex;
              const label = context.dataset.label;
              if (label === 'Calories') {
                return `Calories: ${dailyData[dataIndex].calories}`;
              } else {
                return `Duration: ${dailyData[dataIndex].minutes} minutes`;
              }
            },
          },
          displayColors: true,
          padding: 10,
          titleMarginBottom: 10,
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
}
