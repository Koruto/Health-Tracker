// workout-form.component.ts
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

import { WorkoutService } from '../../../services/workout.service';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    SelectModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss',
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;
  workoutTypes = [
    { name: 'Cardio' },
    { name: 'Strength' },
    { name: 'Yoga' },
    { name: 'HIIT' },
  ];

  constructor(private fb: FormBuilder, private workoutService: WorkoutService) {
    this.workoutForm = this.fb.group({
      username: ['', Validators.required],
      workoutType: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      this.workoutService.addWorkout(this.workoutForm.value);
      console.log('Workout added successfully!', this.workoutForm.value);
      this.workoutForm.reset();
    }
  }
}
