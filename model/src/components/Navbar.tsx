import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, Sparkles, User } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/70"}`;

export default function Navbar() {
  const { user, logout, setRole, cart, rewardPoints } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = cart.reduce((s, l) => s + l.quantity, 0);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="h-9 w-9 rounded-2xl bg-hero-gradient grid place-items-center shadow-elegant"
          >
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display text-2xl font-bold tracking-tight">Feastly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>Discover</NavLink>
          <NavLink to="/orders" className={navLinkClass}>Orders</NavLink>
          <NavLink to="/reservations" className={navLinkClass}>Reservations</NavLink>
          <NavLink to="/reviews" className={navLinkClass}>Reviews</NavLink>
          {user?.role === "partner" && (
            <NavLink to="/merchant" className={navLinkClass}>Merchant</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-muted">
            <MapPin className="h-3.5 w-3.5" />
            <span>SoHo, NYC</span>
          </div>

          {user && rewardPoints > 0 && (
            <Badge variant="secondary" className="hidden sm:inline-flex gap-1">
              <Sparkles className="h-3 w-3 text-accent" />
              {rewardPoints} pts
            </Badge>
          )}

          <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                {cartCount}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-xs text-muted-foreground">Signed in as</div>
                  <div className="font-medium">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Switch role</DropdownMenuLabel>
                {(["consumer", "partner", "courier"] as const).map((r) => (
                  <DropdownMenuItem key={r} onClick={() => setRole(r)} className="capitalize">
                    {r} {user.role === r && "✓"}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          )}
        </div>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
