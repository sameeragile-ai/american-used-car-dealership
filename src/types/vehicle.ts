export type BodyType = 'SUV' | 'Sedan' | 'Truck' | 'Coupe' | 'EV' | 'Luxury';
export type FuelType = 'Gasoline' | 'Hybrid' | 'Electric' | 'Plug-in Hybrid' | 'Diesel';
export type Transmission = 'Automatic' | 'Manual' | 'Dual-Clutch' | 'Single-Speed Fixed';
export type Drivetrain = 'AWD' | 'FWD' | 'RWD' | '4WD';
export type VehicleStatus = 'Available' | 'Reserved' | 'Sold';

export interface VehicleHistory {
  owners: number;
  accidents: number;
  serviceRecords: number;
  cleanTitle: boolean;
  lastServiceDate?: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  price: number;
  mileage: number;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  drivetrain: Drivetrain;
  engine: string;
  horsepower: number;
  mpgCity: number;
  mpgHwy: number;
  exteriorColor: string;
  exteriorColorHex: string;
  interiorColor: string;
  vin: string;
  stockNumber: string;
  features: string[];
  history: VehicleHistory;
  certified: boolean;
  featured: boolean;
  status: VehicleStatus;
  images: string[];
  dateAdded: string;
  rating?: number;
  reviewCount?: number;
}

export interface FilterState {
  make: string;
  model: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  minYear: number;
  maxYear: number;
  minPrice: number;
  maxPrice: number;
  minMileage: number;
  maxMileage: number;
  certifiedOnly: boolean;
  features: string[];
  color: string;
  search: string;
  sort: 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc' | 'rating-desc';
  viewMode: 'grid' | 'list';
}
