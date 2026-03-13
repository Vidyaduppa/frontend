import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './order-modal.component.html'
})
export class OrderModalComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) selectedStatus = 'Delivered';
  @Output() close = new EventEmitter<void>();
  @Output() selectedStatusChange = new EventEmitter<string>();
  @Output() updateStatus = new EventEmitter<void>();
}
