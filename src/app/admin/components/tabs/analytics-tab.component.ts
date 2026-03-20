import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { AdminAnalyticsResponse } from '../../../services/api.service';

@Component({
  selector: 'app-admin-analytics-tab',
  standalone: true,
  templateUrl: './analytics-tab.component.html'
})
export class AnalyticsTabComponent {
  @Input() analytics: AdminAnalyticsResponse | null = null;
  @Input() activeUsers = 0;
}
