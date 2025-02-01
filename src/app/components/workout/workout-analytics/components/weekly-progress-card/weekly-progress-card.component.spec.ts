import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyProgressCardComponent } from './weekly-progress-card.component';

describe('WeeklyProgressCardComponent', () => {
  let component: WeeklyProgressCardComponent;
  let fixture: ComponentFixture<WeeklyProgressCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyProgressCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyProgressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
