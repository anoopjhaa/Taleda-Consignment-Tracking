-- Add customer details for WhatsApp notifications
ALTER TABLE consignments ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE consignments ADD COLUMN IF NOT EXISTS customer_name text;

-- Update existing consignments with dummy data if needed
-- UPDATE consignments SET customer_phone = '+910000000000', customer_name = 'Customer' WHERE customer_phone IS NULL;
