import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { CartItem, FeedbackItem, Order, Product, ProductQuery, UserProfile } from './store.models';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly defaultQuery: ProductQuery = {
    searchTerm: '',
    category: 'all',
    price: 'all',
    sortBy: 'featured'
  };

  private readonly querySubject = new BehaviorSubject<ProductQuery>(this.defaultQuery);
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly cartSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly ordersSubject = new BehaviorSubject<Order[]>([]);
  private readonly feedbackSubject = new BehaviorSubject<FeedbackItem[]>([]);
  private readonly profileSubject = new BehaviorSubject<UserProfile>({
    name: '',
    email: '',
    address: ''
  });

  readonly query$ = this.querySubject.asObservable();
  readonly products$ = this.productsSubject.asObservable();
  readonly cart$ = this.cartSubject.asObservable();
  readonly orders$ = this.ordersSubject.asObservable();
  readonly feedback$ = this.feedbackSubject.asObservable();
  readonly profile$ = this.profileSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadProducts(this.defaultQuery);
    this.loadUserProfile();
    this.loadOrders();
    this.loadFeedback();
  }

  loadProducts(query: ProductQuery): void {
    this.querySubject.next(query);
    this.apiService
      .getProducts(query)
      .pipe(catchError(() => of([])))
      .subscribe((products) => {
        this.productsSubject.next(products);
      });
  }

  addToCart(productId: string): void {
    const cart = [...this.cartSubject.value];
    const existing = cart.find((item) => item.productId === productId);
    if (existing) existing.quantity += 1;
    else cart.push({ productId, quantity: 1 });
    this.cartSubject.next(cart);
  }

  updateCartQuantity(productId: string, change: number): void {
    const next = this.cartSubject.value
      .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + change } : item))
      .filter((item) => item.quantity > 0);
    this.cartSubject.next(next);
  }

  removeFromCart(productId: string): void {
    this.cartSubject.next(this.cartSubject.value.filter((item) => item.productId !== productId));
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }

  loadOrders(): void {
    this.apiService
      .getOrders()
      .pipe(catchError(() => of([])))
      .subscribe((orders) => this.ordersSubject.next(orders));
  }

  loadFeedback(): void {
    this.apiService
      .getFeedback()
      .pipe(catchError(() => of([])))
      .subscribe((feedback) => this.feedbackSubject.next(feedback));
  }

  submitFeedback(feedback: Pick<FeedbackItem, 'rating' | 'category' | 'text'>): void {
    this.apiService
      .submitFeedback(feedback)
      .pipe(catchError(() => of({ ...feedback, date: new Date().toISOString() } as FeedbackItem)))
      .subscribe((savedFeedback) => this.feedbackSubject.next([savedFeedback, ...this.feedbackSubject.value]));
  }

  saveProfile(profile: UserProfile): void {
    this.apiService
      .updateUserProfile(profile)
      .pipe(catchError(() => of(profile)))
      .subscribe((savedProfile) => this.profileSubject.next(savedProfile));
  }

  getProductById(id: string): Product | undefined {
    return this.productsSubject.value.find((product) => product.id === id);
  }

  private loadUserProfile(): void {
    this.apiService
      .getUserProfile()
      .pipe(catchError(() => of(this.profileSubject.value)))
      .subscribe((profile) => this.profileSubject.next(profile));
  }
}
