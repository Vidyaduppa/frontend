import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem, Product } from '../../../services/store.models';

export interface CheckoutFormValue {
  name: string;
  email: string;
  address: string;
  paymentMethod: 'card' | 'paypal' | 'apple';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

@Component({
  selector: 'app-checkout-page',
  imports: [FormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent {
  @Input() subtotal = 0;
  @Input() tax = 0;
  @Input() total = 0;
  @Input() cart: CartItem[] = [];
  @Input() productById: (id: string) => Product | undefined = () => undefined;
  @Input() isPlacingOrder = false;

  @Output() placeOrder = new EventEmitter<CheckoutFormValue>();
  @Output() backToCart = new EventEmitter<void>();

  form: CheckoutFormValue = {
    name: '',
    email: '',
    address: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  };

  error = '';

  formatCardNumber(): void {
    const digits = this.form.cardNumber.replace(/\D/g, '').slice(0, 16);
    this.form.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(): void {
    const digits = this.form.cardExpiry.replace(/\D/g, '').slice(0, 4);
    this.form.cardExpiry = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  submit(): void {
    if (this.isPlacingOrder) return;
    this.error = '';

    const name = this.form.name.trim();
    const email = this.form.email.trim();
    const address = this.form.address.trim();
    if (!name || !email || !address) {
      this.error = 'Please fill in your shipping details.';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }
    if (!this.cart.length) {
      this.error = 'Your cart is empty.';
      return;
    }

    if (this.form.paymentMethod === 'card') {
      const cardDigits = this.form.cardNumber.replace(/\s/g, '');
      if (cardDigits.length !== 16) {
        this.error = 'Please enter a valid 16‑digit card number.';
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(this.form.cardExpiry)) {
        this.error = 'Please enter expiry in MM/YY format.';
        return;
      }
      if (!/^\d{3,4}$/.test(this.form.cardCvc.trim())) {
        this.error = 'Please enter a valid CVC.';
        return;
      }
    }

    this.placeOrder.emit({
      ...this.form,
      name,
      email,
      address
    });
  }
}
