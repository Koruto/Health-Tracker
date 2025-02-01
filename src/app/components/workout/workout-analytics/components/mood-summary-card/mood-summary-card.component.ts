//components/workout-analytics/components/mood-summary-card/mood-summary-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Workout } from '@interfaces/workout';

@Component({
  selector: 'app-mood-summary-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './mood-summary-card.component.html',
})
export class MoodSummaryCardComponent implements OnInit {
  @Input() workouts: Workout[] = [];

  avgMood: number = 0;
  moodEmoji: string = '';
  moodLabel: string = '';
  moodTrend: string = '';
  trendIcon: string = '';
  trendPercentage: number = 0;

  private readonly moodMap = [
    { min: 0, max: 1, emoji: '😢', label: 'Poor', color: 'bg-red-500' },
    { min: 1, max: 2, emoji: '😕', label: 'Not Good', color: 'bg-orange-500' },
    { min: 2, max: 3, emoji: '😐', label: 'Okay', color: 'bg-yellow-500' },
    { min: 3, max: 4, emoji: '🙂', label: 'Good', color: 'bg-blue-500' },
    { min: 4, max: 5, emoji: '😄', label: 'Excellent', color: 'bg-green-500' },
  ];

  ngOnInit() {
    if (this.workouts.length) {
      this.calculateMoodMetrics();
    }
  }

  private calculateMoodMetrics(): void {
    // Get workouts for John Doe and sort by date
    const userWorkouts = this.workouts
      .filter((workout) => workout.username === 'John Doe')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
      // Split workouts into two halves
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
      this.moodMap.find((m) => mood >= m.min && mood <= m.max) ||
      this.moodMap[0];
    this.moodEmoji = moodLevel.emoji;
    this.moodLabel = moodLevel.label;
  }

  getMoodColor(): string {
    const moodLevel = this.moodMap.find(
      (m) => this.avgMood >= m.min && this.avgMood <= m.max
    );
    return moodLevel?.color || 'bg-gray-500';
  }

  getTrendColor(): string {
    if (this.moodTrend === 'Improving') return 'text-green-500';
    if (this.moodTrend === 'Declining') return 'text-red-500';
    return 'text-gray-500';
  }
}
