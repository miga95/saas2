import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCredits } from './user-credits';
import { Navigation } from './navigation';
import { LogoutButton } from './logoutButton';

export async function Sidebar() {
  const user = await getCurrentUser();
    
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white border-r border-slate-800">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="font-bold">Adeekt</span>
        </Link>
      </div>
      <div className="flex justify-around p-4 border-b border-slate-800">
          <UserCredits userCredits={user?.credits || 0} />
          <Link href="/pricing">
            <Button size="sm" variant="outline" className="text-xs">
              Upgrade
            </Button>
          </Link>
    </div>
      <div className="flex-1 p-2 space-y-1">
        <Navigation />
        <LogoutButton />
      </div>
    </div>
  );
} 