import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminTab, AdminTabItem } from '../admin-dashboard/admin.models';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input({ required: true }) tabs: AdminTabItem[] = [];
  @Input({ required: true }) activeTab!: AdminTab;
  @Output() tabChange = new EventEmitter<AdminTab>();
  @Output() logout = new EventEmitter<void>();
}
