-- Automatic Parity Management System
-- Monitors exchange rates and automates minting/burning

-- First, ensure we have the base currency support
-- Add currency_code column to existing tables if not exists
DO $$ 
BEGIN
    -- Add currency_code to cred_transactions if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cred_transactions' AND column_name = 'currency_code') THEN
        ALTER TABLE cred_transactions ADD COLUMN currency_code VARCHAR(10) DEFAULT 'USD-CRED';
    END IF;
    
    -- Add currency_code to cred_wallets if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cred_wallets' AND column_name = 'currency_code') THEN
        ALTER TABLE cred_wallets ADD COLUMN currency_code VARCHAR(10) DEFAULT 'USD-CRED';
    END IF;
END $$;

-- Exchange rate tracking table
CREATE TABLE IF NOT EXISTS exchange_rates (
    id SERIAL PRIMARY KEY,
    currency_code VARCHAR(10) NOT NULL,
    target_rate DECIMAL(10, 6) DEFAULT 1.000000, -- Target parity rate
    current_rate DECIMAL(10, 6) NOT NULL,
    market_rate DECIMAL(10, 6), -- External market rate
    deviation_percentage DECIMAL(5, 2), -- How far from parity
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) -- Rate source (coinbase, binance, etc.)
);

-- Automatic monetary policy actions
CREATE TABLE IF NOT EXISTS monetary_actions (
    id SERIAL PRIMARY KEY,
    currency_code VARCHAR(10) NOT NULL,
    action_type VARCHAR(20) NOT NULL, -- 'auto_mint', 'auto_burn'
    amount DECIMAL(15, 2) NOT NULL,
    trigger_rate DECIMAL(10, 6) NOT NULL,
    target_rate DECIMAL(10, 6) NOT NULL,
    deviation_threshold DECIMAL(5, 2) NOT NULL, -- Trigger threshold %
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_hash VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed',
    reason TEXT
);

-- Parity management configuration
CREATE TABLE IF NOT EXISTS parity_config (
    id SERIAL PRIMARY KEY,
    currency_code VARCHAR(10) UNIQUE NOT NULL,
    auto_enabled BOOLEAN DEFAULT false,
    deviation_threshold DECIMAL(5, 2) DEFAULT 2.00, -- 2% deviation triggers action
    max_daily_mint DECIMAL(15, 2) DEFAULT 1000000, -- Max daily minting
    max_daily_burn DECIMAL(15, 2) DEFAULT 1000000, -- Max daily burning
    cooldown_minutes INTEGER DEFAULT 60, -- Minimum time between actions
    last_action_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price monitoring alerts
CREATE TABLE IF NOT EXISTS price_alerts (
    id SERIAL PRIMARY KEY,
    currency_code VARCHAR(10) NOT NULL,
    alert_type VARCHAR(20) NOT NULL, -- 'deviation', 'volume', 'volatility'
    threshold_value DECIMAL(10, 6) NOT NULL,
    current_value DECIMAL(10, 6) NOT NULL,
    severity VARCHAR(10) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    message TEXT,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Insert default parity configurations
INSERT INTO parity_config (currency_code, auto_enabled, deviation_threshold) VALUES
('USD-CRED', true, 2.00),
('EUR-CRED', true, 2.00),
('GBP-CRED', true, 2.00),
('CAD-CRED', true, 2.00),
('JPY-CRED', true, 2.00),
('AUD-CRED', true, 2.00),
('CHF-CRED', true, 2.00),
('CNY-CRED', true, 2.00),
('INR-CRED', true, 2.00),
('BRL-CRED', true, 2.00)
ON CONFLICT (currency_code) DO NOTHING;

-- Insert initial exchange rates
INSERT INTO exchange_rates (currency_code, current_rate, market_rate, source) VALUES
('USD-CRED', 1.000000, 1.000000, 'internal'),
('EUR-CRED', 1.000000, 1.000000, 'internal'),
('GBP-CRED', 1.000000, 1.000000, 'internal'),
('CAD-CRED', 1.000000, 1.000000, 'internal'),
('JPY-CRED', 1.000000, 1.000000, 'internal'),
('AUD-CRED', 1.000000, 1.000000, 'internal'),
('CHF-CRED', 1.000000, 1.000000, 'internal'),
('CNY-CRED', 1.000000, 1.000000, 'internal'),
('INR-CRED', 1.000000, 1.000000, 'internal'),
('BRL-CRED', 1.000000, 1.000000, 'internal')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currency ON exchange_rates(currency_code);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_updated ON exchange_rates(last_updated);
CREATE INDEX IF NOT EXISTS idx_monetary_actions_currency ON monetary_actions(currency_code);
CREATE INDEX IF NOT EXISTS idx_monetary_actions_executed ON monetary_actions(executed_at);
CREATE INDEX IF NOT EXISTS idx_price_alerts_currency ON price_alerts(currency_code);
CREATE INDEX IF NOT EXISTS idx_price_alerts_resolved ON price_alerts(resolved);

-- Create a function to calculate deviation percentage
CREATE OR REPLACE FUNCTION calculate_deviation(current_rate DECIMAL, target_rate DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF target_rate = 0 THEN
        RETURN 0;
    END IF;
    RETURN ABS((current_rate - target_rate) / target_rate * 100);
END;
$$ LANGUAGE plpgsql;

-- Update exchange rates with calculated deviations
UPDATE exchange_rates 
SET deviation_percentage = calculate_deviation(current_rate, target_rate);
