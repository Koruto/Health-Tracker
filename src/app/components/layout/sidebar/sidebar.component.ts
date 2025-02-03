import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { octHome, octGraph, octGear } from '@ng-icons/octicons';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { NavigationService } from '@services/navigation/navigation.service';
import { WorkoutService } from '@services/workout/workout.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, NgIcon, Tooltip, ConfirmDialogModule, ToastModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  viewProviders: [provideIcons({ octHome, octGraph, octGear })],
  providers: [ConfirmationService, MessageService],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private navigationService = inject(NavigationService);
  private workoutService = inject(WorkoutService);
  private cdr = inject(ChangeDetectorRef);
  private subscription = new Subscription();

  activeSection = 'workouts';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

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

  resetData(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to reset all workout data? This cannot be undone.',
      header: 'Reset Data',
      acceptLabel: 'Reset',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        severity: 'danger',
      },
      accept: () => {
        this.workoutService.resetToDefault();
        this.messageService.add({
          severity: 'success',
          summary: 'Data Reset',
          detail: 'Workout data restored to default',
          life: 2000,
          key: 'br',
        });
      },
    });
  }
}
