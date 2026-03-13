import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewAdminProduct } from '../admin-dashboard/admin.models';

@Component({
  selector: 'app-admin-product-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-modal.component.html'
})
export class ProductModalComponent {
  @Input({ required: true }) visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() submitProduct = new EventEmitter<NewAdminProduct>();

  form = {
    name: '',
    category: 'Premium',
    price: '',
    stock: ''
  };

  submit(): void {
    if (!this.form.name || !this.form.price || !this.form.stock) return;
    this.submitProduct.emit({
      name: this.form.name,
      category: this.form.category,
      price: Number(this.form.price),
      stock: Number(this.form.stock)
    });
    this.form = { name: '', category: 'Premium', price: '', stock: '' };
  }
}
