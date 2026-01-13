'use client';

import { useActionState } from 'react';
import { GlowButton } from '@/components/GlowButton';
import { loginAction, type LoginResult } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const initialState: LoginResult = {
    error: '',
};

export default function LoginPage() {
    // Use React 19's useActionState for form handling
    const [state, action, isPending] = useActionState(loginAction, initialState);

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <form action={action} className="flex flex-col gap-6 p-12 glass rounded-[50px] w-full max-w-md border border-white/20 shadow-[0_0_50px_var(--color-neon-purple)]">
                <h1 className="text-3xl font-bold text-center mb-4 uppercase tracking-widest text-white">Admin Access</h1>

                {state?.error && (
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                        {state.error}
                    </div>
                )}

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="p-4 px-6 rounded-full bg-black/50 border border-white/20 focus:border-neon-purple focus:outline-none text-white transition-all"
                />
                <div className="space-y-2">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full p-4 px-6 rounded-full bg-black/50 border border-white/20 focus:border-neon-purple focus:outline-none text-white transition-all"
                    />
                    <div className="flex justify-end px-2">
                        <Link href="/login/forgot" className="text-xs text-white/40 hover:text-neon-purple transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <GlowButton type="submit" variant="secondary" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Unlock Protocol'
                    )}
                </GlowButton>
            </form>
        </main>
    );
}

