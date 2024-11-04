'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Paintbrush } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === 'authenticated') {
    redirect('/');
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-2">
            <Paintbrush className="w-10 h-10 text-violet-500" />
            <h1 className="text-3xl font-bold text-white">AI Studio</h1>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-white">Welcome</h2>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}