'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface PlanComparisonCardProps {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
}

const plans = [
  { 
    name: 'Basic', 
    monthlyPrice: '$29', 
    yearlyPrice: '$290',
    features: ['500 AI Calls/month', '1 Team Member', 'Basic Analytics', 'Email Support']
  },
  { 
    name: 'Pro', 
    monthlyPrice: '$99', 
    yearlyPrice: '$990',
    features: ['2,000 AI Calls/month', '5 Team Members', 'Advanced Analytics', 'Priority Support', 'API Access']
  },
  { 
    name: 'Agency', 
    monthlyPrice: '$299', 
    yearlyPrice: '$2,990',
    features: ['10,000 AI Calls/month', '15 Team Members', 'Custom Analytics', '24/7 Support', 'API Access', 'White Labeling']
  },
  { 
    name: 'Enterprise', 
    monthlyPrice: 'Custom', 
    yearlyPrice: 'Custom',
    features: ['Unlimited AI Calls', 'Unlimited Team Members', 'Custom Analytics', 'Dedicated Account Manager', 'API Access', 'White Labeling', 'On-Premise Deployment']
  },
]

export default function PlanComparisonCard({ isYearly, setIsYearly }: PlanComparisonCardProps) {
  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Plan Comparison</CardTitle>
          <CardDescription>Compare the features of our different plans</CardDescription>
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="billing-cycle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-cycle">Bill yearly (save 20%)</Label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  {plans.map((plan) => (
                    <TableHead key={plan.name} className="text-center">
                      <div className="font-bold">{plan.name}</div>
                      <div className="text-sm font-normal text-gray-500">
                        {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        <span className="text-xs">/{isYearly ? 'year' : 'month'}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans[3].features.map((feature) => (
                  <TableRow key={feature}>
                    <TableCell className="font-medium">{feature}</TableCell>
                    {plans.map((plan) => (
                      <TableCell key={`${plan.name}-${feature}`} className="text-center">
                        {plan.features.includes(feature) ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => window.location.href = '/select-plan'}
          >
            Upgrade Your Plan
          </Button>
          <p className="text-sm text-gray-500 text-center">
            All plans include unlimited projects and team messaging
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 