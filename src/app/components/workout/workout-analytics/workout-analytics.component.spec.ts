import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutAnalyticsComponent } from './workout-analytics.component';

describe('WorkoutAnalyticsComponent', () => {
  let component: WorkoutAnalyticsComponent;
  let fixture: ComponentFixture<WorkoutAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
