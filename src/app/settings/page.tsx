'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import SubscriptionCard from './components/SubscriptionCard'
import PaymentMethodCard from './components/PaymentMethodCard'
import PlanComparisonCard from './components/PlanComparisonCard'

export default function SettingsPage() {
  const [isYearly, setIsYearly] = useState<boolean>(false)

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
            <SubscriptionCard />
            <PaymentMethodCard />
          </div>

          <PlanComparisonCard isYearly={isYearly} setIsYearly={setIsYearly} />
        </div>
      </div>
    </div>
  )
}