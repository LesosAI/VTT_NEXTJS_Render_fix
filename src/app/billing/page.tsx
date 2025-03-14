"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { useLogin } from "@/context/LoginContext";

interface BillingInfo {
  planName: string;
  price: string;
  billingInterval: string;
  billingAddress: string;
  renewalDate: string;
}

interface Invoice {
  id: string;
  date: string;
  plan: string;
  discount: boolean;
  amount: string;
  invoice_pdf?: string;
  number: string;
  status: string;
}

export default function Billing() {
  const { username } = useLogin();
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        // Fetch subscription details
        const subResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/subscription`
        );
        const subData = await subResponse.json();

        if (subResponse.ok) {
          setBillingInfo({
            planName: subData.plan.name,
            price: `$${subData.plan.price}`,
            billingInterval: subData.plan.interval,
            billingAddress: username, // You might want to fetch this from user profile
            renewalDate: new Date(
              subData.current_period_end
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          });

          // Fetch real invoice data
          const invoiceResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/invoices`
          );
          const invoiceData = await invoiceResponse.json();

          if (invoiceResponse.ok) {
            setInvoices(
              invoiceData.map((invoice: any) => ({
                id: invoice.id,
                date: new Date(invoice.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                plan: `1 × ${subData.plan.name} (at $${subData.plan.price} / ${subData.plan.interval})`,
                discount: false,
                amount: `$${invoice.amount_paid}`,
                invoice_pdf: invoice.invoice_pdf,
                number: invoice.number,
                status: invoice.status,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching billing data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchBillingData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] text-white">
        <Topbar />
        <div className="p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <Topbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          {/* Billing Section */}
          <div className="bg-[#2a2f3e] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Billing & Invoices</h2>
            <p className="text-gray-400 mb-6">
              This workspace's Plan is set to {billingInfo?.price} yearly and
              will renew on {billingInfo?.renewalDate}.
            </p>

            {/* Billing Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                Billing Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Billing Interval</span>
                  <span>{billingInfo?.billingInterval}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Billing Address</span>
                  <span>{billingInfo?.billingAddress}</span>
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Invoices</h3>
              <div className="grid grid-cols-5 text-sm text-gray-400 mb-2">
                <span>DATE</span>
                <span>PLAN</span>
                <span>DISCOUNT</span>
                <span>AMOUNT PAID</span>
                <span>DOWNLOAD</span>
              </div>
              {invoices.map((invoice, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 items-center py-3 border-t border-gray-700"
                >
                  <span>{invoice.date}</span>
                  <span>{invoice.plan}</span>
                  <span>{invoice.discount ? "Yes" : "No"}</span>
                  <span>{invoice.amount}</span>
                  <span>
                    {invoice.invoice_pdf && (
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Download PDF
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
