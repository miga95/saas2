'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Paintbrush, 
  FolderKanban, 
  UserCircle, 
  Video, 
  Database,
  Settings,
  LogOut
} from 'lucide-react';

const routes = [
  {
    label: 'Create',
    icon: Paintbrush,
    href: '/create',
    color: 'text-violet-500',
  },
  {
    label: 'Projects',
    icon: FolderKanban,
    href: '/projects',
    color: 'text-pink-700',
  },
  {
    label: 'Profile',
    icon: UserCircle,
    href: '/profile',
    color: 'text-orange-700',
  },
  {
    label: 'Pricing',
    icon: UserCircle,
    href: '/pricing',
    color: 'text-orange-700',
  },
];

const createSubRoutes = [
  {
    label: 'AI UGC Creator',
    icon: Video,
    href: '/create/ugc',
    color: 'text-green-700',
  },
  {
    label: 'Product Fine-tuning',
    icon: Database,
    href: '/create/fine-tune',
    color: 'text-blue-700',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Paintbrush className="w-8 h-8 text-violet-500" />
          </div>
          <h1 className="text-2xl font-bold">
            AI Studio
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400',
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}

          {pathname.includes('/create') && (
            <div className="pl-4 pt-4 space-y-1">
              {createSubRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                    pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400',
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                    {route.label}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="px-3 py-2 space-y-2 border-t border-slate-800">
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
          onClick={() => {}}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5 mr-3 text-red-500" />
          Log out
        </Button>
      </div>
    </div>
  );
}