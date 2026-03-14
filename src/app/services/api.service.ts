import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CartItem,
  FeedbackItem,
  Order,
  Product,
  ProductPageResponse,
  ProductQuery,
  UserProfile
} from './store.models';

export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

// Some backends require OTP for admins and will not issue tokens until OTP verification.
// Keep this flexible so the frontend can handle either flow.
export type AuthLoginResponse =
  | AuthResponse
  | {
      otpRequired: true;
      user: AuthResponse['user'];
    };

export interface AdminOtpRequestResponse {
  ok: true;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  category: Product['category'];
  description: string;
  featured?: boolean;
  imageUrl?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface CreateOrderRequest {
  items: CartItem[];
  shipping: UserProfile;
  paymentMethod: 'card' | 'paypal' | 'apple';
}

export interface UpdateOrderStatusRequest {
  status: 'Processing' | 'In Transit' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface UpdateUserStatusRequest {
  status: 'active' | 'blocked';
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked';
  orders: number;
  joinedAt: string;
}

export interface AdminAnalyticsResponse {
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  averageRating: number;
  topProducts: Array<{ name: string; sales: number }>;
  revenueByCategory: Array<{ category: string; amount: number }>;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
private readonly apiBase = 'http://localhost:3000/api';
  private readonly endpoints = {
    auth: {
      register: `${this.apiBase}/auth/register`,
      login: `${this.apiBase}/auth/login`,
      logout: `${this.apiBase}/auth/logout`,
      me: `${this.apiBase}/auth/me`
    },
    products: `${this.apiBase}/products`,
    orders: `${this.apiBase}/orders`,
    feedback: `${this.apiBase}/feedback`,
    users: `${this.apiBase}/users`,
    analytics: `${this.apiBase}/admin/analytics`,
    adminOtpRequest: `${this.apiBase}/admin/otp/request`,
    adminOtpVerify: `${this.apiBase}/admin/otp/verify`,
    userProfile: `${this.apiBase}/user/profile`
  } as const;

  constructor(private http: HttpClient) {}

  // POST /api/auth/register
  // Public endpoint to create a new user account (role defaults to user).
  register(payload: AuthRegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.endpoints.auth.register, payload);
  }

  // POST /api/auth/login
  // Public endpoint to login with email/password and receive tokens + role.
  login(payload: AuthLoginRequest): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(this.endpoints.auth.login, payload);
  }

  // POST /api/admin/otp/request
  // Admin OTP endpoint: always returns { ok: true } to avoid revealing account existence.
  requestAdminOtp(email: string): Observable<AdminOtpRequestResponse> {
    return this.http.post<AdminOtpRequestResponse>(this.endpoints.adminOtpRequest, { email });
  }

  // POST /api/admin/otp/verify
  // Admin OTP endpoint: returns AuthResponse on success.
  verifyAdminOtp(payload: { email: string; otp: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.endpoints.adminOtpVerify, payload);
  }

  // POST /api/auth/logout
  // Authenticated endpoint to invalidate current user session/token.
  logout(): Observable<void> {
    return this.http.post<void>(this.endpoints.auth.logout, {});
  }

  // GET /api/auth/me
  // Authenticated endpoint to fetch current user identity and role.
  getCurrentUser(): Observable<AuthResponse['user']> {
    return this.http.get<AuthResponse['user']>(this.endpoints.auth.me);
  }

  // GET /api/products
  // Public/User/Admin endpoint to fetch product catalog with filters/sorting.
  getProducts(query: ProductQuery): Observable<Product[]> {
    const params = this.buildProductParams(query);
    return this.http
      .get<Product[] | ProductPageResponse>(this.endpoints.products, { params })
      .pipe(map((response) => (Array.isArray(response) ? response : response.items)));
  }

  // POST /api/products
  // Admin endpoint to create a new product.
  createProduct(payload: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.endpoints.products, payload);
  }

  // PUT /api/products/:id
  // Admin endpoint to update product fields.
  updateProduct(productId: string, payload: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.endpoints.products}/${productId}`, payload);
  }

  // DELETE /api/products/:id
  // Admin endpoint to delete a product.
  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoints.products}/${productId}`);
  }

  // GET /api/orders
  // User gets own orders; Admin gets all orders.
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.endpoints.orders);
  }

  // POST /api/orders
  // User endpoint to place a new order.
  createOrder(payload: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.endpoints.orders, payload);
  }

  // PATCH /api/orders/:id/status
  // Admin endpoint to update order status.
  updateOrderStatus(orderId: string, payload: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.patch<Order>(`${this.endpoints.orders}/${orderId}/status`, payload);
  }

  // GET /api/feedback
  // User/Admin endpoint to list feedback entries.
  getFeedback(): Observable<FeedbackItem[]> {
    return this.http.get<FeedbackItem[]>(this.endpoints.feedback);
  }

  // POST /api/feedback
  // User endpoint to submit feedback.
  submitFeedback(payload: Pick<FeedbackItem, 'rating' | 'category' | 'text'>): Observable<FeedbackItem> {
    return this.http.post<FeedbackItem>(this.endpoints.feedback, payload);
  }

  // GET /api/users
  // Admin endpoint to list registered users and status summary.
  getUsers(): Observable<AdminUserSummary[]> {
    return this.http.get<AdminUserSummary[]>(this.endpoints.users);
  }

  // PATCH /api/users/:id/status
  // Admin endpoint to activate/block a user account.
  updateUserStatus(userId: string, payload: UpdateUserStatusRequest): Observable<AdminUserSummary> {
    return this.http.patch<AdminUserSummary>(`${this.endpoints.users}/${userId}/status`, payload);
  }

  // GET /api/admin/analytics
  // Admin endpoint to fetch dashboard metrics and reports.
  getAdminAnalytics(): Observable<AdminAnalyticsResponse> {
    return this.http.get<AdminAnalyticsResponse>(this.endpoints.analytics);
  }

  // GET /api/user/profile
  // Authenticated endpoint to fetch current user's profile.
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.endpoints.userProfile);
  }

  // PUT /api/user/profile
  // Authenticated endpoint to update current user's profile data.
  updateUserProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.endpoints.userProfile, profile);
  }

  private buildProductParams(query: ProductQuery): HttpParams {
    let params = new HttpParams();
    const term = query.searchTerm.trim();

    if (term) params = params.set('q', term);
    if (query.category !== 'all') params = params.set('category', query.category);
    if (query.price !== 'all') params = params.set('price', query.price);

    return params.set('sortBy', query.sortBy);
  }
}
