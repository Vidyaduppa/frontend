import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { ShopPageComponent } from './user/components/shop-page/shop-page.component';
import { CartPageComponent } from './user/components/cart-page/cart-page.component';
import { CheckoutFormValue, CheckoutPageComponent } from './user/components/checkout-page/checkout-page.component';
import { ConfirmationPageComponent } from './user/components/confirmation-page/confirmation-page.component';
import { OrdersPageComponent } from './user/components/orders-page/orders-page.component';
import { ProfilePageComponent, ProfileValue } from './user/components/profile-page/profile-page.component';
import { FeedbackFormValue, FeedbackPageComponent } from './user/components/feedback-page/feedback-page.component';
import { ApiService } from './services/api.service';
import { StoreService } from './services/store.service';
import { CartItem, FeedbackItem, Order, Page, Product, ProductQuery } from './services/store.models';
import { catchError, of } from 'rxjs';

type AuthRole = 'guest' | 'user' | 'admin';
type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-root',
  imports: [
    NgClass,
    FormsModule,
    AdminDashboardComponent,
    ShopPageComponent,
    CartPageComponent,
    CheckoutPageComponent,
    ConfirmationPageComponent,
    OrdersPageComponent,
    ProfilePageComponent,
    FeedbackPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  authMode: AuthMode = 'login';
  authRole: AuthRole = 'guest';

  loginForm = { email: '', password: '' };
  registerForm = { name: '', email: '', password: '', confirmPassword: '' };
  authError = '';

  page: Page = 'shop';
  query: ProductQuery = {
    searchTerm: '',
    category: 'all',
    price: 'all',
    sortBy: 'featured'
  };

  toast = '';
  toastType: 'success' | 'error' = 'success';

  profile = { name: '', email: '', address: '' };
  lastOrderId = '';

  products: Product[] = [];
  cart: CartItem[] = [];
  orders: Order[] = [];
  feedbackList: FeedbackItem[] = [];

  constructor(
    private storeService: StoreService,
    private apiService: ApiService
  ) {
    this.storeService.products$.subscribe((items) => (this.products = items));
    this.storeService.cart$.subscribe((items) => (this.cart = items));
    this.storeService.orders$.subscribe((items) => (this.orders = items));
    this.storeService.feedback$.subscribe((items) => (this.feedbackList = items));
    this.storeService.profile$.subscribe((profile) => (this.profile = profile));
    this.storeService.loadProducts(this.query);
  }

  get cartCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get subtotal(): number {
    return this.cart.reduce((sum, item) => {
      const product = this.productById(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  get tax(): number {
    return this.subtotal * 0.08;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  get isAuthenticated(): boolean {
    return this.authRole !== 'guest';
  }

  switchAuthMode(mode: AuthMode): void {
    this.authMode = mode;
    this.authError = '';
  }

  register(): void {
    const name = this.registerForm.name.trim();
    const email = this.registerForm.email.trim().toLowerCase();
    const { password, confirmPassword } = this.registerForm;

    if (!name || !email || !password) {
      this.authError = 'Please fill all required fields.';
      return;
    }
    if (password.length < 6) {
      this.authError = 'Password must be at least 6 characters.';
      return;
    }
    if (password !== confirmPassword) {
      this.authError = 'Passwords do not match.';
      return;
    }

    this.apiService
      .register({ name, email, password })
      .pipe(catchError(() => of(null)))
      .subscribe((response) => {
        if (!response) {
          this.authError = 'Registration failed. Please try again.';
          return;
        }
        this.loginForm.email = email;
        this.loginForm.password = '';
        this.registerForm = { name: '', email: '', password: '', confirmPassword: '' };
        this.authMode = 'login';
        this.authError = 'Registration successful. Please login.';
      });
  }

  login(): void {
    const email = this.loginForm.email.trim().toLowerCase();
    const password = this.loginForm.password;

    this.apiService
      .login({ email, password })
      .pipe(catchError(() => of(null)))
      .subscribe((response) => {
        if (!response) {
          this.authError = 'Invalid email or password.';
          return;
        }
        this.authRole = response.user.role;
        this.authError = '';
        this.loginForm = { email: '', password: '' };
        this.page = 'shop';
        this.storeService.loadOrders();
        this.storeService.loadFeedback();
      });
  }

  logout(): void {
    this.apiService
      .logout()
      .pipe(catchError(() => of(void 0)))
      .subscribe(() => {
        this.authRole = 'guest';
        this.authMode = 'login';
        this.authError = '';
      });
  }

  onQueryChange(query: ProductQuery): void {
    this.query = query;
    this.storeService.loadProducts(query);
  }

  onSearchTermChange(term: string): void {
    this.onQueryChange({ ...this.query, searchTerm: term });
  }

  navigateTo(page: Page): void {
    this.page = page;
  }

  addToCart(productId: string): void {
    this.storeService.addToCart(productId);
    this.showToast('Added to cart!', 'success');
  }

  updateCartQuantity(productId: string, change: number): void {
    this.storeService.updateCartQuantity(productId, change);
  }

  removeFromCart(productId: string): void {
    this.storeService.removeFromCart(productId);
  }

  placeOrder(details: CheckoutFormValue): void {
    if (!details.name || !details.email || !details.address) {
      this.showToast('Please fill shipping details', 'error');
      return;
    }
    if (details.paymentMethod === 'card') {
      if (
        details.cardNumber.replace(/\s/g, '').length !== 16 ||
        details.cardExpiry.length !== 5 ||
        details.cardCvc.length < 3
      ) {
        this.showToast('Please enter valid card details', 'error');
        return;
      }
    }

    this.apiService
      .createOrder({
        items: this.cart.map((item) => ({ ...item })),
        shipping: {
          name: details.name,
          email: details.email,
          address: details.address
        },
        paymentMethod: details.paymentMethod
      })
      .pipe(catchError(() => of(null)))
      .subscribe((createdOrder) => {
        if (!createdOrder) {
          this.showToast('Could not place order. Try again.', 'error');
          return;
        }
        this.storeService.loadOrders();
        this.lastOrderId = `${createdOrder.id} | Total: $${createdOrder.total.toFixed(2)}`;
        this.storeService.clearCart();
        this.navigateTo('confirmation');
      });
  }

  saveProfile(profile: ProfileValue): void {
    this.profile = profile;
    this.storeService.saveProfile(profile);
    this.showToast('Profile saved!', 'success');
  }

  submitFeedback(feedback: FeedbackFormValue): void {
    if (!feedback.rating || !feedback.category || !feedback.text.trim()) {
      this.showToast('Please complete feedback form', 'error');
      return;
    }

    this.storeService.submitFeedback({
      rating: feedback.rating,
      category: feedback.category,
      text: feedback.text.trim()
    });
    this.showToast('Thank you for your feedback!', 'success');
  }

  productById(id: string): Product | undefined {
    return this.storeService.getProductById(id);
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = message;
    this.toastType = type;
    setTimeout(() => {
      if (this.toast === message) this.toast = '';
    }, 2500);
  }
}
