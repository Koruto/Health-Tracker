import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mood-donut',
  imports: [],
  templateUrl: './mood-donut.component.html',
  styleUrl: './mood-donut.component.scss',
})
export class MoodDonutComponent {
  @Input() value: number = 0;

  private getColors(): { ring: string; text: string } {
    switch (this.value) {
      case 1:
        return {
          ring: 'rgb(239, 68, 68)', // Bright red
          text: 'rgb(185, 28, 28)',
        };
      case 2:
        return {
          ring: 'rgb(251, 146, 60)', // Orange
          text: 'rgb(194, 65, 12)',
        };
      case 3:
        return {
          ring: 'rgb(250, 204, 21)', // Yellow
          text: 'rgb(161, 98, 7)',
        };
      case 4:
        return {
          ring: 'rgb(132, 204, 22)', // Light green
          text: 'rgb(63, 98, 18)',
        };
      case 5:
        return {
          ring: 'rgb(34, 197, 94)', // Vibrant green
          text: 'rgb(21, 128, 61)',
        };
      default:
        return {
          ring: 'rgb(209, 213, 219)',
          text: 'rgb(107, 114, 128)',
        };
    }
  }

  getRingColor(): string {
    return this.getColors().ring;
  }

  getTextColor(): string {
    return this.getColors().text;
  }

  getDashArray(): string {
    const percentage = (this.value / 5) * 100;
    return `${percentage}, 100`;
  }
}
