import React, { useState } from 'react';
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/features/admin/context/AuthContext';

export const Route = createFileRoute('/admin/login')({
  head: () => ({
    meta: [{ title: 'Admin Login — Meganathan R' }],
  }),
  component: AdminLogin,
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@meganathan.dev',
      password: 'admin123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const result = await login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });
    setLoading(false);

    if (result.success) {
      toast.success('Authenticated successfully. Welcome back!');
      // Check for redirect query param
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTarget = searchParams.get('redirect') || '/admin/dashboard';
      navigate({ to: redirectTarget as any });
    } else {
      toast.error(result.error ?? 'Invalid email or password');
    }
  };

  const handleQuickFill = () => {
    setValue('email', 'admin@meganathan.dev');
    setValue('password', 'admin123');
    setValue('rememberMe', true);
    toast.info('Filled demo credentials (admin@meganathan.dev / admin123)');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success(`Password reset link dispatched to ${resetEmail}`);
    setForgotPasswordOpen(false);
    setResetEmail('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground antialiased selection:bg-primary/30">
      {/* Aurora glowing floating spheres */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full opacity-20 blur-[150px]"
        style={{ background: 'var(--violet)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 right-1/4 h-[500px] w-[500px] rounded-full opacity-15 blur-[140px]"
        style={{ background: 'var(--cyan)' }}
      />

      {/* Back to public site button */}
      <div className="absolute left-6 top-6 z-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-xl transition-all hover:bg-white/10 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Portfolio
        </a>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-card/70 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
          {/* Brand header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-neon text-primary-foreground shadow-xl shadow-primary/30 font-display font-extrabold text-2xl">
              M
            </div>

            <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">
              Meganathan R
            </h1>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-primary flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Admin Console
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="admin@meganathan.dev"
                  className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 text-xs focus:border-primary"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••••••"
                  className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 pr-10 text-xs focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                />
                <span>Keep me signed in for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>

            {/* Quick Demo Fill Helper Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickFill}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.05] hover:text-foreground"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Quick Autofill Demo Credentials</span>
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-white/10 pt-4 text-center">
            <p className="text-[0.65rem] text-muted-foreground">
              Protected by Meganathan R Auth Guard · Frontend Mock Service
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="max-w-sm border-white/10 bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter your registered administrator email to receive secure recovery instructions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="resetEmail" className="text-xs">
                Email Address
              </Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@meganathan.dev"
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotPasswordOpen(false)}
                className="border-white/10 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground text-xs">
                Send Reset Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
