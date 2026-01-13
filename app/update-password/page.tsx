'use client';

import { useActionState } from 'react';
import { GlowButton } from '@/components/GlowButton';
import { updatePassword, type AuthResetResult } from '@/app/actions/auth-reset';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';

const initialState: AuthResetResult = {
    error: '',
};

export default function UpdatePasswordPage() {
    const [state, action, isPending] = useActionState(updatePassword, initialState);

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col gap-6 p-12 glass rounded-[50px] w-full max-w-md border border-white/20 shadow-[0_0_50px_var(--color-neon-purple)]">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-purple/20 border border-neon-purple mb-4">
                        <ShieldCheck className="w-8 h-8 text-neon-purple" />
                    </div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-2">Reset Password</h1>
                    <p className="text-white/60 text-sm">Please enter a new secure password for your admin account.</p>
                </div>

                {state?.error && (
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                        {state.error}
                    </div>
                )}

                <form action={action} className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                name="password"
                                type="password"
                                placeholder="New Password"
                                required
                                minLength={6}
                                className="w-full p-4 pl-14 rounded-full bg-black/50 border border-white/20 focus:border-neon-purple focus:outline-none text-white transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm New Password"
                                required
                                minLength={6}
                                className="w-full p-4 pl-14 rounded-full bg-black/50 border border-white/20 focus:border-neon-purple focus:outline-none text-white transition-all"
                            />
                        </div>
                    </div>

                    <GlowButton type="submit" variant="secondary" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Set New Password'
                        )}
                    </GlowButton>
                </form>
            </div>
        </main>
    );
}
