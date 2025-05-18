"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/context/LoginContext";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { FaQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  title: string;
  description: string;
  yearlyPrice?: number;
  monthlyPrice?: number;
  yearlyPriceId?: string;
  monthlyPriceId?: string;
  color: string;
  features: Feature[];
}

export default function SelectPlanComponent({
  gameMasterPlan,
}: {
  gameMasterPlan: {
    monthlyPrice?: number;
    yearlyPrice?: number;
    monthlyPriceId?: string;
    yearlyPriceId?: string;
  };
}) {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { isLoggedIn } = useLogin();
  const router = useRouter();

  const plans: Plan[] = [
    {
      title: "Free",
      description: "Get started with character generation",
      yearlyPrice: 0,
      monthlyPrice: 0,
      yearlyPriceId: "",
      monthlyPriceId: "",
      color: "bg-gray-800 text-white",
      features: [
        { text: "Generate character art", included: true },
        { text: "Generate campaigns", included: false },
        { text: "Generate maps", included: false },
      ],
    },
    {
      title: "Game Master",
      description: "Full access to all generation features",
      yearlyPrice: gameMasterPlan.yearlyPrice,
      monthlyPrice: gameMasterPlan.monthlyPrice,
      yearlyPriceId: gameMasterPlan.yearlyPriceId!,
      monthlyPriceId: gameMasterPlan.monthlyPriceId!,
      color: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
      features: [
        { text: "Generate character art", included: true },
        { text: "Generate campaigns", included: true },
        { text: "Generate maps", included: true },
      ],
    },
  ];

  const handleGetAccess = (plan: Plan) => {
    if (plan.title === "Free") {
      router.push("/dashboard");
      return;
    }

    const route = isLoggedIn ? "/checkout" : "/expert-signup";
    if (isLoggedIn) {
      const planData = {
        ...plan,
        price: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
        priceId: isYearly ? plan.yearlyPriceId : plan.monthlyPriceId,
        interval: isYearly ? "yearly" : "monthly",
      };
      router.push(`${route}?plan=${encodeURIComponent(JSON.stringify(planData))}`);
    } else {
      router.push(route);
    }
  };

  const handleNextStep = () => {
    const plan = plans.find(p => p.title === selectedPlan);
    if (plan) handleGetAccess(plan);
  };

  return (
    <main className="min-h-screen bg-[#0e1826]">
      <div className="relative flex h-screen">
        <div className="w-full md:w-1/2 overflow-auto flex items-center">
          <div className="w-full flex flex-col p-8 md:p-12 lg:p-16">
            <div className="max-w-2xl mx-auto w-full">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Select Tier</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPlan(plan.title)}
                    className={`flex flex-col p-6 rounded-xl border-2 ${
                      selectedPlan === plan.title
                        ? "border-purple-500 bg-[#1a1f2e]"
                        : "border-blue-500/30 bg-[#1a1f2e]"
                    } hover:border-opacity-100 transition-all duration-300 cursor-pointer`}
                  >
                    <div className="mb-4">
                      {plan.title === "Game Master" ? (
                        <div className="w-8 h-8 mb-2">
                          <FaQuestionCircle className="w-full h-full text-purple-500" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 mb-2">
                          <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500">
                            <path
                              fill="currentColor"
                              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            />
                          </svg>
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-white mb-1">{plan.title}</h2>
                      <p className="text-sm text-gray-400">{plan.description}</p>
                    </div>
                    <div className="text-2xl font-bold text-white mb-4">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-sm font-normal text-gray-400">/month</span>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm">
                          {feature.included ? (
                            <AiFillCheckCircle className="w-5 h-5 mr-2 text-green-500" />
                          ) : (
                            <AiFillCloseCircle className="w-5 h-5 mr-2 text-red-500" />
                          )}
                          <span
                            className={`${
                              feature.included ? "text-gray-300" : "text-gray-500 line-through"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${!isYearly ? "text-white" : "text-gray-400"}`}>
                    Monthly
                  </span>
                  <button
                    onClick={() => setIsYearly(!isYearly)}
                    className="relative w-12 h-6 rounded-full bg-gray-700"
                  >
                    <div
                      className={`absolute w-4 h-4 rounded-full bg-white top-1 transition-all duration-300 ${
                        isYearly ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${isYearly ? "text-white" : "text-gray-400"}`}>
                    Annual
                  </span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedPlan}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 
                    ${
                      selectedPlan
                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-[#1a1f2e] to-[#0e1826]">
          <motion.img
            src="/ForgeLabsLogo.png"
            alt="Forge Lab Logo"
            width={600}
            height={500}
            className="object-contain"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </main>
  );
}
