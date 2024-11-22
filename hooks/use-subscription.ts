import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function fetchSubscriptionPortal() {
  const response = await fetch('/api/stripe/subscription/manage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch subscription portal');
  }
  
  return response.json();
}

export function useSubscription() {
  const queryClient = useQueryClient();

  const manageSubscriptionMutation = useMutation({
    mutationFn: fetchSubscriptionPortal,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  return {
    manageSubscription: () => manageSubscriptionMutation.mutate(),
    isLoading: manageSubscriptionMutation.isPending,
    error: manageSubscriptionMutation.error,
  };
}