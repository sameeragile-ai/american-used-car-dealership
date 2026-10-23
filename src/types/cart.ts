import { Vehicle } from './vehicle';

export interface CartItem {
  vehicle: Vehicle;
  selectedAddonIds: string[];
  depositAmount: number;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  deliveryPreference: 'pickup' | 'delivery';
  preferredDate?: string;
  notes?: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  createdAt: string;
  status: 'Confirmed' | 'Processing' | 'Completed' | 'Cancelled';
  vehicle: Vehicle;
  selectedAddons: {
    id: string;
    name: string;
    price: number;
  }[];
  pricingSummary: {
    vehiclePrice: number;
    addonsTotal: number;
    salesTax: number;
    docFee: number;
    totalPrice: number;
    depositPaid: number;
    balanceDue: number;
  };
  customer: CustomerDetails;
  paymentDetails: {
    lastFour: string;
    cardBrand: string;
    demoNote: string;
  };
}
