'use client';

import { useAuth } from '@/hooks/use-auth';

export default function ProfilePage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {/* Rest of your profile page content */}
    </div>
  );
}