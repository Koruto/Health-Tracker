import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Dialog } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';

import { WorkoutService } from '@services/workout/workout.service';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    Dialog,
    SelectModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePicker,
    SliderModule,
    RatingModule,
    InputNumberModule,
    ToastModule,
  ],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss',
  providers: [MessageService],
})
export class WorkoutFormComponent implements OnInit {
  workoutForm: FormGroup;
  workoutTypes = [
    { name: '🏃 Running', value: 'Running' },
    { name: '🧘 Yoga', value: 'Yoga' },
    { name: '🚲 Cycling', value: 'Cycling' },
    { name: '⚡ HIIT', value: 'HIIT' },
  ];

  intensityLevels = [
    { name: 'Low', value: 'Low' },
    { name: 'Medium', value: 'Medium' },
    { name: 'High', value: 'High' },
  ];

  visible = false;
  todaysDate: Date | undefined;
  maxDate: Date | undefined;

  ngOnInit() {
    this.todaysDate = new Date();
    this.maxDate = new Date();
  }

  showDialog() {
    this.visible = true;
    this.workoutForm.reset({
      date: this.todaysDate,
      minutes: 1,
      mood: 0,
    });
  }

  private noWhitespaceValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) return null;
    const isWhitespace = control.value.toString().trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutService,
    private messageService: MessageService
  ) {
    this.workoutForm = this.fb.group({
      username: ['', [Validators.required, this.noWhitespaceValidator]],
      workoutType: ['', Validators.required],
      minutes: [
        1,
        [Validators.required, Validators.min(1), Validators.max(600)],
      ],
      date: [new Date(), Validators.required],
      intensity: ['', Validators.required],
      mood: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  calculateCalories(
    minutes: number,
    workoutType: string,
    intensity: string
  ): number {
    // Base calories per minute for each workout type
    const baseCalories: Record<string, number> = {
      Running: 10,
      Yoga: 3,
      Cycling: 8,
      HIIT: 12,
    };

    // Intensity multipliers
    const intensityMultiplier: Record<string, number> = {
      Low: 0.8,
      Medium: 1,
      High: 1.2,
    };

    return Math.round(
      minutes * baseCalories[workoutType] * intensityMultiplier[intensity]
    );
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      const formValue = this.workoutForm.value;
      const workoutDate = new Date(formValue.date);

      const workout = {
        ...formValue,
        username: formValue.username.trim(),
        calories: this.calculateCalories(
          formValue.minutes,
          formValue.workoutType,
          formValue.intensity
        ),
        day: workoutDate.toLocaleDateString('en-US', { weekday: 'long' }),
      };

      this.workoutService.addWorkout(workout);
      this.workoutForm.reset();
      this.visible = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Workout Added!',
        life: 2000,
        key: 'br',
      });
    }
  }

  selectIntensity(value: string) {
    this.workoutForm.patchValue({ intensity: value });
  }

  selectMood(value: number) {
    this.workoutForm.patchValue({ mood: value });
  }

  getMoodColors(value: number): { ring: string; text: string } {
    switch (value) {
      case 1:
        return {
          ring: 'rgb(239, 68, 68)',
          text: 'rgb(185, 28, 28)',
        };
      case 2:
        return {
          ring: 'rgb(251, 146, 60)',
          text: 'rgb(194, 65, 12)',
        };
      case 3:
        return {
          ring: 'rgb(250, 204, 21)',
          text: 'rgb(161, 98, 7)',
        };
      case 4:
        return {
          ring: 'rgb(132, 204, 22)',
          text: 'rgb(63, 98, 18)',
        };
      case 5:
        return {
          ring: 'rgb(34, 197, 94)',
          text: 'rgb(21, 128, 61)',
        };
      default:
        return {
          ring: 'rgb(209, 213, 219)',
          text: 'rgb(107, 114, 128)',
        };
    }
  }

  getMoodRingColor(value: number): string {
    return this.getMoodColors(value).ring;
  }

  getMoodTextColor(value: number): string {
    return this.getMoodColors(value).text;
  }

  getMoodDashArray(value: number): string {
    const percentage = (value / 5) * 100;
    return `${percentage}, 100`;
  }
}
