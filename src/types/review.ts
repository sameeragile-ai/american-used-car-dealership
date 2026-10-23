export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  vehicleId?: string; // Optional vehicle specific review
  vehicleName?: string; // e.g. "2022 Porsche Macan GTS"
  customerName: string; // e.g. "Marcus T."
  location: string; // e.g. "Plano, TX"
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  salesperson?: string;
  adminReply?: {
    message: string;
    repliedAt: string;
    author: string;
  };
}
