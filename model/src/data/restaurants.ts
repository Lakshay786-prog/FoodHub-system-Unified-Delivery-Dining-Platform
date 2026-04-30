import burger from "@/assets/dish-burger.jpg";
import pizza from "@/assets/dish-pizza.jpg";
import sushi from "@/assets/dish-sushi.jpg";
import curry from "@/assets/dish-curry.jpg";
import tacos from "@/assets/dish-tacos.jpg";
import r1 from "@/assets/restaurant-1.jpg";
import r2 from "@/assets/restaurant-2.jpg";
import r3 from "@/assets/restaurant-3.jpg";

export type Cuisine = "Italian" | "Japanese" | "Indian" | "Mexican" | "American";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: Cuisine;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  deliveryMin: number;
  priceLevel: 1 | 2 | 3;
  image: string;
  menu: MenuItem[];
  reservationSlots: string[];
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: "trattoria-luna",
    name: "Trattoria Luna",
    tagline: "Wood-fired Neapolitan since 1998",
    cuisine: "Italian",
    rating: 4.8,
    reviewCount: 1240,
    distanceKm: 1.2,
    deliveryMin: 25,
    priceLevel: 2,
    image: r3,
    menu: [
      { id: "m1", name: "Margherita Pizza", description: "San Marzano, fior di latte, basil", price: 14.5, image: pizza },
      { id: "m2", name: "Truffle Tagliatelle", description: "Hand-cut pasta, black truffle, parmigiano", price: 22, image: pizza },
      { id: "m3", name: "Tiramisu", description: "Mascarpone, espresso, cocoa", price: 8.5, image: pizza },
    ],
    reservationSlots: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
  },
  {
    id: "ramen-koji",
    name: "Ramen Kōji",
    tagline: "Tonkotsu broth simmered 18 hours",
    cuisine: "Japanese",
    rating: 4.7,
    reviewCount: 890,
    distanceKm: 2.4,
    deliveryMin: 30,
    priceLevel: 2,
    image: r2,
    menu: [
      { id: "m4", name: "Tonkotsu Ramen", description: "Pork bone broth, chashu, ajitama", price: 16, image: sushi },
      { id: "m5", name: "Salmon Nigiri (8pc)", description: "Hand-pressed, fresh wasabi", price: 18, image: sushi },
      { id: "m6", name: "Gyoza", description: "Pan-fried pork dumplings", price: 9, image: sushi },
    ],
    reservationSlots: ["17:30", "18:00", "19:00", "20:00", "20:30"],
  },
  {
    id: "cinder-grill",
    name: "Cinder Grill House",
    tagline: "Dry-aged steaks & smash burgers",
    cuisine: "American",
    rating: 4.6,
    reviewCount: 2100,
    distanceKm: 0.8,
    deliveryMin: 20,
    priceLevel: 3,
    image: r1,
    menu: [
      { id: "m7", name: "Double Smash Burger", description: "Aged cheddar, house sauce, brioche", price: 15, image: burger },
      { id: "m8", name: "Truffle Fries", description: "Parmesan, chives, truffle oil", price: 7, image: burger },
      { id: "m9", name: "Chocolate Shake", description: "Belgian dark chocolate", price: 6, image: burger },
    ],
    reservationSlots: ["18:00", "19:00", "20:00", "21:00"],
  },
  {
    id: "saffron-route",
    name: "Saffron Route",
    tagline: "Modern North Indian kitchen",
    cuisine: "Indian",
    rating: 4.9,
    reviewCount: 1560,
    distanceKm: 3.1,
    deliveryMin: 35,
    priceLevel: 2,
    image: r1,
    menu: [
      { id: "m10", name: "Butter Chicken", description: "Tomato cream, fenugreek, basmati", price: 17, image: curry },
      { id: "m11", name: "Garlic Naan", description: "Tandoor-baked, cultured butter", price: 4, image: curry },
      { id: "m12", name: "Mango Lassi", description: "Alphonso mango, yogurt, cardamom", price: 5, image: curry },
    ],
    reservationSlots: ["18:30", "19:00", "19:30", "20:30"],
  },
  {
    id: "casa-maya",
    name: "Casa Maya",
    tagline: "Street tacos & mezcal bar",
    cuisine: "Mexican",
    rating: 4.5,
    reviewCount: 720,
    distanceKm: 1.9,
    deliveryMin: 25,
    priceLevel: 1,
    image: r2,
    menu: [
      { id: "m13", name: "Al Pastor Tacos (3)", description: "Pineapple, cilantro, salsa verde", price: 12, image: tacos },
      { id: "m14", name: "Elote", description: "Charred corn, cotija, lime", price: 6, image: tacos },
      { id: "m15", name: "Horchata", description: "Rice milk, cinnamon, vanilla", price: 4, image: tacos },
    ],
    reservationSlots: ["18:00", "19:00", "20:00", "21:00", "21:30"],
  },
];

export const CUISINES: Cuisine[] = ["Italian", "Japanese", "Indian", "Mexican", "American"];

export const ORDER_STAGES = ["Placed", "Accepted", "Preparing", "In Transit", "Delivered"] as const;
export type OrderStage = typeof ORDER_STAGES[number];
