import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodDonutComponent } from './mood-donut.component';

describe('MoodDonutComponent', () => {
  let component: MoodDonutComponent;
  let fixture: ComponentFixture<MoodDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodDonutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
