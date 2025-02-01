import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPerformanceChartComponent } from './weekly-performance-chart.component';

describe('WeeklyPerformanceChartComponent', () => {
  let component: WeeklyPerformanceChartComponent;
  let fixture: ComponentFixture<WeeklyPerformanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyPerformanceChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
