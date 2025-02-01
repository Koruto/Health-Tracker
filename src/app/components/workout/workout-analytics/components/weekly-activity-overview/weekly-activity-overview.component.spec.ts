import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyActivityOverviewComponent } from './weekly-activity-overview.component';

describe('WeeklyActivityOverviewComponent', () => {
  let component: WeeklyActivityOverviewComponent;
  let fixture: ComponentFixture<WeeklyActivityOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyActivityOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyActivityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
