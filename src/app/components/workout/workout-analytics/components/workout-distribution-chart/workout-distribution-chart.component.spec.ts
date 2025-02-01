import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDistributionChartComponent } from './workout-distribution-chart.component';

describe('WorkoutDistributionChartComponent', () => {
  let component: WorkoutDistributionChartComponent;
  let fixture: ComponentFixture<WorkoutDistributionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDistributionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
