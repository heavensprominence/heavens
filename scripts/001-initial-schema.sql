-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    country_code VARCHAR(3) DEFAULT 'CA',
    language_preference VARCHAR(5) DEFAULT 'en',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    registration_number INTEGER UNIQUE,
    registration_bonus_amount DECIMAL(15,2) DEFAULT 0,
    registration_bonus_paid BOOLEAN DEFAULT FALSE,
    referred_by INTEGER REFERENCES users(id),
    referral_bonus_earned DECIMAL(15,2) DEFAULT 0,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin', 'owner')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRED Wallets
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency_code VARCHAR(10) NOT NULL, -- USD-CRED, CAD-CRED, etc.
    balance DECIMAL(15,8) DEFAULT 0,
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, currency_code)
);

-- Currency Exchange Rates
CREATE TABLE exchange_rates (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate DECIMAL(15,8) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency)
);

-- Transactions (Public Ledger)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR(255) UNIQUE NOT NULL,
    from_wallet_id INTEGER REFERENCES wallets(id),
    to_wallet_id INTEGER REFERENCES wallets(id),
    amount DECIMAL(15,8) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- minting, burning, transfer, registration_bonus, grant, loan_disbursement, loan_payment, etc.
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    reference_id INTEGER, -- Links to grants, loans, listings, etc.
    reference_type VARCHAR(50), -- 'grant', 'loan', 'listing', 'auction', etc.
    fee_amount DECIMAL(15,8) DEFAULT 0,
    approved_by INTEGER REFERENCES users(id),
    approval_level VARCHAR(20), -- 'automatic', 'admin', 'super_admin', 'owner'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- System Settings
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('registration_counter', '0', 'Current registration number counter'),
('maintenance_wallet_address', '', 'System maintenance reserve wallet address'),
('featured_listing_fee', '0.19', 'Monthly fee for featured listings in CRED'),
('escrow_fee_min', '0.01', 'Minimum escrow fee percentage'),
('escrow_fee_max', '1.00', 'Maximum escrow fee percentage'),
('referral_bonus', '25', 'CRED bonus for successful referrals'),
('auto_approval_limit', '10.00', 'Auto-approval limit in USD equivalent'),
('admin_approval_limit', '100.00', 'Admin approval limit in USD equivalent'),
('super_admin_approval_limit', '1000.00', 'Super admin approval limit in USD equivalent');
