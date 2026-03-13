import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem, Product } from '../../../services/store.models';

@Component({
  selector: 'app-cart-page',
  imports: [],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  @Input() cart: CartItem[] = [];
  @Input() subtotal = 0;
  @Input() productById: (id: string) => Product | undefined = () => undefined;

  @Output() quantityChange = new EventEmitter<{ productId: string; change: number }>();
  @Output() removeItem = new EventEmitter<string>();
  @Output() proceedCheckout = new EventEmitter<void>();
}
