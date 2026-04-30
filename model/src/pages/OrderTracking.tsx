import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useStore } from "@/store/useStore";
import { ORDER_STAGES } from "@/data/restaurants";
import { Check, Package, ChefHat, Bike, Home, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const STAGE_ICONS = {
  Placed: FileCheck,
  Accepted: Package,
  Preparing: ChefHat,
  "In Transit": Bike,
  Delivered: Home,
};

export default function OrderTracking() {
  const { id } = useParams();
  const { orders, advanceOrder } = useStore();
  const order = orders.find((o) => o.id === id);

  // Simulated WebSocket: advance every 6s until delivered
  useEffect(() => {
    if (!order || order.stage === "Delivered") return;
    const t = setTimeout(() => advanceOrder(order.id), 6000);
    return () => clearTimeout(t);
  }, [order?.stage, order?.id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-warm-gradient">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Order not found</h1>
          <Link to="/orders"><Button variant="hero">View all orders</Button></Link>
        </div>
      </div>
    );
  }

  const currentIdx = ORDER_STAGES.indexOf(order.stage);

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <div className="container py-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-muted-foreground">Order #{order.id.slice(-6).toUpperCase()}</p>
          <h1 className="font-display text-4xl font-bold mt-1">{order.restaurantName}</h1>
          <p className="text-muted-foreground mt-2">
            {order.stage === "Delivered" ? "Enjoy your meal! 🎉" : "Live updates · refreshing in real time"}
          </p>
        </motion.div>

        <div className="bg-card rounded-3xl shadow-soft p-6 md:p-8 mt-8">
          <div className="space-y-6">
            {ORDER_STAGES.map((stage, i) => {
              const Icon = STAGE_ICONS[stage];
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div key={stage} className="flex items-center gap-4">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: active ? [1, 1.1, 1] : 1,
                      backgroundColor: done ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    }}
                    transition={{ duration: 0.6, repeat: active ? Infinity : 0, repeatDelay: 1 }}
                    className="h-12 w-12 rounded-full grid place-items-center shrink-0"
                  >
                    {done ? <Check className="h-5 w-5 text-primary-foreground" /> : <Icon className="h-5 w-5 text-muted-foreground" />}
                  </motion.div>
                  <div className="flex-1">
                    <div className={`font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{stage}</div>
                    {active && <div className="text-xs text-primary mt-0.5">In progress…</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-soft p-6 mt-6">
          <h3 className="font-display text-xl font-bold mb-3">Items</h3>
          {order.lines.map((l) => (
            <div key={l.id} className="flex justify-between text-sm py-1.5">
              <span>{l.quantity}× {l.name}</span>
              <span>${(l.price * l.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-display font-bold text-lg border-t pt-3 mt-3">
            <span>Total</span><span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {order.stage === "Delivered" && (
          <div className="mt-6 text-center">
            <Link to={`/reviews?restaurantId=${order.restaurantId}&restaurantName=${encodeURIComponent(order.restaurantName)}`}>
              <Button variant="hero" size="lg">Leave a review · earn points</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
