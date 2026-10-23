/**
 * Dealership Configuration
 * Edit this single file to rebrand or relocate the entire dealership.
 */

export interface DealershipConfig {
  name: string;
  tagline: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  supportPhone: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  social: {
    instagram: string;
    twitter: string;
    youtube: string;
    facebook: string;
  };
  pricing: {
    currency: string;
    currencySymbol: string;
    taxRate: number; // 8.25% in Texas
    docFee: number; // $150
    reservationDeposit: number; // $500 refundable deposit
    defaultApr: number; // 5.9% default APR
    defaultTermMonths: number; // 60 months
  };
  addons: {
    id: string;
    name: string;
    description: string;
    price: number;
    recommended?: boolean;
  }[];
  guarantees: {
    returnDays: number;
    returnMiles: number;
    inspectionPoints: number;
    warrantyMonths: number;
  };
  demoAdmin: {
    email: string;
    defaultPass: string;
  };
}

export const DEALERSHIP: DealershipConfig = {
  name: "Apex Motor Co.",
  tagline: "Pre-owned. Fully trusted.",
  location: "Dallas, Texas, USA",
  address: "4500 W Airport Fwy",
  city: "Dallas",
  state: "TX",
  zip: "75261",
  country: "USA",
  phone: "(214) 833-2800",
  supportPhone: "(800) 555-APEX",
  email: "concierge@apexmotor.com",
  hours: {
    weekdays: "9:00 AM – 7:00 PM CST",
    saturday: "9:00 AM – 6:00 PM CST",
    sunday: "Closed for inventory reconditioning",
  },
  social: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    facebook: "https://facebook.com",
  },
  pricing: {
    currency: "USD",
    currencySymbol: "$",
    taxRate: 0.0825, // 8.25% Texas State & Local Sales Tax
    docFee: 150, // Standard dealer documentation fee
    reservationDeposit: 500, // $500 refundable deposit
    defaultApr: 5.99,
    defaultTermMonths: 60,
  },
  addons: [
    {
      id: "warranty",
      name: "Apex Care Extended Powertrain (36mo/36,000mi)",
      description: "Comprehensive coverage for engine, transmission, turbochargers, and electrical control units. $0 deductible at any certified shop.",
      price: 1495,
      recommended: true,
    },
    {
      id: "paint-protection",
      name: "Ceramic Pro 9H Coating & Paint Protection",
      description: "Nano-ceramic multi-layer coating with hydrophobic UV shield, 3-year gloss guarantee, and road debris defense.",
      price: 699,
    },
    {
      id: "all-weather-mats",
      name: "OEM Fitted All-Weather Liners",
      description: "Laser-measured deep-dish floor mats and cargo area liner designed specifically for this chassis.",
      price: 189,
    },
    {
      id: "home-delivery",
      name: "White-Glove Flatbed Delivery (DFW Metro)",
      description: "Direct to your driveway within 100 miles of Dallas showroom, including full orientation and notary title signing.",
      price: 299,
    },
  ],
  guarantees: {
    returnDays: 7,
    returnMiles: 250,
    inspectionPoints: 150,
    warrantyMonths: 3,
  },
  demoAdmin: {
    email: "admin@apexmotor.com",
    defaultPass: "demo1234",
  },
};
