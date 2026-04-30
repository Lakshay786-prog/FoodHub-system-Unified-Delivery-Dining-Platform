import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartRestaurantName, placeOrder, user } = useStore();
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((s, l) => s + l.price * l.quantity, 0);
  const fee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + fee + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-warm-gradient">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Your cart is empty</h1>
          <Button variant="hero" onClick={() => navigate("/")}>Browse restaurants</Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const order = placeOrder();
    setProcessing(false);
    if (order) {
      toast.success("Order placed!");
      navigate(`/orders/${order.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <div className="container py-10 grid lg:grid-cols-[1fr_400px] gap-8">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <h1 className="font-display text-4xl font-bold">Checkout</h1>

          <div className="bg-card p-6 rounded-3xl shadow-soft space-y-4">
            <h2 className="font-semibold">Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Full name</Label><Input defaultValue={user?.name || ""} required /></div>
              <div><Label>Phone</Label><Input placeholder="+1 555 0100" required /></div>
            </div>
            <div><Label>Address</Label><Input placeholder="123 Spring St, Apt 4B" required /></div>
            <div><Label>Delivery notes</Label><Input placeholder="Leave at door" /></div>
          </div>

          <div className="bg-card p-6 rounded-3xl shadow-soft space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</h2>
            <div><Label>Card number</Label><Input placeholder="4242 4242 4242 4242" required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Expiry</Label><Input placeholder="MM/YY" required /></div>
              <div><Label>CVC</Label><Input placeholder="123" required /></div>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="h-3 w-3" /> Secure simulated payment — no real charges</p>
          </div>

          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={processing}>
            {processing ? "Processing…" : `Place order · $${total.toFixed(2)}`}
          </Button>
        </motion.form>

        <aside className="bg-card p-6 rounded-3xl shadow-soft h-fit lg:sticky lg:top-24">
          <h3 className="font-display text-xl font-bold mb-1">Order summary</h3>
          <p className="text-sm text-muted-foreground mb-4">{cartRestaurantName}</p>
          <div className="space-y-3 mb-4">
            {cart.map((line) => (
              <div key={line.id} className="flex justify-between text-sm">
                <span>{line.quantity}× {line.name}</span>
                <span className="font-medium">${(line.price * line.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>${fee.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-display text-xl font-bold pt-2 border-t mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
