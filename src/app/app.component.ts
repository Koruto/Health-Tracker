import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';

import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [SplitterModule, SidebarComponent, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'health-tracker';
}
