'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCredits } from './user-credits';
import { Navigation } from './navigation';
import { UserProfile } from './user-profile';
import { useUser } from '@/hooks/use-user';

export function SidebarClient() {
  const { data: user, isLoading } = useUser();

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white border-r border-slate-800">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-bold">Creatify</span>
        </Link>
      </div>

      <UserProfile 
        userName={user?.name}
        userEmail={user?.email}
      />

      <div className="flex-1 p-2 space-y-1">
        <UserCredits credits={user?.credits || 0} />
        <Navigation />
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex justify-end">
          <Link href="/pricing">
            <Button size="sm" variant="outline" className="text-xs">
              Upgrade
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 