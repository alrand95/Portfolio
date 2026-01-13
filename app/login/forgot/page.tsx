'use client';

import { useActionState } from 'react';
import { GlowButton } from '@/components/GlowButton';
import { requestPasswordReset, type AuthResetResult } from '@/app/actions/auth-reset';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

const initialState: AuthResetResult = {
    error: '',
    success: ''
};

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(requestPasswordReset, initialState);

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col gap-6 p-12 glass rounded-[50px] w-full max-w-md border border-white/20 shadow-[0_0_50px_var(--color-neon-purple)]">
                <Link href="/login" className="flex items-center text-white/60 hover:text-white transition-colors self-start mb-2 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-2">Recovery</h1>
                    <p className="text-white/60 text-sm">Enter your admin email to receive a secure reset link.</p>
                </div>

                {state?.error && (
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-sm text-center">
                        {state.success}
                    </div>
                )}

                {!state?.success && (
                    <form action={action} className="flex flex-col gap-6">
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Admin Email"
                                required
                                className="w-full p-4 pl-14 rounded-full bg-black/50 border border-white/20 focus:border-neon-purple focus:outline-none text-white transition-all"
                            />
                        </div>

                        <GlowButton type="submit" variant="secondary" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </GlowButton>
                    </form>
                )}
            </div>
        </main>
    );
}
