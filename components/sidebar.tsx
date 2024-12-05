'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  PlusCircle, 
  FolderOpen, 
  Package, 
  UserCircle2, 
  GraduationCap,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-60 bg-slate-950 border-r border-slate-800 flex flex-col h-screen">
      {/* Logo et header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <svg viewBox="0 0 24 24" className="text-white">
              {/* Logo SVG ici */}
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-lg">creatify</span>
          <span className="text-xs text-slate-400">studio</span>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white">
            T
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">team Adeekt</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-xs text-slate-400">team.adeekt@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-2 space-y-1">
        <Link href="/create" 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                pathname.includes('/create') 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}>
          <PlusCircle className="h-4 w-4" />
          Create
        </Link>
        <Link href="/projects"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-900">
          <FolderOpen className="h-4 w-4" />
          Projects
        </Link>
        <Link href="/products"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-900">
          <Package className="h-4 w-4" />
          Products
        </Link>
        <Link href="/custom-avatars"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-900">
          <UserCircle2 className="h-4 w-4" />
          Custom Avatars
          <span className="ml-auto text-[10px] font-medium bg-purple-600 px-1.5 py-0.5 rounded">NEW</span>
        </Link>
        <Link href="/learning"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-900">
          <GraduationCap className="h-4 w-4" />
          Learning Center
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-[10px] text-white"></span>
              </div>
              <span className="text-sm">1950 credits</span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="text-xs">
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  );
}