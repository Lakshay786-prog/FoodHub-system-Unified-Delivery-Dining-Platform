import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem, OrderStage, Restaurant } from "@/data/restaurants";

export type UserRole = "consumer" | "partner" | "courier";

export interface CartLine extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  lines: CartLine[];
  total: number;
  stage: OrderStage;
  placedAt: number;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
}

export interface Review {
  id: string;
  restaurantId: string;
  restaurantName: string;
  rating: number;
  text: string;
  points: number;
  createdAt: number;
}

interface AppState {
  user: { name: string; email: string; role: UserRole } | null;
  login: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;

  cartRestaurantId: string | null;
  cartRestaurantName: string | null;
  cart: CartLine[];
  addToCart: (restaurant: Restaurant, item: MenuItem) => { ok: boolean; conflict?: boolean };
  forceReplaceCart: (restaurant: Restaurant, item: MenuItem) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;

  orders: Order[];
  placeOrder: () => Order | null;
  advanceOrder: (id: string) => void;

  reservations: Reservation[];
  addReservation: (r: Omit<Reservation, "id">) => void;

  reviews: Review[];
  rewardPoints: number;
  addReview: (r: Omit<Review, "id" | "createdAt" | "points">) => Review;
}

const calcPoints = (text: string, rating: number) => {
  const len = text.trim().length;
  let pts = 10;
  if (len > 80) pts += 15;
  if (len > 200) pts += 25;
  if (rating >= 4) pts += 5;
  return pts;
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (name, email, role) => set({ user: { name, email, role } }),
      logout: () => set({ user: null }),
      setRole: (role) => set((s) => (s.user ? { user: { ...s.user, role } } : {})),

      cartRestaurantId: null,
      cartRestaurantName: null,
      cart: [],
      addToCart: (restaurant, item) => {
        const { cartRestaurantId, cart } = get();
        if (cartRestaurantId && cartRestaurantId !== restaurant.id) {
          return { ok: false, conflict: true };
        }
        const existing = cart.find((c) => c.id === item.id);
        const next = existing
          ? cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
          : [...cart, { ...item, quantity: 1 }];
        set({
          cart: next,
          cartRestaurantId: restaurant.id,
          cartRestaurantName: restaurant.name,
        });
        return { ok: true };
      },
      forceReplaceCart: (restaurant, item) =>
        set({
          cart: [{ ...item, quantity: 1 }],
          cartRestaurantId: restaurant.id,
          cartRestaurantName: restaurant.name,
        }),
      updateQty: (id, qty) => {
        const cart = get().cart.map((c) => (c.id === id ? { ...c, quantity: qty } : c)).filter((c) => c.quantity > 0);
        set({ cart, ...(cart.length === 0 ? { cartRestaurantId: null, cartRestaurantName: null } : {}) });
      },
      clearCart: () => set({ cart: [], cartRestaurantId: null, cartRestaurantName: null }),

      orders: [],
      placeOrder: () => {
        const { cart, cartRestaurantId, cartRestaurantName } = get();
        if (!cart.length || !cartRestaurantId) return null;
        const total = cart.reduce((sum, l) => sum + l.price * l.quantity, 0);
        const order: Order = {
          id: "ord_" + Math.random().toString(36).slice(2, 9),
          restaurantId: cartRestaurantId,
          restaurantName: cartRestaurantName!,
          lines: cart,
          total,
          stage: "Placed",
          placedAt: Date.now(),
        };
        set((s) => ({ orders: [order, ...s.orders], cart: [], cartRestaurantId: null, cartRestaurantName: null }));
        return order;
      },
      advanceOrder: (id) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== id) return o;
            const stages = ["Placed", "Accepted", "Preparing", "In Transit", "Delivered"] as const;
            const idx = stages.indexOf(o.stage);
            return idx < stages.length - 1 ? { ...o, stage: stages[idx + 1] } : o;
          }),
        })),

      reservations: [],
      addReservation: (r) =>
        set((s) => ({ reservations: [{ ...r, id: "res_" + Math.random().toString(36).slice(2, 9) }, ...s.reservations] })),

      reviews: [],
      rewardPoints: 0,
      addReview: (r) => {
        const points = calcPoints(r.text, r.rating);
        const review: Review = {
          ...r,
          id: "rev_" + Math.random().toString(36).slice(2, 9),
          points,
          createdAt: Date.now(),
        };
        set((s) => ({ reviews: [review, ...s.reviews], rewardPoints: s.rewardPoints + points }));
        return review;
      },
    }),
    { name: "feast-store" }
  )
);
