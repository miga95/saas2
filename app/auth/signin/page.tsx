import { SignInForm } from '@/components/auth/sign-in-form';
import { Card } from '@/components/ui/card';

export default function SignInPage() {
  return (
    <Card className="w-full p-8 bg-slate-900 border-slate-800">
      <SignInForm />
    </Card>
  );
}