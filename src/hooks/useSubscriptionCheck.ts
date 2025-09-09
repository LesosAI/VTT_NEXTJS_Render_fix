import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/context/LoginContext';

interface Subscription {
  status: string;
  plan: {
    name: string;
    description: string;
    price: number;
    interval: string;
    usage_limit: number | null;
  };
  usage_count: number;
  current_period_start: string;
  current_period_end: string;
}

export const useSubscriptionCheck = (requiredPlan: 'Game Master' | 'Game Master Monthly' | 'Game Master Yearly' = 'Game Master') => {
  const { username } = useLogin();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!username) {
        console.warn('[SubscriptionCheck] No username found. Skipping subscription check.');
        setLoading(false);
        return;
      }

      // Backend admin check bypass
      try {
        const adminUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/check-auth?email=${encodeURIComponent(username)}`;
        const adminRes = await fetch(adminUrl);
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          if (adminData?.authenticated && adminData?.admin) {
            console.log(`[SubscriptionCheck] Backend admin verified for ${username}. Granting Game Master access.`);
            setHasAccess(true);
            setSubscription({
              status: 'active',
              plan: {
                name: requiredPlan,
                description: 'Admin bypass plan (backend verified)',
                price: 0,
                interval: 'month',
                usage_limit: null,
              },
              usage_count: 0,
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('[SubscriptionCheck] Backend admin check failed, continuing with normal checks:', e);
      }

      // Admin bypass: allow full access without subscription checks
      const configuredAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const bypassEmails = [
        'admin@forgelab.pro',
        configuredAdminEmail || undefined,
      ]
        .filter(Boolean)
        .map((e) => String(e).toLowerCase());

      if (bypassEmails.includes(username.toLowerCase())) {
        console.log(`[SubscriptionCheck] Admin bypass activated for ${username}. Granting Game Master access.`);
        setHasAccess(true);
        setSubscription({
          status: 'active',
          plan: {
            name: requiredPlan,
            description: 'Admin bypass plan',
            price: 0,
            interval: 'month',
            usage_limit: null,
          },
          usage_count: 0,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        setLoading(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/subscription`;
        console.log('[SubscriptionCheck] Checking subscription at:', url);
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          console.log('[SubscriptionCheck] Subscription response:', data);
          setSubscription(data);
          
          // Check if user has access to Game Master features
          const planName = data.plan?.name;
          const hasGameMasterAccess = planName && (
            planName === 'Game Master' || 
            planName === 'Game Master Monthly' || 
            planName === 'Game Master Yearly'
          );
          
          setHasAccess(hasGameMasterAccess);
          
          if (!hasGameMasterAccess) {
            console.log('[SubscriptionCheck] User does not have Game Master access, redirecting to /dashboard');
            router.push('/dashboard');
          }
        } else {
          // No subscription found, redirect to dashboard
          console.warn('[SubscriptionCheck] Subscription check failed with status:', response.status, 'Redirecting to /dashboard');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('[SubscriptionCheck] Error checking subscription:', error);
        // On error, redirect to dashboard
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [username, router]);

  return { subscription, loading, hasAccess };
}; 