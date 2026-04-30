import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Orders() {
  const { orders } = useStore();

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <div className="container py-10 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">Your orders</h1>
        {orders.length === 0 ? (
          <div className="bg-card p-10 rounded-3xl shadow-soft text-center">
            <p className="text-muted-foreground mb-4">No orders yet.</p>
            <Link to="/"><Button variant="hero">Order something delicious</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/orders/${o.id}`}
                className="block bg-card p-5 rounded-3xl shadow-soft hover:shadow-elegant transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-display text-xl font-bold truncate">{o.restaurantName}</div>
                    <div className="text-sm text-muted-foreground">
                      {o.lines.length} item{o.lines.length > 1 ? "s" : ""} · ${o.total.toFixed(2)} · {new Date(o.placedAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={o.stage === "Delivered" ? "secondary" : "default"}>{o.stage}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
