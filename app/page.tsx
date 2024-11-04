import { AuthCheck } from '@/components/auth-check';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Video, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <AuthCheck>
      <div className="h-full p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to AI Studio</h1>
          <p className="text-muted-foreground text-lg">
            Create engaging content for your e-commerce business with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <Video className="w-8 h-8 text-green-700" />
              </div>
              <h2 className="text-2xl font-semibold">AI UGC Creator</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Create engaging user-generated content videos with AI avatars
            </p>
            <Link href="/create/ugc">
              <Button className="w-full">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <Database className="w-8 h-8 text-blue-700" />
              </div>
              <h2 className="text-2xl font-semibold">Product Fine-tuning</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Fine-tune AI models with your product images for better results
            </p>
            <Link href="/create/fine-tune">
              <Button className="w-full">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </AuthCheck>
  );
}