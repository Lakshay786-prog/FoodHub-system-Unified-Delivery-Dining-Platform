import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import RestaurantCard from "@/components/RestaurantCard";
import { CUISINES, RESTAURANTS, Cuisine } from "@/data/restaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";

export default function Discover() {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState<Cuisine | "All">("All");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "delivery">("distance");

  const filtered = useMemo(() => {
    let list = RESTAURANTS.filter((r) =>
      (cuisine === "All" || r.cuisine === cuisine) &&
      r.rating >= minRating &&
      (query === "" || r.name.toLowerCase().includes(query.toLowerCase()) || r.tagline.toLowerCase().includes(query.toLowerCase()))
    );
    list = [...list].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "delivery") return a.deliveryMin - b.deliveryMin;
      return a.distanceKm - b.distanceKm;
    });
    return list;
  }, [query, cuisine, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card shadow-soft text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Order, reserve, review — all in one
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] text-balance">
              The flavor of your <span className="italic text-primary">city</span>, on tap.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md text-balance">
              Discover legendary kitchens nearby, book your table or get it delivered — and earn rewards every time you review.
            </p>
            <div className="flex items-center gap-2 max-w-md bg-card p-2 rounded-full shadow-soft">
              <Search className="h-5 w-5 text-muted-foreground ml-3" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants or dishes…"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button variant="hero" size="sm">Find</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-elegant">
              <img src={heroImg} alt="Curated food spread" width={1536} height={1024} className="h-full w-full object-cover" />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-elegant max-w-[200px]"
            >
              <div className="text-xs text-muted-foreground">Avg. delivery</div>
              <div className="font-display text-2xl font-bold">26 min</div>
              <div className="text-xs text-success font-medium mt-1">↑ Faster than 92% of cities</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="container pb-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button variant={cuisine === "All" ? "default" : "outline"} size="sm" onClick={() => setCuisine("All")}>All cuisines</Button>
          {CUISINES.map((c) => (
            <Button key={c} variant={cuisine === c ? "default" : "outline"} size="sm" onClick={() => setCuisine(c)}>{c}</Button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Min rating</span>
            {[0, 4, 4.5].map((r) => (
              <Button key={r} variant={minRating === r ? "default" : "outline"} size="sm" onClick={() => setMinRating(r)}>
                {r === 0 ? "Any" : `${r}+`}
              </Button>
            ))}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-9 rounded-full border border-input bg-background px-4 text-sm"
            >
              <option value="distance">Nearest</option>
              <option value="rating">Top rated</option>
              <option value="delivery">Fastest</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No restaurants match your filters.</div>
        )}
      </section>
    </div>
  );
}
