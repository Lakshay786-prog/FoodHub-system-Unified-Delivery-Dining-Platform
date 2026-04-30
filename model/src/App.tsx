import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const Discover = lazy(() => import("./pages/Discover"));
const RestaurantDetail = lazy(() => import("./pages/RestaurantDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Reserve = lazy(() => import("./pages/Reserve"));
const Reservations = lazy(() => import("./pages/Reservations"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Auth = lazy(() => import("./pages/Auth"));
const Merchant = lazy(() => import("./pages/Merchant"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen grid place-items-center bg-warm-gradient">
    <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderTracking />} />
            <Route path="/reserve/:id" element={<Reserve />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/merchant" element={<Merchant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
