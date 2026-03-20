import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Order, Product } from '../../../services/store.models';

@Component({
  selector: 'app-orders-page',
  imports: [DatePipe],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss'
})
export class OrdersPageComponent {
  @Input() orders: Order[] = [];
  @Input() productById: (id: string) => Product | undefined = () => undefined;

  private readonly expanded = new Set<string>();

  isExpanded(orderId: string): boolean {
    return this.expanded.has(orderId);
  }

  toggle(orderId: string): void {
    if (this.expanded.has(orderId)) this.expanded.delete(orderId);
    else this.expanded.add(orderId);
  }
}
