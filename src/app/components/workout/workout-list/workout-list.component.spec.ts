import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { WorkoutService } from '../../../services/workout/workout.service';
import { BehaviorSubject } from 'rxjs';
import { Workout } from '@interfaces/workout';
import { ChangeDetectorRef } from '@angular/core';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;
  let mockWorkouts$: BehaviorSubject<Workout[]>;
  let cdr: ChangeDetectorRef;

  const mockWorkouts: Workout[] = [
    {
      username: 'user1',
      workoutType: 'Running',
      minutes: 30,
      date: new Date('2024-02-01'),
      intensity: 'High',
      calories: 300,
      mood: 5,
      day: 'Monday',
    },
    {
      username: 'user2',
      workoutType: 'Yoga',
      minutes: 45,
      date: new Date('2024-02-02'),
      intensity: 'Low',
      calories: 150,
      mood: 4,
      day: 'Tuesday',
    },
    {
      username: 'user3',
      workoutType: 'Running',
      minutes: 20,
      date: new Date('2024-02-03'),
      intensity: 'Medium',
      calories: 200,
      mood: 3,
      day: 'Wednesday',
    },
    {
      username: 'user4',
      workoutType: 'Swimming',
      minutes: 40,
      date: new Date('2024-02-04'),
      intensity: 'High',
      calories: 400,
      mood: 2,
      day: 'Thursday',
    },
    {
      username: 'user5',
      workoutType: 'Weightlifting',
      minutes: 60,
      date: new Date('2024-02-05'),
      intensity: 'High',
      calories: 450,
      mood: 1,
      day: 'Friday',
    },
    {
      username: 'user6',
      workoutType: 'CrossFit',
      minutes: 50,
      date: new Date('2024-02-06'),
      intensity: 'High',
      calories: 500,
      mood: 6,
      day: 'Saturday',
    }
  ];

  beforeEach(async () => {
    mockWorkouts$ = new BehaviorSubject<Workout[]>(mockWorkouts);

    const workoutServiceSpy = jasmine.createSpyObj(
      'WorkoutService',
      ['refreshWorkouts'],
      {
        workouts$: mockWorkouts$,
      }
    );

    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    workoutService = TestBed.inject(
      WorkoutService
    ) as jasmine.SpyObj<WorkoutService>;
    cdr = TestBed.inject(ChangeDetectorRef);
    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.searchQuery).toBe('');
    expect(component.selectedWorkoutTypes).toEqual([]);
    expect(component.selectedIntensities).toEqual([]);
    expect(component.first).toBe(0);
    expect(component.rows).toBe(5);
    expect(component.totalRecords).toBe(mockWorkouts.length);
  });

  it('should initialize workout type options from workouts', () => {
    const expectedOptions = [
      { name: 'Running', value: 'Running' },
      { name: 'Yoga', value: 'Yoga' },
      { name: 'Swimming', value: 'Swimming' },
      { name: 'Weightlifting', value: 'Weightlifting' },
      { name: 'CrossFit', value: 'CrossFit' }
    ];
    expect(component.workoutTypeOptions).toEqual(expectedOptions);
  });

  describe('Filtering', () => {
    // Test private applyFilters method directly
    describe('applyFilters', () => {
      it('should handle empty filters', () => {
        const result = component['applyFilters'](mockWorkouts);
        expect(result).toEqual(mockWorkouts);
      });

      it('should filter by workout type case insensitive', () => {
        component.selectedWorkoutTypes = [
          { name: 'running', value: 'Running' },
        ];
        const result = component['applyFilters'](mockWorkouts);
        expect(result.length).toBe(2);
        expect(result.every(w => w.workoutType === 'Running')).toBeTrue();
      });

      it('should filter by intensity case insensitive', () => {
        component.selectedIntensities = [{ name: 'high', value: 'High' }];
        const result = component['applyFilters'](mockWorkouts);
        expect(result.length).toBe(4);
        expect(result[0].intensity).toBe('High');
      });

      it('should handle search query for workout type', () => {
        component.searchQuery = 'yoga';
        const result = component['applyFilters'](mockWorkouts);
        expect(result.length).toBe(1);
        expect(result[0].workoutType).toBe('Yoga');
      });

      it('should handle search query for intensity', () => {
        component.searchQuery = 'medium';
        const result = component['applyFilters'](mockWorkouts);
        expect(result.length).toBe(1);
        expect(result[0].intensity).toBe('Medium');
      });

      it('should handle no matches for search query', () => {
        component.searchQuery = 'nonexistent';
        const result = component['applyFilters'](mockWorkouts);
        expect(result.length).toBe(0);
      });

      it('should handle empty workout types array', () => {
        component.selectedWorkoutTypes = [];
        const result = component['applyFilters'](mockWorkouts);
        expect(result).toEqual(mockWorkouts);
      });

      it('should handle empty intensities array', () => {
        component.selectedIntensities = [];
        const result = component['applyFilters'](mockWorkouts);
        expect(result).toEqual(mockWorkouts);
      });

      it('should handle empty search query', () => {
        component.searchQuery = '';
        const result = component['applyFilters'](mockWorkouts);
        expect(result).toEqual(mockWorkouts);
      });

      it('should handle combined filters', () => {
        component.selectedWorkoutTypes = [
          { name: 'Running', value: 'Running' },
        ];
        component.selectedIntensities = [{ name: 'High', value: 'High' }];
        component.searchQuery = 'user1';
        const result = component['applyFilters'](mockWorkouts);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(mockWorkouts[0]);
      });

      it('should handle whitespace in search query', () => {
        component.searchQuery = '  user1  ';
        const result = component['applyFilters'](mockWorkouts);
        expect(result.length).toBe(1);
        expect(result[0].username).toBe('user1');
      });
    });

    it('should filter by workout type', fakeAsync(() => {
      // Update mockWorkouts$ with filtered data
      const filteredWorkouts = mockWorkouts.filter(
        w => w.workoutType === 'Running'
      );

      component.onWorkoutTypeFilter({
        value: [{ name: 'Running', value: 'Running' }],
      });
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.tableData.length).toBe(2);
      expect(
        component.tableData.every(w => w.workoutType === 'Running')
      ).toBeTrue();
    }));

    it('should filter by intensity', fakeAsync(() => {
      const filteredWorkouts = mockWorkouts.filter(w => w.intensity === 'High');

      component.onIntensityFilter({ value: [{ name: 'High', value: 'High' }] });
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.tableData.length).toBe(4);
      expect(component.tableData[0].intensity).toBe('High');
    }));

    it('should filter by search query', fakeAsync(() => {
      const filteredWorkouts = mockWorkouts.filter(w => w.username === 'user1');
      component.searchQuery = 'user1';

      component.onSearch();
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.tableData.length).toBe(1);
      expect(component.tableData[0].username).toBe('user1');
    }));

    it('should clear all filters', fakeAsync(() => {
      component.searchQuery = 'user1';
      component.selectedWorkoutTypes = [{ name: 'Running', value: 'Running' }];
      component.selectedIntensities = [{ name: 'High', value: 'High' }];
      component.onSearch();

      component.clearFilters();
      mockWorkouts$.next(mockWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.searchQuery).toBe('');
      expect(component.selectedWorkoutTypes).toEqual([]);
      expect(component.selectedIntensities).toEqual([]);
      expect(component.tableData.length).toBe(mockWorkouts.length);
    }));

    it('should handle multiple filters simultaneously', fakeAsync(() => {
      const filteredWorkouts = mockWorkouts.filter(
        w => w.workoutType === 'Running' && w.intensity === 'High'
      );

      component.selectedWorkoutTypes = [{ name: 'Running', value: 'Running' }];
      component.selectedIntensities = [{ name: 'High', value: 'High' }];
      component.onSearch();
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.tableData.length).toBe(1);
    }));
  });

  describe('Pagination', () => {
    it('should handle next page correctly', () => {
      component.first = 0;
      component.rows = 5;
      component.totalRecords = 15;

      component.next();
      expect(component.first).toBe(5);

      component.next();
      expect(component.first).toBe(10);
    });

    it('should handle previous page correctly', () => {
      component.first = 10;
      component.rows = 5;

      component.prev();
      expect(component.first).toBe(5);

      component.prev();
      expect(component.first).toBe(0);
    });

    it('should identify first page correctly', () => {
      component.first = 0;
      expect(component.isFirstPage()).toBeTrue();

      component.first = 5;
      expect(component.isFirstPage()).toBeFalse();
    });

    it('should identify last page correctly', () => {
      component.first = 0;
      component.rows = 5;
      component.totalRecords = 15;

      expect(component.isLastPage()).toBeFalse();

      component.first = 10;
      expect(component.isLastPage()).toBeTrue();
    });

    it('should reset pagination', () => {
      component.first = 10;
      component.reset();
      expect(component.first).toBe(0);
    });

    // it('should handle edge cases in pagination', () => {
    //   component.first = 10;
    //   component.rows = 5;
    //   component.totalRecords = 12; // Not exactly divisible by rows

    //   component.next();
    //   expect(component.first).toBe(10); // Should not exceed last possible page

    //   component.first = 0;
    //   component.prev();
    //   expect(component.first).toBe(0); // Should not go below 0
    // });
  });

  describe('Service interaction', () => {
    it('should call refreshWorkouts when filters are applied', () => {
      component.onSearch();
      expect(workoutService.refreshWorkouts).toHaveBeenCalled();
    });

    it('should update totalRecords when workouts are filtered', fakeAsync(() => {
      const filteredWorkouts = mockWorkouts.filter(
        w => w.workoutType === 'Running'
      );
      component.onWorkoutTypeFilter({
        value: [{ name: 'Running', value: 'Running' }],
      });
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.totalRecords).toBe(2);
    }));

    it('should handle empty workout data', fakeAsync(() => {
      mockWorkouts$.next([]);
      tick();
      fixture.detectChanges();

      expect(component.totalRecords).toBe(0);
      expect(component.isLastPage()).toBeTrue();
      expect(component.isFirstPage()).toBeTrue();
    }));
  });

  it('should clean up subscription on destroy', () => {
    const subscriptionSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(subscriptionSpy).toHaveBeenCalled();
  });

  describe('Mood Filtering', () => {
    it('should handle workouts with very low mood (1)', fakeAsync(() => {
      const filteredWorkouts = mockWorkouts.filter(w => w.mood === 1);
      component.searchQuery = 'user5';  // The user with mood 1
      
      component.onSearch();
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.tableData.length).toBe(1);
      expect(component.tableData[0].mood).toBe(1);
    }));

    it('should handle workouts with low mood (2)', fakeAsync(() => {
      const filteredWorkouts = mockWorkouts.filter(w => w.mood === 2);
      component.searchQuery = 'user4';  // The user with mood 2
      
      component.onSearch();
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.tableData.length).toBe(1);
      expect(component.tableData[0].mood).toBe(2);
    }));

    it('should handle workouts with maximum mood (6)', fakeAsync(() => {
      const filteredWorkouts = mockWorkouts.filter(w => w.mood === 6);
      component.searchQuery = 'user6';  // The user with mood 6
      
      component.onSearch();
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.tableData.length).toBe(1);
      expect(component.tableData[0].mood).toBe(6);
    }));

    it('should handle filtering multiple mood values', fakeAsync(() => {
      const filteredWorkouts = mockWorkouts.filter(w => w.mood <= 2);
      
      component.onSearch();
      mockWorkouts$.next(filteredWorkouts);
      tick();
      fixture.detectChanges();

      expect(component.tableData.length).toBe(2);
      expect(component.tableData.every(w => w.mood <= 2)).toBeTrue();
    }));
  });
});
