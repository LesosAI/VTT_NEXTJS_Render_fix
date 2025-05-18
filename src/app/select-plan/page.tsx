import Stripe from "stripe";
import { redirect } from "next/navigation";
import SelectPlanComponent from "./SelectPlanComponent";


const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export default async function SelectPlanPage() {
  const products = await stripe.products.list({ active: true });
  const gameMaster = products.data.find(p => p.name === "Game Master");

  if (!gameMaster) {
    return <div className="text-white p-4">Failed to load pricing plan.</div>;
  }

  const prices = await stripe.prices.list({ product: gameMaster.id });

  let monthlyPrice: number | undefined;
  let monthlyPriceId: string | undefined;
  let yearlyPrice: number | undefined;
  let yearlyPriceId: string | undefined;

  prices.data.forEach(price => {
    if (price.recurring?.interval === "month") {
      monthlyPrice = price.unit_amount! / 100;
      monthlyPriceId = price.id;
    } else if (price.recurring?.interval === "year") {
      yearlyPrice = price.unit_amount! / 100;
      yearlyPriceId = price.id;
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
}
