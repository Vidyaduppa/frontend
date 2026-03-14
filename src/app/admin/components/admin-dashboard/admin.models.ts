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
  price: string;
  stock: number;
}

export interface NewAdminProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
}
