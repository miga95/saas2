'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PlusCircle,
  FolderOpen,
  UserCircle2,
  CreditCard,
  User,
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    {
      href: '/create',
      icon: PlusCircle,
      label: 'Create',
    },
    {
      href: '/projects',
      icon: FolderOpen,
      label: 'Projects',
    },
    {
      href: '/pricing',
      icon: CreditCard,
      label: 'Pricing',
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
    }
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
            pathname.includes(link.href)
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
          {link.badge && (
            <span className="ml-auto text-[10px] font-medium bg-purple-600 px-1.5 py-0.5 rounded">
              {link.badge}
            </span>
          )}
        </Link>
      ))}
    </>
  );
} 