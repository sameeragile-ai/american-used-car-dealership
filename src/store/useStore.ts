import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Vehicle, VehicleStatus } from '../types/vehicle';
import { Review } from '../types/review';
import { BlogPost } from '../types/blog';
import { CartItem, Reservation } from '../types/cart';
import { StaffUser, ActivityItem } from '../types/admin';
import { INITIAL_VEHICLES } from '../data/mockVehicles';
import { INITIAL_REVIEWS } from '../data/mockReviews';
import { INITIAL_BLOG_POSTS } from '../data/mockBlog';
import { INITIAL_STAFF } from '../data/mockTeam';
import { DEALERSHIP } from '../config/dealership';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface AppState {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isTestDriveOpen: boolean;
  testDriveVehicle: Vehicle | null;
  openTestDrive: (vehicle?: Vehicle | null) => void;
  closeTestDrive: () => void;
  isPreApprovalOpen: boolean;
  openPreApproval: () => void;
  closePreApproval: () => void;

  // Vehicles
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;

  // Reviews
  reviews: Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  replyToReview: (id: string, replyMessage: string, author: string) => void;
  deleteReview: (id: string) => void;

  // Blog
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  // Cart & Reservations
  cartItems: CartItem[];
  addToCart: (vehicle: Vehicle) => void;
  removeFromCart: (vehicleId: string) => void;
  toggleCartAddon: (vehicleId: string, addonId: string) => void;
  clearCart: () => void;

  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;

  // Compare List (max 4)
  compareIds: string[];
  addToCompare: (vehicleId: string) => boolean;
  removeFromCompare: (vehicleId: string) => void;
  clearCompare: () => void;

  // Favorites
  favoriteIds: string[];
  toggleFavorite: (vehicleId: string) => void;

  // Staff
  staff: StaffUser[];
  addStaff: (user: StaffUser) => void;
  removeStaff: (id: string) => void;

  // Admin Auth & Activity
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Reset demo
  resetDemoData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          if (nextTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
          } else {
            root.classList.add('light');
            root.classList.remove('dark');
          }
        }
        set({ theme: nextTheme });
      },

      // Modals
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      isTestDriveOpen: false,
      testDriveVehicle: null,
      openTestDrive: (vehicle = null) => set({ isTestDriveOpen: true, testDriveVehicle: vehicle }),
      closeTestDrive: () => set({ isTestDriveOpen: false, testDriveVehicle: null }),
      isPreApprovalOpen: false,
      openPreApproval: () => set({ isPreApprovalOpen: true }),
      closePreApproval: () => set({ isPreApprovalOpen: false }),

      // Vehicles
      vehicles: INITIAL_VEHICLES,
      addVehicle: (vehicle) => {
        set((state) => ({
          vehicles: [vehicle, ...state.vehicles],
        }));
        get().addActivity({
          type: 'inventory',
          title: 'New vehicle listed',
          description: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockNumber}) added to inventory.`,
        });
        get().showToast({
          type: 'success',
          title: 'Vehicle Listed',
          message: `${vehicle.year} ${vehicle.make} ${vehicle.model} is now live in inventory.`,
        });
      },
      updateVehicle: (id, updates) => {
        set((state) => ({
          vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        }));
        get().showToast({
          type: 'success',
          title: 'Vehicle Updated',
          message: 'Changes saved successfully.',
        });
      },
      deleteVehicle: (id) => {
        const vehicle = get().vehicles.find((v) => v.id === id);
        set((state) => ({
          vehicles: state.vehicles.filter((v) => v.id !== id),
          cartItems: state.cartItems.filter((i) => i.vehicle.id !== id),
          compareIds: state.compareIds.filter((cid) => cid !== id),
          favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
        }));
        if (vehicle) {
          get().addActivity({
            type: 'inventory',
            title: 'Vehicle removed',
            description: `${vehicle.year} ${vehicle.make} ${vehicle.model} removed from inventory.`,
          });
          get().showToast({
            type: 'info',
            title: 'Vehicle Removed',
            message: `${vehicle.year} ${vehicle.make} was deleted.`,
          });
        }
      },
      updateVehicleStatus: (id, status) => {
        set((state) => ({
          vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, status } : v)),
        }));
        get().showToast({
          type: 'info',
          title: 'Status Updated',
          message: `Vehicle status changed to ${status}.`,
        });
      },

      // Reviews
      reviews: INITIAL_REVIEWS,
      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
        };
        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }));
        get().addActivity({
          type: 'review',
          title: 'New customer review submitted',
          description: `${newReview.customerName} rated ${newReview.rating} stars: "${newReview.title}"`,
        });
        get().showToast({
          type: 'success',
          title: 'Review Submitted',
          message: 'Thanks! Your review has been submitted for dealership moderation.',
        });
      },
      approveReview: (id) => {
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)),
        }));
        get().showToast({
          type: 'success',
          title: 'Review Approved',
          message: 'The review is now published on listings.',
        });
      },
      rejectReview: (id) => {
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)),
        }));
        get().showToast({
          type: 'info',
          title: 'Review Rejected',
          message: 'Review marked as rejected.',
        });
      },
      replyToReview: (id, replyMessage, author) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  adminReply: {
                    message: replyMessage,
                    repliedAt: new Date().toISOString().split('T')[0],
                    author,
                  },
                }
              : r
          ),
        }));
        get().showToast({
          type: 'success',
          title: 'Reply Published',
          message: 'Dealership response attached to review.',
        });
      },
      deleteReview: (id) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        }));
        get().showToast({
          type: 'info',
          title: 'Review Deleted',
          message: 'Review has been removed.',
        });
      },

      // Blog
      blogPosts: INITIAL_BLOG_POSTS,
      addBlogPost: (post) => {
        set((state) => ({
          blogPosts: [post, ...state.blogPosts],
        }));
        get().showToast({
          type: 'success',
          title: 'Article Published',
          message: `"${post.title}" is now published.`,
        });
      },
      updateBlogPost: (id, updates) => {
        set((state) => ({
          blogPosts: state.blogPosts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
        get().showToast({
          type: 'success',
          title: 'Article Updated',
          message: 'Changes saved successfully.',
        });
      },
      deleteBlogPost: (id) => {
        set((state) => ({
          blogPosts: state.blogPosts.filter((p) => p.id !== id),
        }));
        get().showToast({
          type: 'info',
          title: 'Article Deleted',
          message: 'The post has been deleted.',
        });
      },

      // Cart
      cartItems: [],
      addToCart: (vehicle) => {
        const existing = get().cartItems.find((i) => i.vehicle.id === vehicle.id);
        if (existing) {
          get().showToast({
            type: 'info',
            title: 'Already Reserved in Cart',
            message: `${vehicle.year} ${vehicle.make} ${vehicle.model} is already in your reservation cart.`,
          });
          set({ isCartOpen: true });
          return;
        }
        set((state) => ({
          cartItems: [
            ...state.cartItems,
            {
              vehicle,
              selectedAddonIds: ['warranty'], // Default recommended warranty
              depositAmount: DEALERSHIP.pricing.reservationDeposit,
            },
          ],
          isCartOpen: true,
        }));
        get().showToast({
          type: 'success',
          title: 'Vehicle Added to Cart',
          message: `${vehicle.year} ${vehicle.make} ${vehicle.model} is ready for reservation hold.`,
        });
      },
      removeFromCart: (vehicleId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.vehicle.id !== vehicleId),
        }));
        get().showToast({
          type: 'info',
          title: 'Removed from Cart',
          message: 'Vehicle removed from reservation cart.',
        });
      },
      toggleCartAddon: (vehicleId, addonId) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) => {
            if (item.vehicle.id !== vehicleId) return item;
            const hasAddon = item.selectedAddonIds.includes(addonId);
            return {
              ...item,
              selectedAddonIds: hasAddon
                ? item.selectedAddonIds.filter((id) => id !== addonId)
                : [...item.selectedAddonIds, addonId],
            };
          }),
        }));
      },
      clearCart: () => set({ cartItems: [] }),

      // Reservations
      reservations: [
        {
          id: 'res-init-1',
          reservationNumber: 'APX-RES-8821',
          createdAt: '2026-08-15T14:32:00Z',
          status: 'Confirmed',
          vehicle: INITIAL_VEHICLES[0],
          selectedAddons: [
            { id: 'warranty', name: 'Apex Care Extended Powertrain', price: 1495 },
            { id: 'paint-protection', name: 'Ceramic Pro 9H Coating', price: 699 },
          ],
          pricingSummary: {
            vehiclePrice: 68900,
            addonsTotal: 2194,
            salesTax: 5865.26,
            docFee: 150,
            totalPrice: 77109.26,
            depositPaid: 500,
            balanceDue: 76609.26,
          },
          customer: {
            firstName: 'Harrison',
            lastName: 'Ford',
            email: 'harrison.f@example.com',
            phone: '(214) 555-0199',
            address: '3800 Preston Rd',
            city: 'Dallas',
            state: 'TX',
            zip: '75205',
            deliveryPreference: 'pickup',
          },
          paymentDetails: {
            lastFour: '4242',
            cardBrand: 'Visa',
            demoNote: 'Demo hold authorized',
          },
        },
      ],
      addReservation: (reservation) => {
        set((state) => ({
          reservations: [reservation, ...state.reservations],
          // Mark vehicle as Reserved
          vehicles: state.vehicles.map((v) =>
            v.id === reservation.vehicle.id ? { ...v, status: 'Reserved' } : v
          ),
          cartItems: state.cartItems.filter((item) => item.vehicle.id !== reservation.vehicle.id),
        }));
        get().addActivity({
          type: 'reservation',
          title: 'New vehicle reserved online',
          description: `${reservation.customer.firstName} ${reservation.customer.lastName} reserved ${reservation.vehicle.year} ${reservation.vehicle.make} ${reservation.vehicle.model} ($500 hold deposit received).`,
        });
      },
      updateReservationStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
        }));
        get().showToast({
          type: 'info',
          title: 'Reservation Updated',
          message: `Reservation marked as ${status}.`,
        });
      },

      // Compare
      compareIds: ['apex-001', 'apex-002'],
      addToCompare: (vehicleId) => {
        const { compareIds } = get();
        if (compareIds.includes(vehicleId)) {
          get().showToast({
            type: 'info',
            title: 'Already in Comparison',
            message: 'This vehicle is already in your comparison grid.',
          });
          return true;
        }
        if (compareIds.length >= 4) {
          get().showToast({
            type: 'warning',
            title: 'Comparison Limit Reached',
            message: 'You can compare up to 4 vehicles simultaneously. Please remove one first.',
          });
          return false;
        }
        set({ compareIds: [...compareIds, vehicleId] });
        get().showToast({
          type: 'success',
          title: 'Added to Compare',
          message: `Vehicle added to comparison tray (${compareIds.length + 1}/4).`,
        });
        return true;
      },
      removeFromCompare: (vehicleId) => {
        set((state) => ({
          compareIds: state.compareIds.filter((id) => id !== vehicleId),
        }));
      },
      clearCompare: () => set({ compareIds: [] }),

      // Favorites
      favoriteIds: ['apex-001', 'apex-006'],
      toggleFavorite: (vehicleId) => {
        const { favoriteIds } = get();
        const exists = favoriteIds.includes(vehicleId);
        if (exists) {
          set({ favoriteIds: favoriteIds.filter((id) => id !== vehicleId) });
          get().showToast({
            type: 'info',
            title: 'Removed from Saved',
            message: 'Vehicle removed from your saved list.',
          });
        } else {
          set({ favoriteIds: [...favoriteIds, vehicleId] });
          get().showToast({
            type: 'success',
            title: 'Vehicle Saved',
            message: 'Saved to your favorites list.',
          });
        }
      },

      // Staff
      staff: INITIAL_STAFF,
      addStaff: (user) => {
        set((state) => ({
          staff: [...state.staff, user],
        }));
        get().showToast({
          type: 'success',
          title: 'Staff Member Added',
          message: `${user.name} has been added.`,
        });
      },
      removeStaff: (id) => {
        set((state) => ({
          staff: state.staff.filter((s) => s.id !== id),
        }));
        get().showToast({
          type: 'info',
          title: 'Staff Member Removed',
          message: 'Member removed.',
        });
      },

      // Admin Auth
      isAdminAuthenticated: false,
      loginAdmin: (email, pass) => {
        if (
          email.toLowerCase() === DEALERSHIP.demoAdmin.email.toLowerCase() &&
          pass === DEALERSHIP.demoAdmin.defaultPass
        ) {
          set({ isAdminAuthenticated: true });
          get().showToast({
            type: 'success',
            title: 'Admin Access Granted',
            message: 'Welcome back to Apex Motor Co. Management Portal.',
          });
          return true;
        }
        get().showToast({
          type: 'error',
          title: 'Authentication Failed',
          message: 'Invalid email or password. Use demo credentials on screen.',
        });
        return false;
      },
      logoutAdmin: () => {
        set({ isAdminAuthenticated: false });
        get().showToast({
          type: 'info',
          title: 'Logged Out',
          message: 'Admin session terminated.',
        });
      },

      // Activity Feed
      activities: [
        {
          id: 'act-1',
          timestamp: '10 minutes ago',
          type: 'reservation',
          title: 'Online reservation confirmed',
          description: '2023 Porsche Macan GTS placed on $500 refundable deposit hold.',
        },
        {
          id: 'act-2',
          timestamp: '1 hour ago',
          type: 'review',
          title: 'Customer review published',
          description: 'David K. left a 5-star review for Marcus Vance.',
        },
        {
          id: 'act-3',
          timestamp: '3 hours ago',
          type: 'inventory',
          title: 'Inspection certification completed',
          description: '2024 BMW X5 xDrive40i completed 150-point safety check.',
        },
        {
          id: 'act-4',
          timestamp: 'Yesterday',
          type: 'price_drop',
          title: 'Inventory pricing synced',
          description: 'All 24 active listings audited against North Texas market comps.',
        },
      ],
      addActivity: (activity) => {
        const item: ActivityItem = {
          ...activity,
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
        };
        set((state) => ({
          activities: [item, ...state.activities.slice(0, 19)],
        }));
      },

      // Toasts
      toasts: [],
      showToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: ToastItem = { ...toast, id };
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));
        const duration = toast.duration || 3500;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      // Reset Demo Data
      resetDemoData: () => {
        set({
          vehicles: INITIAL_VEHICLES,
          reviews: INITIAL_REVIEWS,
          blogPosts: INITIAL_BLOG_POSTS,
          staff: INITIAL_STAFF,
          cartItems: [],
          compareIds: ['apex-001', 'apex-002'],
          favoriteIds: ['apex-001', 'apex-006'],
        });
        get().showToast({
          type: 'info',
          title: 'Demo Data Reset',
          message: 'All inventory, reviews, and posts restored to original defaults.',
        });
      },
    }),
    {
      name: 'apex-motor-storage-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        vehicles: state.vehicles,
        reviews: state.reviews,
        blogPosts: state.blogPosts,
        reservations: state.reservations,
        cartItems: state.cartItems,
        compareIds: state.compareIds,
        favoriteIds: state.favoriteIds,
        staff: state.staff,
        theme: state.theme,
        isAdminAuthenticated: state.isAdminAuthenticated,
      }),
    }
  )
);
