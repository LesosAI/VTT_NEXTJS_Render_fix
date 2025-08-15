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
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}/subscription`
        );

        if (response.ok) {
          const data = await response.json();
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
            console.log('User does not have Game Master access, redirecting to dashboard');
            router.push('/dashboard');
          }
        } else {
          // No subscription found, redirect to dashboard
          console.log('No subscription found, redirecting to dashboard');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
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