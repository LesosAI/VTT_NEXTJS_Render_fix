'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Package, AlertTriangle, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLogin } from '@/context/LoginContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Sidebar from '@/components/Sidebar'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

interface Plan {
  name: string;
  description: string;
  price: number;
  interval: string;
  usage_limit: number | null;
}

interface Subscription {
  subscription_id: number;
  status: string;
  plan: Plan;
  usage_count: number;
  current_period_start: string;
  current_period_end: string;
}

interface PaymentMethod {
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

interface PlanComparison {
  name: string;
  price: number;
  interval: string;
  features: string[];
  isCurrentPlan: boolean;
}

const availablePlans: PlanComparison[] = [
  {
    name: "Basic",
    price: 49,
    interval: "year",
    features: ["5 API calls/month", "Basic support", "1 user"],
    isCurrentPlan: false
  },
  {
    name: "Professional",
    price: 119,
    interval: "year",
    features: ["10 API calls/month", "Priority support", "3 users", "Advanced analytics"],
    isCurrentPlan: true
  },
  {
    name: "Enterprise",
    price: 299,
    interval: "year",
    features: ["Unlimited API calls", "24/7 support", "Unlimited users", "Custom features"],
    isCurrentPlan: false
  }
];

export function SettingsPage(): JSX.Element {
  const { username } = useLogin()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}/subscription`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch subscription data')
        }
        const subData = await response.json()
        setSubscription(subData)
      } catch (err) {
        setError('Failed to load subscription information')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchSubscription()
    }
  }, [username])

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/payment-method`);
        if (response.ok) {
          const data = await response.json();
          setPaymentMethod(data);
        }
      } catch (err) {
        console.error('Error fetching payment method:', err);
      }
    };

    if (username && subscription) {
      fetchPaymentMethod();
    }
  }, [username, subscription]);

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }
      
      alert('Subscription cancelled successfully');
      window.location.reload();
      
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="container mx-auto py-10 px-4">
          <motion.h1 
            className="text-4xl font-bold mb-8 text-purple-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Account Settings
          </motion.h1>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex"
            >
              <Card className="flex flex-col w-full">
                <CardHeader>
                  <CardTitle className="text-purple-700">Subscription Details</CardTitle>
                  <CardDescription>Your current subscription information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div className="text-red-600">{error}</div>
                  ) : subscription ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Plan:</span>
                        <span>{subscription.plan.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Price:</span>
                        <span>${subscription.plan.price}/{subscription.plan.interval}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Status:</span>
                        <span className={`capitalize ${
                          subscription.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {subscription.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Usage:</span>
                        <span>
                          {subscription.usage_count} / {subscription.plan.usage_limit ?? '∞'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Current Period Ends:</span>
                        <span>{new Date(subscription.current_period_end).toLocaleDateString()}</span>
                      </div>
                      {subscription.plan.description && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Plan Description:</span>
                          <span>{subscription.plan.description}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>No subscription data available</div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <Button 
                    variant="outline" 
                    className="text-purple-600 border-purple-600 hover:bg-purple-50"
                    onClick={() => window.location.href = '/select-plan'}
                  >
                    Change Plan
                  </Button>
                  {subscription && (
                    <Button 
                      variant="destructive"
                      onClick={handleCancelSubscription}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Canceling...' : 'Cancel Subscription'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>

            {/* Second card for payment method details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex"
            >
              <Card className="flex flex-col w-full">
                <CardHeader>
                  <CardTitle className="text-purple-700">Payment Method</CardTitle>
                  <CardDescription>Your current payment information</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {paymentMethod ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Card:</span>
                        <span>{paymentMethod.brand.toUpperCase()} ending in {paymentMethod.last4}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Expires:</span>
                        <span>{paymentMethod.exp_month}/{paymentMethod.exp_year}</span>
                      </div>
                    </div>
                  ) : (
                    <div>No payment method found</div>
                  )}
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button 
                    variant="outline" 
                    className="text-purple-600 border-purple-600 hover:bg-purple-50"
                    onClick={() => setShowUpdateCard(true)}
                  >
                    Update Payment Method
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage