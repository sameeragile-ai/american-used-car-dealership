export type StaffRole = 'Admin' | 'Sales Specialist' | 'Inventory Lead' | 'Service Director';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  avatar: string;
  phone: string;
  active: boolean;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'reservation' | 'review' | 'inventory' | 'price_drop' | 'lead';
  title: string;
  description: string;
  badge?: string;
}
