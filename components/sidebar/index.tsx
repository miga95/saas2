import { getAuthSession } from '@/lib/auth';
import { SidebarClient } from './sidebar-client';

export async function Sidebar() {
  const session = await getAuthSession();

  if (!session?.user) {
    return null;
  }

  return <SidebarClient />;
}

export * from './sidebar-client';
export * from './navigation';
export * from './user-profile';
export * from './user-credits'; 