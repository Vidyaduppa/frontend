import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminProduct, NewAdminProduct } from '../admin-dashboard/admin.models';

@Component({
  selector: 'app-admin-product-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-modal.component.html'
})
export class ProductModalComponent {
  @Input({ required: true }) visible = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() initialProduct: AdminProduct | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitProduct = new EventEmitter<NewAdminProduct>();

  readonly maxImageBytes = 2 * 1024 * 1024;
  imageMode: 'url' | 'upload' = 'url';
  imageError = '';

  form = {
    id: '',
    name: '',
    category: 'Premium',
    price: '',
    stock: '',
    imageUrl: ''
  };

  switchImageMode(mode: 'url' | 'upload'): void {
    this.imageMode = mode;
    this.imageError = '';
    if (mode === 'upload') return;
    // If switching back to URL, keep whatever URL is typed and let it win.
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    this.imageError = '';
    if (!file.type.startsWith('image/')) {
      this.imageError = 'Please select an image file.';
      return;
    }
    if (file.size > this.maxImageBytes) {
      this.imageError = 'Image too large. Please use an image under 2MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.form.imageUrl = result;
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (!this.form.name || !this.form.price || !this.form.stock) return;

    const trimmedImageUrl = this.form.imageUrl?.trim() ?? '';
    if (trimmedImageUrl && this.imageMode === 'url') {
      try {
        // Validate URL input if user chose URL mode (data URLs are allowed in upload mode).
        // eslint-disable-next-line no-new
        new URL(trimmedImageUrl);
      } catch {
        this.imageError = 'Please enter a valid image URL.';
        return;
      }
    }

    this.submitProduct.emit({
      id: this.form.id || undefined,
      name: this.form.name,
      category: this.form.category,
      price: Number(this.form.price),
      stock: Number(this.form.stock),
      imageUrl: trimmedImageUrl || undefined
    });
    this.form = { id: '', name: '', category: 'Premium', price: '', stock: '', imageUrl: '' };
    this.imageMode = 'url';
    this.imageError = '';
  }

  ngOnChanges(): void {
    if (!this.visible) return;
    if (this.mode !== 'edit' || !this.initialProduct) {
      this.form = { id: '', name: '', category: 'Premium', price: '', stock: '', imageUrl: '' };
      this.imageMode = 'url';
      this.imageError = '';
      return;
    }

    const categoryLabel = this.categoryLabelFromValue(this.initialProduct.categoryValue);
    this.form = {
      id: this.initialProduct.id,
      name: this.initialProduct.name,
      category: categoryLabel,
      price: String(this.initialProduct.priceValue),
      stock: String(this.initialProduct.stock ?? ''),
      imageUrl: this.initialProduct.imageUrl ?? ''
    };
    this.imageMode = this.form.imageUrl?.startsWith('data:') ? 'upload' : 'url';
    this.imageError = '';
  }

  private categoryLabelFromValue(
    category: AdminProduct['categoryValue'],
  ): 'Premium' | 'Medicinal' | 'Raw/Organic' {
    if (category === 'specialty') return 'Medicinal';
    if (category === 'organic') return 'Raw/Organic';
    return 'Premium';
  }
}
