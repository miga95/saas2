import { SignUpForm } from '@/components/auth/sign-up-form';
import { Card } from '@/components/ui/card';

export default function SignUpPage() {
  return (
    <Card className="w-full p-8 bg-slate-900 border-slate-800">
      <SignUpForm />
    </Card>
  );
}