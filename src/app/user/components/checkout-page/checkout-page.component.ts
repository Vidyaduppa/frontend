import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  @Output() placeOrder = new EventEmitter<CheckoutFormValue>();

  form: CheckoutFormValue = {
    name: '',
    email: '',
    address: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  };

  formatCardNumber(): void {
    const digits = this.form.cardNumber.replace(/\D/g, '').slice(0, 16);
    this.form.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(): void {
    const digits = this.form.cardExpiry.replace(/\D/g, '').slice(0, 4);
    this.form.cardExpiry = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }
}
