import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, MapPin } from "lucide-react";
import { Restaurant } from "@/data/restaurants";
import { Badge } from "@/components/ui/badge";

export default function RestaurantCard({ restaurant, index = 0 }: { restaurant: Restaurant; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/restaurant/${restaurant.id}`}
        className="group block rounded-3xl overflow-hidden bg-card shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-dark-gradient" />
          <Badge className="absolute top-3 left-3 bg-background/95 text-foreground hover:bg-background border-0">
            {restaurant.cuisine}
          </Badge>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/95 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {restaurant.rating}
            <span className="text-muted-foreground font-normal">({restaurant.reviewCount})</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-display text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{restaurant.tagline}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{restaurant.deliveryMin} min</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{restaurant.distanceKm} km</span>
            <span className="ml-auto text-foreground font-medium">{"$".repeat(restaurant.priceLevel)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
