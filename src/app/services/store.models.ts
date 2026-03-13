export type Page = 'shop' | 'cart' | 'checkout' | 'confirmation' | 'orders' | 'profile' | 'feedback';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'raw' | 'organic' | 'infused' | 'specialty';
  rating: number;
  description: string;
  featured: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
}

export interface FeedbackItem {
  rating: number;
  category: string;
  text: string;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  address: string;
}

export interface ProductQuery {
  searchTerm: string;
  category: 'all' | Product['category'];
  price: 'all' | 'under15' | '15to25' | 'over25';
  sortBy: 'featured' | 'price-low' | 'price-high' | 'name' | 'rating';
}

export interface ProductPageResponse {
  items: Product[];
  pageInfo?: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}
