import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { OrderModalComponent } from '../modals/order-modal.component';
import { ProductModalComponent } from '../modals/product-modal.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AnalyticsTabComponent } from '../tabs/analytics-tab.component';
import { DashboardTabComponent } from '../tabs/dashboard-tab.component';
import { FeedbackTabComponent } from '../tabs/feedback-tab.component';
import { OrdersTabComponent } from '../tabs/orders-tab.component';
import { ProductsTabComponent } from '../tabs/products-tab.component';
import { UsersTabComponent } from '../tabs/users-tab.component';
import { AdminProduct, AdminTab, AdminTabItem, NewAdminProduct } from './admin.models';
import { ApiService, AdminAnalyticsResponse, AdminUserSummary } from '../../../services/api.service';
import { FeedbackItem, Order, ProductQuery } from '../../../services/store.models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    OrderModalComponent,
    ProductModalComponent,
    SidebarComponent,
    AnalyticsTabComponent,
    DashboardTabComponent,
    FeedbackTabComponent,
    OrdersTabComponent,
    ProductsTabComponent,
    UsersTabComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {
  @Output() logout = new EventEmitter<void>();

  activeTab: AdminTab = 'dashboard';
  showProductModal = false;
  showOrderModal = false;
  selectedOrderStatus = 'Delivered';
  selectedOrderId = '';
  toastMessage = '';
  editingProduct: AdminProduct | null = null;

  readonly tabs: AdminTabItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { key: 'products', label: 'Products', icon: 'Products' },
    { key: 'orders', label: 'Orders', icon: 'Orders' },
    { key: 'users', label: 'Users', icon: 'Users' },
    { key: 'feedback', label: 'Feedback', icon: 'Feedback' },
    { key: 'analytics', label: 'Analytics', icon: 'Analytics' }
  ];

  products: AdminProduct[] = [];
  orders: Order[] = [];
  users: AdminUserSummary[] = [];
  feedbackList: FeedbackItem[] = [];
  analytics: AdminAnalyticsResponse | null = null;
  readonly adminCredentials = {
    email: 'admin@shop.local',
    password: 'Admin@123'
  };

  private readonly defaultProductQuery: ProductQuery = {
    searchTerm: '',
    category: 'all',
    price: 'all',
    sortBy: 'featured'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  switchTab(tab: AdminTab): void {
    this.activeTab = tab;
  }

  openProductModal(): void {
    this.editingProduct = null;
    this.showProductModal = true;
  }

  openEditProductModal(product: AdminProduct): void {
    this.editingProduct = product;
    this.showProductModal = true;
  }

  openOrderModal(orderId: string): void {
    this.selectedOrderId = orderId;
    this.showOrderModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.editingProduct = null;
  }

  closeOrderModal(): void {
    this.showOrderModal = false;
  }

  handleProductSubmit(newProduct: NewAdminProduct): void {
    const mappedCategory = this.mapCategory(newProduct.category);
    const request$ = newProduct.id
      ? this.apiService.updateProduct(newProduct.id, {
          name: newProduct.name,
          category: mappedCategory,
          price: newProduct.price,
          imageUrl: newProduct.imageUrl,
          stock: newProduct.stock
        })
      : this.apiService.createProduct({
          name: newProduct.name,
          category: mappedCategory,
          description: newProduct.name,
          price: newProduct.price,
          featured: false,
          imageUrl: newProduct.imageUrl,
          stock: newProduct.stock
        });

    request$
      .pipe(catchError(() => of(null)))
      .subscribe((result) => {
        if (!result) {
          this.showToast(newProduct.id ? 'Failed to update product' : 'Failed to add product');
          return;
        }
        this.loadProducts();
        this.closeProductModal();
        this.showToast(newProduct.id ? 'Product updated successfully!' : 'Product added successfully!');
      });
  }

  handleOrderUpdate(): void {
    if (!this.selectedOrderId) return;
    this.apiService
      .updateOrderStatus(this.selectedOrderId, {
        status: this.selectedOrderStatus as 'Processing' | 'In Transit' | 'Shipped' | 'Delivered' | 'Cancelled'
      })
      .pipe(catchError(() => of(null)))
      .subscribe((updatedOrder) => {
        if (!updatedOrder) {
          this.showToast('Failed to update order status');
          return;
        }
        this.loadOrders();
        this.closeOrderModal();
        this.showToast(`Order status updated to: ${this.selectedOrderStatus}`);
      });
  }

  deleteProduct(productId: string): void {
    this.apiService
      .deleteProduct(productId)
      .pipe(catchError(() => of(null)))
      .subscribe((result) => {
        if (result === null) {
          this.showToast('Failed to delete product');
          return;
        }
        this.products = this.products.filter((product) => product.id !== productId);
        this.showToast('Product deleted successfully!');
      });
  }

  get pageTitle(): string {
    const titles: Record<AdminTab, string> = {
      dashboard: 'Admin Dashboard',
      products: 'Product Management',
      orders: 'Order Management',
      users: 'User Management',
      feedback: 'Customer Feedback',
      analytics: 'Analytics & Reports'
    };
    return titles[this.activeTab];
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      if (this.toastMessage === message) this.toastMessage = '';
    }, 2500);
  }

  private loadDashboardData(): void {
    this.loadProducts();
    this.loadOrders();
    this.loadUsers();
    this.loadFeedback();
    this.loadAnalytics();
  }

  private loadProducts(): void {
    this.apiService
      .getProducts(this.defaultProductQuery)
      .pipe(catchError(() => of([])))
      .subscribe((products) => {
        this.products = products.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          categoryValue: product.category,
          price: `₹${product.price.toFixed(2)}`,
          priceValue: product.price,
          stock: product.stock ?? 0,
          imageUrl: product.imageUrl
        }));
      });
  }

  private loadOrders(): void {
    this.apiService
      .getOrders()
      .pipe(catchError(() => of([])))
      .subscribe((orders) => (this.orders = orders));
  }

  private loadUsers(): void {
    this.apiService
      .getUsers()
      .pipe(catchError(() => of([])))
      .subscribe((users) => (this.users = users));
  }

  get activeNonAdminUsers(): number {
    return this.users.filter((user) => {
      if (user.status !== 'active') return false;
      if (user.role === 'admin') return false;
      if (user.email?.toLowerCase() === this.adminCredentials.email.toLowerCase()) return false;
      return true;
    }).length;
  }

  private loadFeedback(): void {
    this.apiService
      .getFeedback()
      .pipe(catchError(() => of([])))
      .subscribe((feedback) => (this.feedbackList = feedback));
  }

  private loadAnalytics(): void {
    this.apiService
      .getAdminAnalytics()
      .pipe(catchError(() => of(null)))
      .subscribe((analytics) => (this.analytics = analytics));
  }

  private mapCategory(category: string): 'raw' | 'organic' | 'infused' | 'specialty' {
    if (category === 'Medicinal') return 'specialty';
    if (category === 'Raw/Organic') return 'organic';
    return 'raw';
  }

  get productModalMode(): 'add' | 'edit' {
    return this.editingProduct ? 'edit' : 'add';
  }
}
