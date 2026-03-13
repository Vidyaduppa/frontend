import { Component, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Order } from '../../../services/store.models';

@Component({
  selector: 'app-admin-orders-tab',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders-tab.component.html'
})
export class OrdersTabComponent {
  @Input() orders: Order[] = [];
  @Output() viewOrder = new EventEmitter<string>();
}
