import { redirect } from "next/navigation";
import SelectPlanComponent from "./SelectPlanComponent";

export default async function SelectPlanPage() {
  try {
    // Fetch prices from backend API instead of direct Stripe call
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/game-master/prices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pricing plans');
    }

    const data = await response.json();
    
    let monthlyPrice: number | undefined;
    let monthlyPriceId: string | undefined;
    let yearlyPrice: number | undefined;
    let yearlyPriceId: string | undefined;

    // Extract prices from backend response
    data.prices.forEach((price: any) => {
      if (price.interval === "month") {
        monthlyPrice = price.amount;
        monthlyPriceId = price.price_id;
      } else if (price.interval === "year") {
        yearlyPrice = price.amount;
        yearlyPriceId = price.price_id;
      }
    });

    return (
      <SelectPlanComponent
        gameMasterPlan={{
          monthlyPrice,
          yearlyPrice,
          monthlyPriceId,
          yearlyPriceId,
        }}
      />
    );
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return <div className="text-white p-4">Failed to load pricing plan.</div>;
  }
}
