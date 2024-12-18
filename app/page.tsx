
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getAuthSession();  
  if (!session) {
    redirect('/auth/signin');
  }
  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto p-6">
          <div className="space-y-2 pt-10">
            <h1 className="text-3xl font-bold text-center">Bienvenue sur AI Studio</h1>
            <p className="text-muted-foreground text-center">
              Créez des vidéos avec des avatars IA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}