import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedbackItem } from '../../../services/store.models';

@Component({
  selector: 'app-admin-feedback-tab',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './feedback-tab.component.html'
})
export class FeedbackTabComponent {
  @Input() feedback: FeedbackItem[] = [];
}
