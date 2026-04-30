import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore, UserRole } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Utensils, Bike, Store } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";

const ROLES: { value: UserRole; label: string; icon: typeof Utensils; desc: string }[] = [
  { value: "consumer", label: "Consumer", icon: Utensils, desc: "Order & reserve" },
  { value: "partner", label: "Restaurant Partner", icon: Store, desc: "Manage your kitchen" },
  { value: "courier", label: "Delivery Courier", icon: Bike, desc: "Deliver orders" },
];

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("consumer");

  const handle = (mode: "in" | "up") => (e: React.FormEvent) => {
    e.preventDefault();
    login(name || email.split("@")[0] || "Friend", email, role);
    navigate(role === "partner" ? "/merchant" : "/");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/80 via-foreground/40 to-primary/40" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-hero-gradient grid place-items-center"><Sparkles className="h-5 w-5" /></div>
            <span className="font-display text-2xl font-bold">Feastly</span>
          </div>
          <div className="space-y-4 max-w-md">
            <h2 className="font-display text-5xl font-bold leading-tight">A taste of everything, in one place.</h2>
            <p className="text-primary-foreground/80">Order, reserve, review — and get rewarded for every bite.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-warm-gradient">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="font-display text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-6">Sign in to keep your cravings on track.</p>

          <Tabs defaultValue="in">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="in">Sign in</TabsTrigger>
              <TabsTrigger value="up">Sign up</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <Label className="mb-2 block">I'm a…</Label>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      role === r.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <r.icon className={`h-5 w-5 mb-1 ${role === r.value ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-xs font-semibold">{r.label}</div>
                    <div className="text-[10px] text-muted-foreground">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <TabsContent value="in">
              <form onSubmit={handle("in")} className="space-y-3">
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@feast.ly" /></div>
                <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button variant="hero" size="lg" className="w-full mt-2" type="submit">Sign in</Button>
              </form>
            </TabsContent>

            <TabsContent value="up">
              <form onSubmit={handle("up")} className="space-y-3">
                <div><Label>Name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" /></div>
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@feast.ly" /></div>
                <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button variant="hero" size="lg" className="w-full mt-2" type="submit">Create account</Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center mt-6">Demo mode — no real authentication. Roles can be switched anytime.</p>
        </motion.div>
      </div>
    </div>
  );
}
