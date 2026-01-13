-- Rate Limiting System for Admin Login

-- 1. Create table to track login attempts
CREATE TABLE IF NOT EXISTS auth_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    blocked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique tracking per IP
    CONSTRAINT auth_rate_limits_ip_unique UNIQUE (ip_address)
);

-- 2. Create RLS policies (Admin only)
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admin can view rate limits"
ON auth_rate_limits FOR SELECT
TO authenticated
USING (auth.jwt()->>'email' IN ('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com'));

-- 3. Create cleanup function (to be called periodically or via cron)
CREATE OR REPLACE FUNCTION clean_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM auth_rate_limits
    WHERE last_attempt_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- 4. Create function to check and increment rate limit
-- Returns JSON: { "allowed": boolean, "blocked_until": timestamp, "remaining": int }
CREATE OR REPLACE FUNCTION check_rate_limit(check_ip TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    limit_record RECORD;
    max_attempts CONSTANT INTEGER := 5;
    window_duration CONSTANT INTERVAL := '15 minutes';
    block_duration CONSTANT INTERVAL := '30 minutes';
    current_time TIMESTAMPTZ := NOW();
    response JSONB;
BEGIN
    -- Get existing record
    SELECT * INTO limit_record FROM auth_rate_limits WHERE ip_address = check_ip;
    
    -- Scenario 1: New record
    IF limit_record IS NULL THEN
        INSERT INTO auth_rate_limits (ip_address, attempt_count, last_attempt_at)
        VALUES (check_ip, 1, current_time);
        
        RETURN jsonb_build_object(
            'allowed', true,
            'remaining', max_attempts - 1
        );
    END IF;
    
    -- Scenario 2: Currently blocked
    IF limit_record.blocked_until IS NOT NULL AND limit_record.blocked_until > current_time THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'blocked_until', limit_record.blocked_until
        );
    END IF;
    
    -- Scenario 3: Window expired (reset)
    IF limit_record.last_attempt_at < current_time - window_duration THEN
        UPDATE auth_rate_limits
        SET attempt_count = 1,
            last_attempt_at = current_time,
            blocked_until = NULL
        WHERE ip_address = check_ip;
        
        RETURN jsonb_build_object(
            'allowed', true,
            'remaining', max_attempts - 1
        );
    END IF;
    
    -- Scenario 4: Within window, increment
    -- Check if this attempt will block them
    IF limit_record.attempt_count >= max_attempts THEN
        UPDATE auth_rate_limits
        SET attempt_count = limit_record.attempt_count + 1,
            last_attempt_at = current_time,
            blocked_until = current_time + block_duration
        WHERE ip_address = check_ip;
        
        RETURN jsonb_build_object(
            'allowed', false,
            'blocked_until', current_time + block_duration
        );
    ELSE
        UPDATE auth_rate_limits
        SET attempt_count = limit_record.attempt_count + 1,
            last_attempt_at = current_time
        WHERE ip_address = check_ip;
        
        RETURN jsonb_build_object(
            'allowed', true,
            'remaining', max_attempts - (limit_record.attempt_count + 1)
        );
    END IF;
END;
$$;
