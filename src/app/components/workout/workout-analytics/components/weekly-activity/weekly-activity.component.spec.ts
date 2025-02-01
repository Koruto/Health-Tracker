import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyActivityComponent } from './weekly-activity.component';

describe('WeeklyActivityComponent', () => {
  let component: WeeklyActivityComponent;
  let fixture: ComponentFixture<WeeklyActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
