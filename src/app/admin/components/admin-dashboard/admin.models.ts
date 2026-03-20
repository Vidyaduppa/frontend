export type AdminTab = 'dashboard' | 'products' | 'orders' | 'users' | 'feedback' | 'analytics';

export interface AdminTabItem {
  key: AdminTab;
  label: string;
  icon: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  categoryValue: 'raw' | 'organic' | 'infused' | 'specialty';
  price: string;
  priceValue: number;
  stock: number;
  imageUrl?: string;
}

export interface NewAdminProduct {
  id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
}
