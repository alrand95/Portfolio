-- Add ip_address column to messages table for security tracking
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Add index for potential IP-based queries/blocking in future
CREATE INDEX IF NOT EXISTS idx_messages_ip_address ON messages(ip_address);
