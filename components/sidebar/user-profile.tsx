'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, User, LogOut } from 'lucide-react';

interface UserProfileProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function UserProfile({ userName, userEmail }: UserProfileProps) {
  return (
    <div className="p-4 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white">
          {userName?.[0] || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{userName || 'User'}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <span className="text-xs text-slate-400">{userEmail}</span>
        </div>
      </div>
    </div>
  );
} 