-- Fix rate limit function bug: rename conflicting variable
-- The variable 'current_time' conflicts with SQL's current_time function
-- causing type mismatch errors (time vs timestamptz)

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
    current_timestamp_var TIMESTAMPTZ := NOW();  -- Renamed from current_time
    response JSONB;
BEGIN
    -- Get existing record
    SELECT * INTO limit_record FROM auth_rate_limits WHERE ip_address = check_ip;
    
    -- Scenario 1: New record
    IF limit_record IS NULL THEN
        INSERT INTO auth_rate_limits (ip_address, attempt_count, last_attempt_at)
        VALUES (check_ip, 1, current_timestamp_var);
        
        RETURN jsonb_build_object(
            'allowed', true,
            'remaining', max_attempts - 1
        );
    END IF;
    
    -- Scenario 2: Currently blocked
    IF limit_record.blocked_until IS NOT NULL AND limit_record.blocked_until > current_timestamp_var THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'blocked_until', limit_record.blocked_until
        );
    END IF;
    
    -- Scenario 3: Window expired (reset)
    IF limit_record.last_attempt_at < current_timestamp_var - window_duration THEN
        UPDATE auth_rate_limits
        SET attempt_count = 1,
            last_attempt_at = current_timestamp_var,
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
            last_attempt_at = current_timestamp_var,
            blocked_until = current_timestamp_var + block_duration
        WHERE ip_address = check_ip;
        
        RETURN jsonb_build_object(
            'allowed', false,
            'blocked_until', current_timestamp_var + block_duration
        );
    ELSE
        UPDATE auth_rate_limits
        SET attempt_count = limit_record.attempt_count + 1,
            last_attempt_at = current_timestamp_var
        WHERE ip_address = check_ip;
        
        RETURN jsonb_build_object(
            'allowed', true,
            'remaining', max_attempts - (limit_record.attempt_count + 1)
        );
    END IF;
END;
$$;
