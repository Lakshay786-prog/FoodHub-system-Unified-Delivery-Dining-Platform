import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useStore } from "@/store/useStore";
import { RESTAURANTS } from "@/data/restaurants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";

export default function Reviews() {
  const [params] = useSearchParams();
  const presetId = params.get("restaurantId") || "";
  const presetName = params.get("restaurantName") || "";
  const { reviews, rewardPoints, addReview } = useStore();

  const [restaurantId, setRestaurantId] = useState(presetId || RESTAURANTS[0].id);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const submit = () => {
    if (text.trim().length < 10) return toast.error("Tell us a bit more (10+ chars)");
    const restaurant = RESTAURANTS.find((r) => r.id === restaurantId)!;
    const r = addReview({
      restaurantId: restaurant.id,
      restaurantName: presetName || restaurant.name,
      rating,
      text: text.trim(),
    });
    toast.success(`+${r.points} points earned!`);
    setText("");
  };

  const len = text.trim().length;
  const previewPts = (() => {
    let p = 10;
    if (len > 80) p += 15;
    if (len > 200) p += 25;
    if (rating >= 4) p += 5;
    return p;
  })();

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <div className="container py-10 max-w-4xl">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold">Reviews</h1>
            <p className="text-muted-foreground mt-1">Earn reward points for thoughtful, detailed reviews.</p>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-hero-gradient text-primary-foreground px-5 py-3 rounded-2xl shadow-elegant flex items-center gap-3"
          >
            <Trophy className="h-6 w-6" />
            <div>
              <div className="text-xs opacity-90">Reward balance</div>
              <div className="font-display text-2xl font-bold">{rewardPoints} pts</div>
            </div>
          </motion.div>
        </div>

        <div className="bg-card p-6 rounded-3xl shadow-soft space-y-4 mb-8">
          <h2 className="font-display text-2xl font-bold">Write a review</h2>
          <div>
            <Label>Restaurant</Label>
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="h-10 w-full rounded-full border border-input bg-background px-4 text-sm mt-1"
            >
              {RESTAURANTS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} className="p-1">
                  <Star className={`h-7 w-7 ${n <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Your experience</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What stood out? Service, dishes, ambience…"
              rows={5}
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{len}/1000 characters</span>
              <span className="flex items-center gap-1 text-primary font-semibold">
                <Sparkles className="h-3 w-3" /> +{previewPts} pts
              </span>
            </div>
          </div>

          <Button variant="hero" size="lg" onClick={submit} className="w-full">Submit review</Button>
        </div>

        <h2 className="font-display text-2xl font-bold mb-4">Your review history</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card p-5 rounded-3xl shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-display text-lg font-bold">{r.restaurantName}</div>
                  <div className="flex items-center gap-1 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{r.text}</p>
                <div className="flex justify-between items-center mt-3 text-xs">
                  <span className="text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-primary flex items-center gap-1"><Sparkles className="h-3 w-3" /> +{r.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
