import Navbar from "@/components/Navbar";
import { useStore } from "@/store/useStore";
import { CalendarCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Reservations() {
  const { reservations } = useStore();
  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <div className="container py-10 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-8">Your reservations</h1>
        {reservations.length === 0 ? (
          <div className="bg-card p-10 rounded-3xl shadow-soft text-center">
            <p className="text-muted-foreground mb-4">No reservations yet.</p>
            <Link to="/"><Button variant="hero">Find a restaurant</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((r) => (
              <div key={r.id} className="bg-card p-5 rounded-3xl shadow-soft flex items-center justify-between gap-4">
                <div>
                  <div className="font-display text-xl font-bold">{r.restaurantName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><CalendarCheck className="h-4 w-4" />{r.date} · {r.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" />{r.partySize}</span>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-success/10 text-success font-semibold">Confirmed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
