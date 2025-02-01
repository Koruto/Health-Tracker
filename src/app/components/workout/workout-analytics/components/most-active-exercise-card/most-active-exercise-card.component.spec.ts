import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostActiveExerciseCardComponent } from './most-active-exercise-card.component';

describe('MostActiveExerciseCardComponent', () => {
  let component: MostActiveExerciseCardComponent;
  let fixture: ComponentFixture<MostActiveExerciseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostActiveExerciseCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostActiveExerciseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
