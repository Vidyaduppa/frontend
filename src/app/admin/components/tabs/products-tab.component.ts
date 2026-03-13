import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminProduct } from '../admin-dashboard/admin.models';

@Component({
  selector: 'app-admin-products-tab',
  standalone: true,
  imports: [],
  templateUrl: './products-tab.component.html'
})
export class ProductsTabComponent {
  @Input({ required: true }) products: AdminProduct[] = [];
  @Output() addProduct = new EventEmitter<void>();
  @Output() deleteProduct = new EventEmitter<string>();
}
