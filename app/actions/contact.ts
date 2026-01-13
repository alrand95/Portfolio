'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { headers } from 'next/headers';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message is too short').max(1000, 'Message is too long'),
    // Honeypot field - should be empty
    _fax_number: z.string().optional(),
});

type ContactState = {
    success?: boolean;
    error?: string;
    errors?: {
        name?: string[];
        email?: string[];
        message?: string[];
    };
};

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_IP = 5;

export async function submitContact(prevState: ContactState, formData: FormData): Promise<ContactState> {
    // 1. Validate Form Data
    const validatedFields = contactSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        _fax_number: formData.get('_fax_number'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, message, _fax_number } = validatedFields.data;

    // 2. Honeypot Check
    if (_fax_number) {
        // Silent failure for bots
        return { success: true };
    }

    // 3. Rate Limiting (IP-based)
    const supabase = await createClient(); // Use createClient from server-side lib
    const headerList = await headers(); // Await headers()
    const forwardedFor = headerList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    // Check recent messages from this IP in the last hour
    // Note: This requires the 'created_at' and 'ip_address' columns to handle efficiently.
    // Since we might not want to hammer the DB, we can do a simple count check.

    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString();

    const { count, error: countError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gt('created_at', oneHourAgo);

    if (countError) {
        console.error('Rate limit check failed:', countError);
        // Fail open or closed? Let's fail open but log it, or strict fail.
        // Safety over availability for contact form? Maybe allow. 
        // But let's assume if DB is down, insert will fail anyway.
    }

    if (count !== null && count >= MAX_REQUESTS_PER_IP) {
        return { error: 'You have sent too many messages recently. Please try again later.' };
    }

    // 4. Insert Message
    const { error } = await supabase.from('messages').insert({
        sender_name: name,
        email: email,
        message_body: message,
        ip_address: ip, // Save IP for future blocking/analysis
    });

    if (error) {
        console.error('Failed to save message:', error);
        return { error: 'Failed to send message. Please try again later.' };
    }

    return { success: true };
}
