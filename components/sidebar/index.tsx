'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCredits } from './user-credits';
import { Navigation } from './navigation';
import { LogoutButton } from './logoutButton';
import { useSession } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';


export function Sidebar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
      
    if (!session?.user) {
      return null;
    }
  
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
  
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white border-r border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="font-bold">Adeekt</span>
              </Link>
            </div>
            <div className="flex justify-around p-4 border-b border-slate-800">
              <UserCredits />
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
        </div>
  
        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </>
    );
  } 