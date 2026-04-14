"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Lock } from "lucide-react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { user, profile, loading: authLoading } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [phone, setPhone] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const subtotal = getTotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  // ✅ FIX 1: redirect inside useEffect (NO SSR crash)
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push("/cart");
    }
  }, [items, router, isSuccess]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (user && profile) {
      if (profile.address && typeof profile.address === "object") {
        setAddress((prev) => ({ ...prev, ...profile.address }));
      }
      if (profile.phone) setPhone(profile.phone);
    }
  }, [user, profile, authLoading]);

  const isRazorpayConfigured = 
    !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && 
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID !== "your_razorpay_key_id" &&
    !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.startsWith("rzp_test_placeholder");

  const saveOrderToDb = async (paymentData: {
    order_id: string;
    payment_id: string;
    signature: string;
  }) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("Not authenticated");

    const orderNumber = `SC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const orderItems = items.map((item) => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: currentUser.id,
        order_number: orderNumber,
        status: "confirmed",
        items: orderItems,
        subtotal,
        shipping_fee: shipping,
        total,
        shipping_address: {
          ...address,
          name: profile?.full_name || currentUser.email,
          postal_code: address.pincode,
          phone: phone,
        },
        payment_status: "paid",
        razorpay_order_id: paymentData.order_id,
        razorpay_payment_id: paymentData.payment_id,
        razorpay_signature: paymentData.signature,
      })
      .select()
      .single();

    if (error) throw error;

    setIsSuccess(true);
    clearCart();
    toast.success("Order placed successfully!");
    router.push(`/orders/${order.id}`);
  };

  const handlePayment = async () => {
    if (!address.line1 || !address.city || !address.state || !address.pincode || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // TEST MODE: Bypass Razorpay if API Key is missing
      if (!isRazorpayConfigured) {
        toast.loading("Simulating payment...", { duration: 1500 });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await saveOrderToDb({
          order_id: `test_order_${Date.now()}`,
          payment_id: `test_pay_${Date.now()}`,
          signature: "mock_signature",
        });
        setLoading(false);
        return;
      }

      // REAL RAZORPAY FLOW
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const { data, error } = await res.json();
      if (!data?.orderId) throw new Error(error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "Strokes of Craft",
        description: "Handmade Crochet Products",
        order_id: data.orderId,

        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.verified) throw new Error("Payment verification failed");

            await saveOrderToDb({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          } catch (err: any) {
            toast.error(err.message || "Something went wrong");
          }
        },

        prefill: { email: useAuthStore.getState().user?.email, contact: phone },
        theme: { color: "#db2777" },
      };

      if (typeof window !== "undefined") {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  // ✅ prevent SSR crash
  if (items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">
              Shipping Address
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className="input-field"
                  placeholder="House/Flat number, Street"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  className="input-field"
                  placeholder="Area, Landmark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <div className="w-12 h-12 rounded-lg bg-cream-100 overflow-hidden relative shrink-0">
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=100"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-display font-semibold text-lg mb-6">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal ({items.length} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {loading ? "Processing..." : isRazorpayConfigured ? `Pay ${formatPrice(total)}` : "Place Test Order"}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4" />
            {isRazorpayConfigured ? "Secured by Razorpay" : "Test Mode Enabled (No Keys Found)"}
          </div>
        </div>
      </div>

    </div>
  );
}