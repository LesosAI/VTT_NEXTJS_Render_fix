"use client";

import Topbar from "@/components/Topbar";
import { useLogin } from "@/context/LoginContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ModernLoader } from "@/components/ModernLoader";

export default function Plans() {
  const { username } = useLogin();
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPrices, setLoadingPrices] = useState(true); // loading state for prices
  const [gameMasterPrices, setGameMasterPrices] = useState<
    { price_id: string; amount: number; currency: string; interval: string }[]
  >([]);
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/subscription`
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentSubscription(data);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchSubscription();
    }
  }, [username]);

  // New useEffect: Fetch Game Master prices from your new API
  useEffect(() => {
    const fetchGameMasterPrices = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/game-master/prices`
        );
        if (res.ok) {
          const data = await res.json();
          setGameMasterPrices(data.prices);
        } else {
          console.error("Failed to fetch Game Master prices");
        }
      } catch (err) {
        console.error("Error fetching Game Master prices:", err);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchGameMasterPrices();
  }, []);

  // Helper to get price info by interval
  const getPriceByInterval = (interval: string) =>
    gameMasterPrices.find((p) => p.interval === interval);

  // Updated handlePlanAction to dynamically use price IDs
  const handlePlanAction = async (plan: {
    stripePlanName: string;
    price: string;
    description: string;
    name: string;
    isCurrent: boolean;
  }) => {
    if (
      !confirm(
        `Are you sure you want to ${plan.isCurrent ? "cancel" : "switch to"
        } the ${plan.name} plan?`
      )
    ) {
      return;
    }

    try {
      if (plan.name === "Player" && !plan.isCurrent) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/subscription/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to downgrade plan");
        }

        window.location.reload();
      } else if (plan.name === "Game Master" && !plan.isCurrent) {
        const priceObj = gameMasterPrices.find(
          (p) => p.interval === (isAnnual ? "year" : "month")
        );
        if (!priceObj) {
          alert("Price info not available");
          return;
        }

        const checkoutPlan = {
          title: plan.stripePlanName,
          price: priceObj.amount,
          priceId: priceObj.price_id,
          description: plan.description,
        };

        router.push(
          `/checkout?plan=${encodeURIComponent(JSON.stringify(checkoutPlan))}`
        );
        return;
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      alert(error instanceof Error ? error.message : "Failed to update plan");
    }
  };

  const plans: Array<{
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    isCurrent: boolean;
    stripePlanName: string;
  }> = [
      {
        name: "Player",
        price: "$0",
        period: "",
        description: "Ideal for players starting out with the platform.",
        features: ["Generate character art", "Export character art"],
        buttonText:
          currentSubscription?.plan?.name === "Free" || !currentSubscription
            ? "Current Plan"
            : "Downgrade",
        isCurrent:
          currentSubscription?.plan?.name === "Free" || !currentSubscription,
        stripePlanName: "Free",
      },
      {
        name: "Game Master",
        price:
          loadingPrices
            ? "Loading..."
            : `$${getPriceByInterval(isAnnual ? "year" : "month")?.amount.toFixed(2) ?? "N/A"
            }`,
        period: isAnnual ? "/ year" : "/ month",
        description: `Ideal for game masters that need to generate campaigns. ${isAnnual ? "Save 17% with annual billing!" : ""
          }`,
        features: [
          "All of player plan",
          "Generate campaigns",
          "Export campaigns",
          "Generate maps",
          "Export maps",
        ],
        buttonText:
          currentSubscription?.plan?.name ===
            (isAnnual ? "Game Master Yearly" : "Game Master Monthly")
            ? "Current Plan"
            : "Upgrade",
        isCurrent:
          currentSubscription?.plan?.name ===
          (isAnnual ? "Game Master Yearly" : "Game Master Monthly"),
        stripePlanName: isAnnual ? "Game Master Yearly" : "Game Master Monthly",
      },
    ];

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <Topbar />
      <AnimatePresence>{(loading || loadingPrices) && <ModernLoader />}</AnimatePresence>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold mb-6">Plans</h1>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className={`text-sm ${!isAnnual ? "text-white" : "text-gray-400"
                }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 bg-gray-700 rounded-full relative transition-colors"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${isAnnual ? "left-7" : "left-1"
                  }`}
              />
            </button>
            <span
              className={`text-sm ${isAnnual ? "text-white" : "text-gray-400"}`}
            >
              Annually
              <span className="ml-1 text-green-400 text-xs">Save 17%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="bg-[#2a2f3e] rounded-lg p-6 flex flex-col border border-gray-700"
              >
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <h2 className="text-lg font-semibold">{plan.name}</h2>
                  </div>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="flex items-baseline mb-6">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => !plan.isCurrent && handlePlanAction(plan)}
                  className={`w-full py-2 rounded-md text-sm font-medium ${plan.isCurrent
                    ? "bg-gray-700 text-gray-300 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 transition-colors"
                    }`}
                  disabled={plan.isCurrent || loadingPrices}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}