import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { INITIAL_WORKOUTS } from '../../data/initial-workouts';
import { Workout } from '../../interfaces/workout';
import { firstValueFrom } from 'rxjs';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockWorkout: Workout = {
    username: 'TestUser',
    workoutType: 'HIIT',
    date: '2025-02-03T20:53:44.835Z',
    day: 'Monday',
    intensity: 'Medium',
    minutes: 30,
    calories: 300,
    mood: 4,
  };

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj('localStorage', [
      'getItem',
      'setItem',
    ]);
    spyOn(window.localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(window.localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('constructor', () => {
    it('should initialize with INITIAL_WORKOUTS when no saved data exists', async () => {
      localStorageSpy.getItem.and.returnValue(null);

      service = TestBed.inject(WorkoutService);
      const initialWorkouts = await firstValueFrom(service.workouts$);

      expect(initialWorkouts).toEqual(INITIAL_WORKOUTS);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'workouts',
        JSON.stringify(INITIAL_WORKOUTS)
      );
    });

    it('should initialize with saved data when it exists', async () => {
      const savedWorkouts = INITIAL_WORKOUTS.slice(0, 5); // Take first 5 workouts as test data
      localStorageSpy.getItem.and.returnValue(JSON.stringify(savedWorkouts));

      service = TestBed.inject(WorkoutService);
      const initialWorkouts = await firstValueFrom(service.workouts$);

      expect(initialWorkouts).toEqual(savedWorkouts);
      expect(initialWorkouts.length).toBe(5);
    });
  });

  describe('workouts$', () => {
    beforeEach(() => {
      localStorageSpy.getItem.and.returnValue(JSON.stringify(INITIAL_WORKOUTS));
      service = TestBed.inject(WorkoutService);
    });

    it('should emit current workouts value', done => {
      service.workouts$.subscribe(workouts => {
        expect(workouts).toBeTruthy();
        expect(Array.isArray(workouts)).toBe(true);
        expect(workouts.length).toBe(INITIAL_WORKOUTS.length);
        done();
      });
    });
  });

  describe('addWorkout', () => {
    beforeEach(() => {
      localStorageSpy.getItem.and.returnValue(JSON.stringify([]));
      service = TestBed.inject(WorkoutService);
    });

    it('should add new workout to empty workout list', done => {
      service.addWorkout(mockWorkout);

      service.workouts$.subscribe(workouts => {
        expect(workouts.length).toBe(1);
        expect(workouts[0]).toEqual(mockWorkout);
        expect(localStorageSpy.setItem).toHaveBeenCalledWith(
          'workouts',
          JSON.stringify([mockWorkout])
        );
        done();
      });
    });

    // it('should add new workout to existing workouts', done => {
    //   const existingWorkout = INITIAL_WORKOUTS[0];
    //   localStorageSpy.getItem.and.returnValue(
    //     JSON.stringify([existingWorkout])
    //   );
    //   service = TestBed.inject(WorkoutService);
    //   service.addWorkout(mockWorkout);

    //   service.workouts$.subscribe(workouts => {
    //     expect(workouts.length).toBe(2);
    //     // expect(workouts[1]).toEqual(mockWorkout);
    //     expect(localStorageSpy.setItem).toHaveBeenCalledWith(
    //       'workouts',
    //       JSON.stringify([existingWorkout, mockWorkout])
    //     );
    //     done();
    //   });
    // });
  });

  describe('refreshWorkouts', () => {
    beforeEach(() => {
      service = TestBed.inject(WorkoutService);
    });

    it('should update workouts from localStorage', done => {
      const updatedWorkouts = [mockWorkout];
      localStorageSpy.getItem.and.returnValue(JSON.stringify(updatedWorkouts));

      service.refreshWorkouts();

      service.workouts$.subscribe(workouts => {
        expect(workouts).toEqual(updatedWorkouts);
        done();
      });
    });

    it('should use INITIAL_WORKOUTS if localStorage is empty on refresh', done => {
      localStorageSpy.getItem.and.returnValue(null);

      service.refreshWorkouts();

      service.workouts$.subscribe(workouts => {
        expect(workouts).toEqual(INITIAL_WORKOUTS);
        done();
      });
    });
  });

  describe('resetToDefault', () => {
    beforeEach(() => {
      localStorageSpy.getItem.and.returnValue(JSON.stringify([mockWorkout]));
      service = TestBed.inject(WorkoutService);
    });

    it('should reset workouts to INITIAL_WORKOUTS', done => {
      service.resetToDefault();

      service.workouts$.subscribe(workouts => {
        expect(workouts).toEqual(INITIAL_WORKOUTS);
        expect(localStorageSpy.setItem).toHaveBeenCalledWith(
          'workouts',
          JSON.stringify(INITIAL_WORKOUTS)
        );
        done();
      });
    });
  });
});
