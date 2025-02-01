import { Component, HostListener, inject } from '@angular/core';

import { WorkoutAnalyticsComponent } from '../../workout/workout-analytics/workout-analytics.component';
import { WorkoutManagementComponent } from '../../workout/workout-management/workout-management.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-main-layout',
  imports: [WorkoutAnalyticsComponent, WorkoutManagementComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private navigationService = inject(NavigationService);

  constructor() {
    // Initial section check
    setTimeout(() => this.checkVisibleSection(), 100);
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('scroll', ['$event'])
  onScroll() {
    this.checkVisibleSection();
  }

  private checkVisibleSection() {
    const sections = document.querySelectorAll('section');
    let maxVisibility = 0;
    let mostVisibleSection = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visibility = this.getVisibilityPercentage(rect);

      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleSection = section.id;
      }
    });

    if (mostVisibleSection) {
      this.navigationService.setActiveSection(mostVisibleSection);
    }
  }

  private getVisibilityPercentage(rect: DOMRect): number {
    const windowHeight = window.innerHeight;

    // If element is not visible at all
    if (rect.bottom < 0 || rect.top > windowHeight) {
      return 0;
    }

    // Calculate visible height
    const visibleHeight =
      Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const elementHeight = rect.height;

    return (visibleHeight / elementHeight) * 100;
  }

  ngOnInit() {
    // Set up scroll event on the main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.addEventListener('scroll', () => this.checkVisibleSection());
    }
  }
}
