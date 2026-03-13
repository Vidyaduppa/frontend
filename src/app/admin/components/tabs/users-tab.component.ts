import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { AdminUserSummary } from '../../../services/api.service';

@Component({
  selector: 'app-admin-users-tab',
  standalone: true,
  templateUrl: './users-tab.component.html'
})
export class UsersTabComponent {
  @Input() users: AdminUserSummary[] = [];
}
