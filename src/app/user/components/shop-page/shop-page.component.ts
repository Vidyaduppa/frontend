import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductQuery } from '../../../services/store.models';

@Component({
  selector: 'app-shop-page',
  imports: [UpperCasePipe, FormsModule],
  templateUrl: './shop-page.component.html',
  styleUrl: './shop-page.component.scss'
})
export class ShopPageComponent {
  @Input() products: Product[] = [];
  @Input() query: ProductQuery = {
    searchTerm: '',
    category: 'all',
    price: 'all',
    sortBy: 'featured'
  };
  @Output() queryChange = new EventEmitter<ProductQuery>();
  @Output() addToCart = new EventEmitter<string>();

  private readonly brokenImageIds = new Set<string>();

  update<K extends keyof ProductQuery>(key: K, value: ProductQuery[K]): void {
    this.queryChange.emit({ ...this.query, [key]: value });
  }

  shouldShowImage(product: Product): boolean {
    return Boolean(product.imageUrl) && !this.brokenImageIds.has(product.id);
  }

  onProductImageError(productId: string): void {
    this.brokenImageIds.add(productId);
  }
}
