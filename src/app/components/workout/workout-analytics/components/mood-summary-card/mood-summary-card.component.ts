import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Workout } from '@interfaces/workout';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-mood-summary-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ChartModule],
  templateUrl: './mood-summary-card.component.html',
})
export class MoodSummaryCardComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  avgMood: number = 0;
  moodEmoji: string = '';
  moodLabel: string = '';
  moodTrend: string = '';
  trendIcon: string = '';
  trendPercentage: number = 0;
  ringColor: string = '';
  tooltipColor: string = '';

  chartData: any;
  chartOptions: any;

  private readonly moodMap = [
    {
      min: 0,
      max: 1,
      emoji: '😢',
      label: 'Poor',
      color: 'text-red-500',
      ring: 'rgb(244, 67, 54)', // Material Red
      tooltipBg: 'rgb(211, 47, 47)', // Darker Red
    },
    {
      min: 1,
      max: 2,
      emoji: '😕',
      label: 'Not Good',
      color: 'text-orange-500',
      ring: 'rgb(255, 145, 0)', // Material Orange
      tooltipBg: 'rgb(230, 81, 0)', // Darker Orange
    },
    {
      min: 2,
      max: 3,
      emoji: '😐',
      label: 'Okay',
      color: 'text-yellow-500',
      ring: 'rgb(255, 193, 7)', // Material Yellow
      tooltipBg: 'rgb(255, 160, 0)', // Amber for better contrast
    },
    {
      min: 3,
      max: 4,
      emoji: '🙂',
      label: 'Good',
      color: 'text-blue-500',
      ring: 'rgb(33, 150, 243)', // Material Blue
      tooltipBg: 'rgb(25, 118, 210)', // Darker Blue
    },
    {
      min: 4,
      max: 5,
      emoji: '😄',
      label: 'Excellent',
      color: 'text-green-500',
      ring: 'rgb(76, 175, 80)', // Material Green
      tooltipBg: 'rgb(56, 142, 60)', // Darker Green
    },
  ];

  ngOnChanges() {
    this.calculateMoodMetrics();
    this.initializeChart();
  }

  private calculateMoodMetrics(): void {
    const currentDate = new Date();
    currentDate.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Filter workouts for last 7 days
    const recentWorkouts = this.workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= sevenDaysAgo && workoutDate <= currentDate;
    });

    const userWorkouts = recentWorkouts.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (userWorkouts.length === 0) {
      this.setMoodDisplay(0);
      return;
    }

    // Calculate average mood
    this.avgMood =
      userWorkouts.reduce((sum, workout) => sum + workout.mood, 0) /
      userWorkouts.length;

    // Calculate mood trend
    if (userWorkouts.length >= 2) {
      const midPoint = Math.floor(userWorkouts.length / 2);
      const firstHalf = userWorkouts.slice(0, midPoint);
      const secondHalf = userWorkouts.slice(midPoint);

      const firstAvg =
        firstHalf.reduce((sum, w) => sum + w.mood, 0) / firstHalf.length;
      const secondAvg =
        secondHalf.reduce((sum, w) => sum + w.mood, 0) / secondHalf.length;

      const difference = ((secondAvg - firstAvg) / firstAvg) * 100;

      this.trendPercentage = Math.abs(Math.round(difference));

      if (difference > 0) {
        this.moodTrend = 'Improving';
        this.trendIcon = 'pi pi-arrow-up';
      } else if (difference < 0) {
        this.moodTrend = 'Declining';
        this.trendIcon = 'pi pi-arrow-down';
      } else {
        this.moodTrend = 'Steady';
        this.trendIcon = 'pi pi-minus';
      }
    } else {
      this.moodTrend = 'Not enough data';
      this.trendIcon = 'pi pi-minus';
    }

    this.setMoodDisplay(this.avgMood);
  }

  private setMoodDisplay(mood: number): void {
    const moodLevel =
      this.moodMap.find(m => mood >= m.min && mood <= m.max) || this.moodMap[0];
    this.moodEmoji = moodLevel.emoji;
    this.moodLabel = moodLevel.label;
    this.ringColor = moodLevel.ring;
    this.tooltipColor = moodLevel.tooltipBg;
  }

  getMoodColor(): string {
    const moodLevel = this.moodMap.find(
      m => this.avgMood >= m.min && this.avgMood <= m.max
    );
    return moodLevel?.color || 'text-gray-500';
  }

  getTrendColor(): string {
    if (this.moodTrend === 'Improving') return 'text-green-500';
    if (this.moodTrend === 'Declining') return 'text-red-500';
    return 'text-gray-500';
  }

  getRingOffset(): string {
    const circumference = 314.16; // 2 * PI * 42 (new radius)
    const progress = (this.avgMood / 5) * 100;
    const offset = circumference - (progress / 100) * circumference;
    return offset.toString();
  }

  getTooltipText(): string {
    return `Mood Score: ${this.avgMood.toFixed(1)}/5`;
  }

  private initializeChart(): void {
    this.chartData = {
      datasets: [
        {
          data: [this.avgMood, 5 - this.avgMood],
          backgroundColor: [this.ringColor, 'rgba(0,0,0,0.05)'],
          borderWidth: 0,
          cutout: '85%', // Increased cutout for thinner ring
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      responsive: true,
      maintainAspectRatio: true,
      rotation: 90, // Changed rotation to start from right
      circumference: 360,
      cutout: '85%',
      events: [], // Disable all events
    };
  }
}
