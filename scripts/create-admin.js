
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uuzswsphzkhnhpnvhkwx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1enN3c3BoemtobmhwbnZoa3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMjU2NzYsImV4cCI6MjA4MDcwMTY3Nn0.oQrRHlKmN2yYsuKw8ShtCF3t8m9kt90AxCpw1doI1tI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'rundkhaled1995@gmail.com';
    const password = 'dVkMgxMQgyF3Ji';

    console.log('Attempting to create admin user...');

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('User created:', data.user ? data.user.id : 'No ID returned');
        if (data.session) console.log('Session active - User auto-confirmed!');
        else console.log('No session - Check email for confirmation link.');
    }
}

createAdmin();
