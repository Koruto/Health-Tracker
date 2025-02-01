import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaloriesSummaryCardComponent } from './calories-summary-card.component';

describe('CaloriesSummaryCardComponent', () => {
  let component: CaloriesSummaryCardComponent;
  let fixture: ComponentFixture<CaloriesSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaloriesSummaryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaloriesSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
