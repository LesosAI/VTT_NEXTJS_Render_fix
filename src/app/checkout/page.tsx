"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/context/LoginContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ModernLoader } from "@/components/ModernLoader";

// Load stripe outside of components render to avoid recreating stripe object on every render
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(
  "pk_test_51PlsaF02khdf3R0A0ZEqrnsXvbZLZbSlGJUjwbv0PyTIkwJG2HgQgo6Fc5bBLSudVxWjMlkFRQVV4lraDO0u8jgR00PQgzovlB"
);

// Add TypeScript interfaces
interface Plan {
  title: string;
  price: number;
  priceId: string;
  description: string;
}

interface CheckoutFormProps {
  plan: Plan;
  username: string;
}

const CheckoutForm = ({ plan, username }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        type: "card",
      },
    });

    if (error) {
      setError(error.message || "Payment failed");
      setIsLoading(false);
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              plan_id: plan.title,
              price_id: plan.priceId,
              payment_method_id: paymentMethod.id,
            }),
          }
        );
        const data = await response.json();

        // Handle payment intent confirmation if needed
        if (data.status === "requires_action") {
          const { error } = await stripe.confirmCardPayment(
            data.payment_intent_client_secret
          );
          if (error) {
            setError(error.message || "Payment confirmation failed");
            return;
          }
        }

        if (data.message === "Subscription created successfully") {
          router.push("/dashboard");
        } else {
          setError("Subscription creation failed. Please try again.");
        }
      } catch (err) {
        setError("An error occurred. Please try again later.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence>
        {isLoading && <ModernLoader />}
      </AnimatePresence>
      <div>
        <label className="block text-sm font-medium text-white/80">
          Payment method
        </label>
        <div className="mt-2 flex items-center space-x-2 border border-white/20 rounded-lg p-4 bg-[#0e1826]">
          <CreditCard className="w-5 h-5 mr-2 text-white" />
          <span className="text-white">Card</span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-white/80">
          Card information
        </label>
        <div className="mt-2">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  lineHeight: "45px",
                  "::placeholder": {
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
              classes: {
                base: "block w-full rounded-md border border-white/20 px-3 bg-[#0e1826]",
              },
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80">
          Cardholder name
        </label>
        <input
          type="text"
          placeholder="Bertrand Bruandet"
          className="mt-1 block w-full rounded-md border border-white/20 px-3 py-2 h-[45px] bg-[#0e1826] text-white placeholder-white/50"
        />
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-white hover:bg-white/90 text-[#0e1826] font-semibold py-3 text-lg rounded-md transition-all duration-150 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? "Processing..." : "Subscribe"}
      </button>
    </form>
  );
};

// Convert main component to server component
export default function Checkout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { username } = useLogin();
  const plan = JSON.parse(searchParams.get("plan") || "null");

  useEffect(() => {
    if (!plan) {
      router.push("/select-plan");
    }
  }, [plan, router]);

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-row-reverse bg-[#0e1826]">
      {/* Right side - Dark gradient with pricing */}
      <div className="w-[60%] bg-gradient-to-b from-[#755FF8] to-[#8470FF] p-12 text-white flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full mb-4" />
            <span className="text-2xl font-semibold">VTT Workshop</span>
          </div>

          <div className="mb-8">
            <div className="text-sm mb-2">Subscribe to {plan.title}</div>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-bold">US${plan.price}</span>
              <span className="text-sm ml-1 opacity-80">
                /{plan.description.includes("yearly") ? "year" : "month"}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="w-1/2 text-left">{plan.title}</span>
              <span className="w-1/2 text-right">US${plan.price}</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span className="w-1/2 text-left">
                Billed{" "}
                {plan.description.includes("yearly") ? "yearly" : "monthly"}
              </span>
              <span className="w-1/2 text-right"></span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="w-1/2 text-left">Subtotal</span>
              <span className="w-1/2 text-right">US${plan.price}</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span className="w-1/2 text-left">Tax</span>
              <span className="w-1/2 text-right">US$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/10 font-medium">
              <span className="w-1/2 text-left">Total due today</span>
              <span className="w-1/2 text-right">US${plan.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left side - Payment form */}
      <div className="flex-1 bg-[#0e1826] flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} username={username} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
