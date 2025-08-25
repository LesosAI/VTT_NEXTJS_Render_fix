"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, CalendarIcon, CreditCardIcon, UserIcon } from "@heroicons/react/24/outline";

interface UserDetails {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_verified: boolean;
  is_subaccount: boolean;
  stripe_customer_id: string | null;
  parent_username: string | null;
  statistics: {
    characters_created: number;
    maps_created: number;
    campaigns_created: number;
  };
  subscription: {
    id: number;
    stripe_subscription_id: string;
    status: string;
    plan: {
      id: number;
      name: string;
      price: number;
      interval: string;
    };
    current_period_start: string;
    current_period_end: string;
    usage_count: number;
    created_at: string;
    updated_at: string;
  } | null;
}

interface UserDetailModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string; // Add admin email for authentication
}

export default function UserDetailModal({ userId, isOpen, onClose, adminEmail }: UserDetailModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userId}/details?email=${encodeURIComponent(adminEmail)}`
      );
      const data = await response.json();
      
      if (data.success) {
        setUserDetails(data.user);
      } else {
        setError(data.error || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f2e] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
          <h2 className="text-2xl font-bold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#3a3f4e] rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">
              <p>{error}</p>
            </div>
          ) : userDetails ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-[#2a2f3e] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Full Name</label>
                    <p className="text-white">
                      {userDetails.first_name && userDetails.last_name
                        ? `${userDetails.first_name} ${userDetails.last_name}`
                        : "Not provided"
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Username</label>
                    <p className="text-white">{userDetails.username}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{userDetails.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">User ID</label>
                    <p className="text-white">{userDetails.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Account Status</label>
                    <div className="flex gap-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userDetails.is_verified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {userDetails.is_verified ? "Verified" : "Unverified"}
                      </span>
                      {userDetails.is_subaccount && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Subaccount
                        </span>
                      )}
                    </div>
                  </div>
                  {userDetails.stripe_customer_id && (
                    <div>
                      <label className="text-sm text-gray-400">Stripe Customer ID</label>
                      <p className="text-white font-mono text-sm">{userDetails.stripe_customer_id}</p>
                    </div>
                  )}
                  {userDetails.parent_username && (
                    <div>
                      <label className="text-sm text-gray-400">Parent Account</label>
                      <p className="text-white">{userDetails.parent_username}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="bg-[#2a2f3e] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Usage Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userDetails.statistics.characters_created}</div>
                    <div className="text-sm text-gray-400">Characters Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{userDetails.statistics.maps_created}</div>
                    <div className="text-sm text-gray-400">Maps Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{userDetails.statistics.campaigns_created}</div>
                    <div className="text-sm text-gray-400">Campaigns Created</div>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="bg-[#2a2f3e] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5" />
                  Subscription Information
                </h3>
                {userDetails.subscription ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Plan</label>
                        <p className="text-white font-medium">{userDetails.subscription.plan.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userDetails.subscription.status === 'active'
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {userDetails.subscription.status}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Price</label>
                        <p className="text-white">${userDetails.subscription.plan.price} / {userDetails.subscription.plan.interval}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Usage Count</label>
                        <p className="text-white">{userDetails.subscription.usage_count}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Period Start</label>
                        <p className="text-white flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(userDetails.subscription.current_period_start).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Period End</label>
                        <p className="text-white flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(userDetails.subscription.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Subscription ID</label>
                        <p className="text-white font-mono text-sm">{userDetails.subscription.stripe_subscription_id}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Created</label>
                        <p className="text-white">{new Date(userDetails.subscription.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No active subscription</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
