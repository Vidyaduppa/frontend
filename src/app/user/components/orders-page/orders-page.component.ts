import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Order } from '../../../services/store.models';

@Component({
  selector: 'app-orders-page',
  imports: [DatePipe],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss'
})
export class OrdersPageComponent {
  @Input() orders: Order[] = [];
}
