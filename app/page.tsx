import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Video, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto p-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Bienvenue sur AI Studio</h1>
            <p className="text-muted-foreground">
              Créez des vidéos avec des avatars IA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}