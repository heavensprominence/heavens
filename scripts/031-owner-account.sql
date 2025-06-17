-- Create the owner account
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  status,
  registration_number,
  registration_bonus_amount,
  created_at
) VALUES (
  'bryanjbenevolence@gmail.com',
  '$2a$12$LQv3c1yqBwlVHpPjrCeyL.rVwnbgxVBjBZKx/Ne9xQ9yRXHWuIK2u', -- HeavensLive2024!
  'Bryan J',
  'Benevolence', 
  'owner',
  'active',
  0,
  100000,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role;

-- Create owner wallet with substantial balance
INSERT INTO wallets (user_id, currency_code, balance, wallet_address, is_primary)
SELECT u.id, 'USD-CRED', 100000, 'CRED-OWNER-' || u.id, true
FROM users u WHERE u.email = 'bryanjbenevolence@gmail.com'
ON CONFLICT (user_id, currency_code) DO UPDATE SET
  balance = EXCLUDED.balance;
