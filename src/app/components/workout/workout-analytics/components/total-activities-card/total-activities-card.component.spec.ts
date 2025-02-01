import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalActivitiesCardComponent } from './total-activities-card.component';

describe('TotalActivitiesCardComponent', () => {
  let component: TotalActivitiesCardComponent;
  let fixture: ComponentFixture<TotalActivitiesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalActivitiesCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalActivitiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
