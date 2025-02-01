import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private activeSectionSubject = new BehaviorSubject<string>('workouts');
  activeSection$ = this.activeSectionSubject.asObservable();

  setActiveSection(section: string) {
    console.log('Setting active section:', section); // Debug log
    this.activeSectionSubject.next(section);
  }

  getCurrentSection(): string {
    return this.activeSectionSubject.value;
  }
}
