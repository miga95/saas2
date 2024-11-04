import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile/profile-form';
import { SubscriptionInfo } from '@/components/profile/subscription-info';
import prisma from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and subscription
        </p>
      </div>

      <div className="space-y-6">
        <ProfileForm user={user} />
        <SubscriptionInfo subscription={user.subscription} />
      </div>
    </div>
  );
}