import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyOverviewChartComponent } from './weekly-overview-chart.component';

describe('WeeklyOverviewChartComponent', () => {
  let component: WeeklyOverviewChartComponent;
  let fixture: ComponentFixture<WeeklyOverviewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyOverviewChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyOverviewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
