import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Workout } from '@interfaces/workout';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-total-activities-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, Ripple],
  templateUrl: './total-activities-card.component.html',
  styleUrl: './total-activities-card.component.scss',
})
export class TotalActivitiesCardComponent implements OnChanges {
  @Input() workouts: Workout[] = [];

  currentWeekCount = 0;

  ngOnChanges() {
    this.calculateTotalActivities();
  }

  private calculateTotalActivities(): void {
    this.currentWeekCount = this.workouts.length;
  }
}
