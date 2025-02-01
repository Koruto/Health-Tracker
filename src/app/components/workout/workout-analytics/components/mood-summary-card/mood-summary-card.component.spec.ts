import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodSummaryCardComponent } from './mood-summary-card.component';

describe('MoodSummaryCardComponent', () => {
  let component: MoodSummaryCardComponent;
  let fixture: ComponentFixture<MoodSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodSummaryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
