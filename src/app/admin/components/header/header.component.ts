import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input({ required: true }) title = '';
}
