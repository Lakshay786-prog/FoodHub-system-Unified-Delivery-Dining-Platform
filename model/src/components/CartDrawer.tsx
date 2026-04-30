import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { cart, cartRestaurantName, updateQty, clearCart } = useStore();
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, l) => s + l.price * l.quantity, 0);
  const fee = cart.length ? 2.99 : 0;
  const total = subtotal + fee;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Your cart</SheetTitle>
          {cartRestaurantName && (
            <p className="text-sm text-muted-foreground">From {cartRestaurantName}</p>
          )}
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
            <ShoppingBag className="h-12 w-12 opacity-30" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.map((line) => (
                <div key={line.id} className="flex gap-3 p-3 rounded-2xl bg-muted/50">
                  <img src={line.image} alt={line.name} loading="lazy" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{line.name}</div>
                    <div className="text-sm text-muted-foreground">${line.price.toFixed(2)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(line.id, line.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{line.quantity}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(line.id, line.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => updateQty(line.id, 0)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground"><span>Delivery fee</span><span>${fee.toFixed(2)}</span></div>
              <div className="flex justify-between font-display text-xl font-bold pt-2 border-t"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <Button variant="hero" size="lg" className="w-full mt-3" onClick={() => { onOpenChange(false); navigate("/checkout"); }}>
                Checkout
              </Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={clearCart}>Clear cart</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
