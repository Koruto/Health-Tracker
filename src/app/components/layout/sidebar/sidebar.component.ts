import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { octHome, octGraph } from '@ng-icons/octicons';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

import { NavigationService } from '@services/navigation/navigation.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, NgIcon, Tooltip],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  viewProviders: [provideIcons({ octHome, octGraph })],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private navigationService = inject(NavigationService);
  private cdr = inject(ChangeDetectorRef);
  private subscription = new Subscription();

  activeSection = 'workouts';

  ngOnInit() {
    this.subscription.add(
      this.navigationService.activeSection$.subscribe(section => {
        this.activeSection = section;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigateToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.navigationService.setActiveSection(sectionId);
    }
  }
}
