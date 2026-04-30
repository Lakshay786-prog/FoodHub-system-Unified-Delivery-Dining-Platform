import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { RESTAURANTS } from "@/data/restaurants";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarCheck, Users } from "lucide-react";
import { toast } from "sonner";

export default function Reserve() {
  const { id } = useParams();
  const restaurant = RESTAURANTS.find((r) => r.id === id);
  const navigate = useNavigate();
  const { addReservation } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [partySize, setPartySize] = useState(2);
  const [time, setTime] = useState<string | null>(null);

  if (!restaurant) return <div className="p-10">Restaurant not found</div>;

  const onConfirm = () => {
    if (!time) return toast.error("Pick a time slot");
    addReservation({ restaurantId: restaurant.id, restaurantName: restaurant.name, date, time, partySize });
    toast.success(`Table booked at ${restaurant.name} · ${date} ${time}`);
    navigate("/reservations");
  };

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <div className="container py-10 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold">Reserve a table</h1>
          <p className="text-lg text-muted-foreground mt-1">{restaurant.name}</p>
        </motion.div>

        <div className="bg-card rounded-3xl shadow-soft p-6 md:p-8 mt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Party size</Label>
              <Input type="number" min={1} max={12} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Available slots</Label>
            <div className="flex flex-wrap gap-2">
              {restaurant.reservationSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={time === slot ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={onConfirm}>
            <CalendarCheck className="h-5 w-5" /> Confirm reservation
          </Button>
        </div>
      </div>
    </div>
  );
}
