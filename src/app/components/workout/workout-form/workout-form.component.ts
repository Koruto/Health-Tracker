import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Dialog } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';

import { WorkoutService } from '../../../services/workout.service';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    Dialog,
    SelectModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    SliderModule,
    RatingModule,
  ],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss',
})
export class WorkoutFormComponent {
  @Output() workoutAdded = new EventEmitter<void>();

  workoutForm: FormGroup;
  workoutTypes = [
    { name: 'Cardio', value: 'Cardio' },
    { name: 'Strength', value: 'Strength' },
    { name: 'Yoga', value: 'Yoga' },
    { name: 'HIIT', value: 'HIIT' },
  ];

  intensityLevels = [
    { name: 'Low', value: 'Low' },
    { name: 'Medium', value: 'Medium' },
    { name: 'High', value: 'High' },
  ];

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  constructor(private fb: FormBuilder, private workoutService: WorkoutService) {
    this.workoutForm = this.fb.group({
      username: ['', Validators.required],
      workoutType: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]],
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
    const baseCalories: { [key: string]: number } = {
      Cardio: 8,
      Strength: 6,
      Yoga: 4,
      HIIT: 10,
    };

    // Intensity multipliers
    const intensityMultiplier: { [key: string]: number } = {
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
        calories: this.calculateCalories(
          formValue.minutes,
          formValue.workoutType,
          formValue.intensity
        ),
        day: workoutDate.toLocaleDateString('en-US', { weekday: 'long' }),
      };

      this.workoutService.addWorkout(workout);
      console.log('Workout added successfully!', workout);
      this.workoutForm.reset();
      this.visible = false;
      this.workoutAdded.emit();
    }
  }
}
