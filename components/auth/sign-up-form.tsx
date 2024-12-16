'use client';

import { useFormState } from "react-dom";
import { signIn } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from "@/app/actions/auth";
import { toast } from "sonner";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    return "";
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      const result = await register(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Account created successfully!");

      // If registration successful, sign in
      const signInResult = await signIn('credentials', {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        redirect: true,
        callbackUrl: '/'
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            required
            className="bg-slate-800 border-slate-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="bg-slate-800 border-slate-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              required
              className="bg-slate-800 border-slate-700 pr-10"
              onChange={(e) => {
                const error = validatePassword(e.target.value);
                setPasswordError(error);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Password must be at least 6 characters long and contain one uppercase letter
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              required
              className="bg-slate-800 border-slate-700 pr-10"
              onChange={(e) => {
                const password = (document.getElementById('password') as HTMLInputElement).value;
                if (e.target.value !== password) {
                  setPasswordError("Passwords do not match");
                } else {
                  setPasswordError("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {passwordError && (
          <p className="text-sm text-red-500 mt-1">{passwordError}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !!passwordError}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Sign up'
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700"
        onClick={() => signIn('google', { callbackUrl: '/' })}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-violet-500 hover:text-violet-400">
          Sign in
        </Link>
      </p>
    </form>
  );
}