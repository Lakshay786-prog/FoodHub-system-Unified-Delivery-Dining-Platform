import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Plus, ArrowLeft, CalendarCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { RESTAURANTS } from "@/data/restaurants";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = RESTAURANTS.find((r) => r.id === id);
  const { addToCart, forceReplaceCart } = useStore();
  const [conflict, setConflict] = useState<{ itemId: string } | null>(null);

  if (!restaurant) return <div className="p-10">Restaurant not found</div>;

  const handleAdd = (itemId: string) => {
    const item = restaurant.menu.find((m) => m.id === itemId)!;
    const res = addToCart(restaurant, item);
    if (res.conflict) setConflict({ itemId });
    else toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-dark-gradient" />
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-8">
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl md:text-7xl font-bold text-primary-foreground"
            >
              {restaurant.name}
            </motion.h1>
            <p className="text-primary-foreground/85 text-lg mt-2">{restaurant.tagline}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-primary-foreground/90 text-sm">
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent" />{restaurant.rating} ({restaurant.reviewCount})</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{restaurant.deliveryMin} min</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{restaurant.distanceKm} km</span>
              <Link to={`/reserve/${restaurant.id}`}>
                <Button variant="hero" size="sm" className="ml-2">
                  <CalendarCheck className="h-4 w-4" /> Reserve a table
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="container py-10">
        <h2 className="font-display text-3xl font-bold mb-6">Menu</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {restaurant.menu.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-3xl bg-card shadow-soft hover:shadow-elegant transition-all"
            >
              <img src={item.image} alt={item.name} loading="lazy" className="h-24 w-24 rounded-2xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{item.name}</div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="font-display font-bold text-lg">${item.price.toFixed(2)}</div>
                  <Button size="sm" variant="hero" onClick={() => handleAdd(item.id)}>
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AlertDialog open={!!conflict} onOpenChange={(o) => !o && setConflict(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start a new order?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart has items from another restaurant. Adding this will clear your current cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep current</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!conflict) return;
                const item = restaurant.menu.find((m) => m.id === conflict.itemId)!;
                forceReplaceCart(restaurant, item);
                toast.success(`${item.name} added — new cart started`);
                setConflict(null);
              }}
            >
              Start new cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
