import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useStore } from "@/store/useStore";
import { RESTAURANTS, ORDER_STAGES } from "@/data/restaurants";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ChefHat, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export default function Merchant() {
  const { orders, advanceOrder } = useStore();
  const restaurant = RESTAURANTS[0]; // demo: first restaurant
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    Object.fromEntries(restaurant.menu.map((m) => [m.id, true]))
  );

  const incoming = orders.filter((o) => o.stage !== "Delivered");
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Incoming orders", value: incoming.length, icon: ShoppingBag, color: "text-primary" },
    { label: "Revenue (demo)", value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: "text-success" },
    { label: "Menu items", value: Object.values(availability).filter(Boolean).length, icon: ChefHat, color: "text-accent" },
    { label: "Avg rating", value: restaurant.rating, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <div className="container py-10">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Merchant dashboard</p>
          <h1 className="font-display text-4xl font-bold">{restaurant.name}</h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card p-5 rounded-3xl shadow-soft"
            >
              <s.icon className={`h-5 w-5 ${s.color} mb-3`} />
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="font-display text-3xl font-bold mt-1">{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-3xl shadow-soft">
            <h2 className="font-display text-2xl font-bold mb-4">Incoming orders</h2>
            {incoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active orders right now.</p>
            ) : (
              <div className="space-y-3">
                {incoming.map((o) => {
                  const idx = ORDER_STAGES.indexOf(o.stage);
                  const next = ORDER_STAGES[idx + 1];
                  return (
                    <div key={o.id} className="p-4 rounded-2xl bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">#{o.id.slice(-6).toUpperCase()}</div>
                          <div className="text-xs text-muted-foreground">{o.lines.length} items · ${o.total.toFixed(2)}</div>
                        </div>
                        <Badge>{o.stage}</Badge>
                      </div>
                      {next && (
                        <Button size="sm" variant="hero" className="mt-3 w-full" onClick={() => advanceOrder(o.id)}>
                          Mark as {next}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-card p-6 rounded-3xl shadow-soft">
            <h2 className="font-display text-2xl font-bold mb-4">Menu availability</h2>
            <div className="space-y-2">
              {restaurant.menu.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <Switch
                    checked={availability[item.id]}
                    onCheckedChange={(v) => setAvailability((a) => ({ ...a, [item.id]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
