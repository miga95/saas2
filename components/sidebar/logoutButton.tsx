'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function LogoutButton() {

  return (
    <div>
      <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </Button>
    </div>
  );
} 