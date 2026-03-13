import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { AdminAnalyticsResponse } from '../../../services/api.service';

@Component({
  selector: 'app-admin-dashboard-tab',
  standalone: true,
  templateUrl: './dashboard-tab.component.html'
})
export class DashboardTabComponent {
  @Input() analytics: AdminAnalyticsResponse | null = null;
}
