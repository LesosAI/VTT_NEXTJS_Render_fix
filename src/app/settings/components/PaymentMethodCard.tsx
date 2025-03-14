'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogin } from '@/context/LoginContext'

interface PaymentMethod {
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

export default function PaymentMethodCard() {
  const { username } = useLogin()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false)

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

    if (username) {
      fetchPaymentMethod();
    }
  }, [username]);

  return (
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
  )
} 