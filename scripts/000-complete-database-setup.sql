-- Complete Heavenslive Platform Database Setup
-- Built over 17 hours of collaboration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User locale preferences
CREATE TABLE IF NOT EXISTS user_locale_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Global currencies with flags (all 195+ countries)
CREATE TABLE IF NOT EXISTS global_currencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(3) NOT NULL UNIQUE,
    country_name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    currency_name VARCHAR(100) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    flag_emoji VARCHAR(10) NOT NULL,
    cred_parity_rate DECIMAL(20,8) NOT NULL DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    compliance_status VARCHAR(50) DEFAULT 'compliant',
    regulatory_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace categories
CREATE TABLE IF NOT EXISTS marketplace_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES marketplace_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace products
CREATE TABLE IF NOT EXISTS marketplace_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES marketplace_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_cred DECIMAL(20,8) NOT NULL,
    price_local DECIMAL(20,8),
    local_currency VARCHAR(3),
    stock_quantity INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    country_code VARCHAR(3),
    is_global BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace orders
CREATE TABLE IF NOT EXISTS marketplace_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES marketplace_products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    total_cred DECIMAL(20,8) NOT NULL,
    total_local DECIMAL(20,8),
    local_currency VARCHAR(3),
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Currency conversion history
CREATE TABLE IF NOT EXISTS currency_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    from_amount DECIMAL(20,8) NOT NULL,
    to_amount DECIMAL(20,8) NOT NULL,
    exchange_rate DECIMAL(20,8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert all 195+ countries with their currencies and flags
INSERT INTO global_currencies (country_code, country_name, currency_code, currency_name, currency_symbol, flag_emoji, cred_parity_rate, compliance_status) VALUES
-- Major economies first
('USA', 'United States', 'USD', 'US Dollar', '$', '🇺🇸', 1.0, 'compliant'),
('EUR', 'European Union', 'EUR', 'Euro', '€', '🇪🇺', 0.85, 'compliant'),
('GBR', 'United Kingdom', 'GBP', 'British Pound', '£', '🇬🇧', 0.73, 'compliant'),
('JPN', 'Japan', 'JPY', 'Japanese Yen', '¥', '🇯🇵', 110.0, 'compliant'),
('CHN', 'China', 'CNY', 'Chinese Yuan', '¥', '🇨🇳', 6.45, 'compliant'),
('IND', 'India', 'INR', 'Indian Rupee', '₹', '🇮🇳', 74.5, 'compliant'),
('CAN', 'Canada', 'CAD', 'Canadian Dollar', 'C$', '🇨🇦', 1.25, 'compliant'),
('AUS', 'Australia', 'AUD', 'Australian Dollar', 'A$', '🇦🇺', 1.35, 'compliant'),
('CHE', 'Switzerland', 'CHF', 'Swiss Franc', 'Fr', '🇨🇭', 0.92, 'compliant'),
('KOR', 'South Korea', 'KRW', 'Korean Won', '₩', '🇰🇷', 1180.0, 'compliant'),

-- Challenging markets (as requested by user)
('IRN', 'Iran', 'IRR', 'Iranian Rial', '﷼', '🇮🇷', 42000.0, 'restricted'),
('PRK', 'North Korea', 'KPW', 'North Korean Won', '₩', '🇰🇵', 900.0, 'restricted'),
('CUB', 'Cuba', 'CUP', 'Cuban Peso', '$', '🇨🇺', 24.0, 'restricted'),

-- Africa (54 countries)
('DZA', 'Algeria', 'DZD', 'Algerian Dinar', 'د.ج', '🇩🇿', 135.0, 'compliant'),
('AGO', 'Angola', 'AOA', 'Angolan Kwanza', 'Kz', '🇦🇴', 650.0, 'compliant'),
('BEN', 'Benin', 'XOF', 'West African CFA Franc', 'Fr', '🇧🇯', 580.0, 'compliant'),
('BWA', 'Botswana', 'BWP', 'Botswana Pula', 'P', '🇧🇼', 11.0, 'compliant'),
('BFA', 'Burkina Faso', 'XOF', 'West African CFA Franc', 'Fr', '🇧🇫', 580.0, 'compliant'),
('BDI', 'Burundi', 'BIF', 'Burundian Franc', 'Fr', '🇧🇮', 2000.0, 'compliant'),
('CMR', 'Cameroon', 'XAF', 'Central African CFA Franc', 'Fr', '🇨🇲', 580.0, 'compliant'),
('CPV', 'Cape Verde', 'CVE', 'Cape Verdean Escudo', '$', '🇨🇻', 98.0, 'compliant'),
('CAF', 'Central African Republic', 'XAF', 'Central African CFA Franc', 'Fr', '🇨🇫', 580.0, 'compliant'),
('TCD', 'Chad', 'XAF', 'Central African CFA Franc', 'Fr', '🇹🇩', 580.0, 'compliant'),
('COM', 'Comoros', 'KMF', 'Comorian Franc', 'Fr', '🇰🇲', 435.0, 'compliant'),
('COG', 'Congo', 'XAF', 'Central African CFA Franc', 'Fr', '🇨🇬', 580.0, 'compliant'),
('COD', 'Democratic Republic of Congo', 'CDF', 'Congolese Franc', 'Fr', '🇨🇩', 2000.0, 'compliant'),
('CIV', 'Côte d''Ivoire', 'XOF', 'West African CFA Franc', 'Fr', '🇨🇮', 580.0, 'compliant'),
('DJI', 'Djibouti', 'DJF', 'Djiboutian Franc', 'Fr', '🇩🇯', 177.0, 'compliant'),
('EGY', 'Egypt', 'EGP', 'Egyptian Pound', 'ج.م', '🇪🇬', 15.7, 'compliant'),
('GNQ', 'Equatorial Guinea', 'XAF', 'Central African CFA Franc', 'Fr', '🇬🇶', 580.0, 'compliant'),
('ERI', 'Eritrea', 'ERN', 'Eritrean Nakfa', 'Nfk', '🇪🇷', 15.0, 'compliant'),
('SWZ', 'Eswatini', 'SZL', 'Swazi Lilangeni', 'L', '🇸🇿', 14.5, 'compliant'),
('ETH', 'Ethiopia', 'ETB', 'Ethiopian Birr', 'Br', '🇪🇹', 43.0, 'compliant'),
('GAB', 'Gabon', 'XAF', 'Central African CFA Franc', 'Fr', '🇬🇦', 580.0, 'compliant'),
('GMB', 'Gambia', 'GMD', 'Gambian Dalasi', 'D', '🇬🇲', 52.0, 'compliant'),
('GHA', 'Ghana', 'GHS', 'Ghanaian Cedi', '₵', '🇬🇭', 6.1, 'compliant'),
('GIN', 'Guinea', 'GNF', 'Guinean Franc', 'Fr', '🇬🇳', 10500.0, 'compliant'),
('GNB', 'Guinea-Bissau', 'XOF', 'West African CFA Franc', 'Fr', '🇬🇼', 580.0, 'compliant'),
('KEN', 'Kenya', 'KES', 'Kenyan Shilling', 'Sh', '🇰🇪', 108.0, 'compliant'),
('LSO', 'Lesotho', 'LSL', 'Lesotho Loti', 'L', '🇱🇸', 14.5, 'compliant'),
('LBR', 'Liberia', 'LRD', 'Liberian Dollar', '$', '🇱🇷', 170.0, 'compliant'),
('LBY', 'Libya', 'LYD', 'Libyan Dinar', 'ل.د', '🇱🇾', 4.5, 'compliant'),
('MDG', 'Madagascar', 'MGA', 'Malagasy Ariary', 'Ar', '🇲🇬', 4000.0, 'compliant'),
('MWI', 'Malawi', 'MWK', 'Malawian Kwacha', 'MK', '🇲🇼', 820.0, 'compliant'),
('MLI', 'Mali', 'XOF', 'West African CFA Franc', 'Fr', '🇲🇱', 580.0, 'compliant'),
('MRT', 'Mauritania', 'MRU', 'Mauritanian Ouguiya', 'UM', '🇲🇷', 36.0, 'compliant'),
('MUS', 'Mauritius', 'MUR', 'Mauritian Rupee', '₨', '🇲🇺', 42.0, 'compliant'),
('MAR', 'Morocco', 'MAD', 'Moroccan Dirham', 'د.م.', '🇲🇦', 9.0, 'compliant'),
('MOZ', 'Mozambique', 'MZN', 'Mozambican Metical', 'MT', '🇲🇿', 64.0, 'compliant'),
('NAM', 'Namibia', 'NAD', 'Namibian Dollar', '$', '🇳🇦', 14.5, 'compliant'),
('NER', 'Niger', 'XOF', 'West African CFA Franc', 'Fr', '🇳🇪', 580.0, 'compliant'),
('NGA', 'Nigeria', 'NGN', 'Nigerian Naira', '₦', '🇳🇬', 411.0, 'compliant'),
('RWA', 'Rwanda', 'RWF', 'Rwandan Franc', 'Fr', '🇷🇼', 1000.0, 'compliant'),
('STP', 'São Tomé and Príncipe', 'STN', 'São Tomé and Príncipe Dobra', 'Db', '🇸🇹', 22.0, 'compliant'),
('SEN', 'Senegal', 'XOF', 'West African CFA Franc', 'Fr', '🇸🇳', 580.0, 'compliant'),
('SYC', 'Seychelles', 'SCR', 'Seychellois Rupee', '₨', '🇸🇨', 13.5, 'compliant'),
('SLE', 'Sierra Leone', 'SLL', 'Sierra Leonean Leone', 'Le', '🇸🇱', 11000.0, 'compliant'),
('SOM', 'Somalia', 'SOS', 'Somali Shilling', 'Sh', '🇸🇴', 580.0, 'compliant'),
('ZAF', 'South Africa', 'ZAR', 'South African Rand', 'R', '🇿🇦', 14.5, 'compliant'),
('SSD', 'South Sudan', 'SSP', 'South Sudanese Pound', '£', '🇸🇸', 130.0, 'compliant'),
('SDN', 'Sudan', 'SDG', 'Sudanese Pound', 'ج.س.', '🇸🇩', 445.0, 'compliant'),
('TZA', 'Tanzania', 'TZS', 'Tanzanian Shilling', 'Sh', '🇹🇿', 2320.0, 'compliant'),
('TGO', 'Togo', 'XOF', 'West African CFA Franc', 'Fr', '🇹🇬', 580.0, 'compliant'),
('TUN', 'Tunisia', 'TND', 'Tunisian Dinar', 'د.ت', '🇹🇳', 2.8, 'compliant'),
('UGA', 'Uganda', 'UGX', 'Ugandan Shilling', 'Sh', '🇺🇬', 3550.0, 'compliant'),
('ZMB', 'Zambia', 'ZMW', 'Zambian Kwacha', 'ZK', '🇿🇲', 17.0, 'compliant'),
('ZWE', 'Zimbabwe', 'ZWL', 'Zimbabwean Dollar', '$', '🇿🇼', 322.0, 'compliant'),

-- Asia (48 countries)
('AFG', 'Afghanistan', 'AFN', 'Afghan Afghani', '؋', '🇦🇫', 87.0, 'restricted'),
('ARM', 'Armenia', 'AMD', 'Armenian Dram', '֏', '🇦🇲', 520.0, 'compliant'),
('AZE', 'Azerbaijan', 'AZN', 'Azerbaijani Manat', '₼', '🇦🇿', 1.7, 'compliant'),
('BHR', 'Bahrain', 'BHD', 'Bahraini Dinar', '.د.ب', '🇧🇭', 0.38, 'compliant'),
('BGD', 'Bangladesh', 'BDT', 'Bangladeshi Taka', '৳', '🇧🇩', 85.0, 'compliant'),
('BTN', 'Bhutan', 'BTN', 'Bhutanese Ngultrum', 'Nu.', '🇧🇹', 74.0, 'compliant'),
('BRN', 'Brunei', 'BND', 'Brunei Dollar', '$', '🇧🇳', 1.35, 'compliant'),
('KHM', 'Cambodia', 'KHR', 'Cambodian Riel', '៛', '🇰🇭', 4080.0, 'compliant'),
('GEO', 'Georgia', 'GEL', 'Georgian Lari', '₾', '🇬🇪', 3.3, 'compliant'),
('IDN', 'Indonesia', 'IDR', 'Indonesian Rupiah', 'Rp', '🇮🇩', 14300.0, 'compliant'),
('IRQ', 'Iraq', 'IQD', 'Iraqi Dinar', 'ع.د', '🇮🇶', 1460.0, 'compliant'),
('ISR', 'Israel', 'ILS', 'Israeli New Shekel', '₪', '🇮🇱', 3.2, 'compliant'),
('JOR', 'Jordan', 'JOD', 'Jordanian Dinar', 'د.ا', '🇯🇴', 0.71, 'compliant'),
('KAZ', 'Kazakhstan', 'KZT', 'Kazakhstani Tenge', '₸', '🇰🇿', 425.0, 'compliant'),
('KWT', 'Kuwait', 'KWD', 'Kuwaiti Dinar', 'د.ك', '🇰🇼', 0.30, 'compliant'),
('KGZ', 'Kyrgyzstan', 'KGS', 'Kyrgyzstani Som', 'с', '🇰🇬', 84.0, 'compliant'),
('LAO', 'Laos', 'LAK', 'Lao Kip', '₭', '🇱🇦', 9500.0, 'compliant'),
('LBN', 'Lebanon', 'LBP', 'Lebanese Pound', 'ل.ل', '🇱🇧', 1507.0, 'compliant'),
('MYS', 'Malaysia', 'MYR', 'Malaysian Ringgit', 'RM', '🇲🇾', 4.2, 'compliant'),
('MDV', 'Maldives', 'MVR', 'Maldivian Rufiyaa', '.ރ', '🇲🇻', 15.4, 'compliant'),
('MNG', 'Mongolia', 'MNT', 'Mongolian Tugrik', '₮', '🇲🇳', 2840.0, 'compliant'),
('MMR', 'Myanmar', 'MMK', 'Myanmar Kyat', 'Ks', '🇲🇲', 1850.0, 'compliant'),
('NPL', 'Nepal', 'NPR', 'Nepalese Rupee', '₨', '🇳🇵', 118.0, 'compliant'),
('OMN', 'Oman', 'OMR', 'Omani Rial', 'ر.ع.', '🇴🇲', 0.38, 'compliant'),
('PAK', 'Pakistan', 'PKR', 'Pakistani Rupee', '₨', '🇵🇰', 170.0, 'compliant'),
('PHL', 'Philippines', 'PHP', 'Philippine Peso', '₱', '🇵🇭', 50.0, 'compliant'),
('QAT', 'Qatar', 'QAR', 'Qatari Riyal', 'ر.ق', '🇶🇦', 3.64, 'compliant'),
('SAU', 'Saudi Arabia', 'SAR', 'Saudi Riyal', 'ر.س', '🇸🇦', 3.75, 'compliant'),
('SGP', 'Singapore', 'SGD', 'Singapore Dollar', '$', '🇸🇬', 1.35, 'compliant'),
('LKA', 'Sri Lanka', 'LKR', 'Sri Lankan Rupee', '₨', '🇱🇰', 200.0, 'compliant'),
('SYR', 'Syria', 'SYP', 'Syrian Pound', 'ل.س', '🇸🇾', 2512.0, 'restricted'),
('TWN', 'Taiwan', 'TWD', 'New Taiwan Dollar', '$', '🇹🇼', 28.0, 'compliant'),
('TJK', 'Tajikistan', 'TJS', 'Tajikistani Somoni', 'ЅМ', '🇹🇯', 11.3, 'compliant'),
('THA', 'Thailand', 'THB', 'Thai Baht', '฿', '🇹🇭', 33.0, 'compliant'),
('TLS', 'Timor-Leste', 'USD', 'US Dollar', '$', '🇹🇱', 1.0, 'compliant'),
('TUR', 'Turkey', 'TRY', 'Turkish Lira', '₺', '🇹🇷', 8.5, 'compliant'),
('TKM', 'Turkmenistan', 'TMT', 'Turkmenistani Manat', 'm', '🇹🇲', 3.5, 'compliant'),
('ARE', 'United Arab Emirates', 'AED', 'UAE Dirham', 'د.إ', '🇦🇪', 3.67, 'compliant'),
('UZB', 'Uzbekistan', 'UZS', 'Uzbekistani Som', 'сўм', '🇺🇿', 10600.0, 'compliant'),
('VNM', 'Vietnam', 'VND', 'Vietnamese Dong', '₫', '🇻🇳', 23000.0, 'compliant'),
('YEM', 'Yemen', 'YER', 'Yemeni Rial', '﷼', '🇾🇪', 250.0, 'compliant'),

-- Europe (44 countries) - Many use EUR
('ALB', 'Albania', 'ALL', 'Albanian Lek', 'L', '🇦🇱', 103.0, 'compliant'),
('AND', 'Andorra', 'EUR', 'Euro', '€', '🇦🇩', 0.85, 'compliant'),
('AUT', 'Austria', 'EUR', 'Euro', '€', '🇦🇹', 0.85, 'compliant'),
('BLR', 'Belarus', 'BYN', 'Belarusian Ruble', 'Br', '🇧🇾', 2.6, 'compliant'),
('BEL', 'Belgium', 'EUR', 'Euro', '€', '🇧🇪', 0.85, 'compliant'),
('BIH', 'Bosnia and Herzegovina', 'BAM', 'Bosnia and Herzegovina Convertible Mark', 'КМ', '🇧🇦', 1.66, 'compliant'),
('BGR', 'Bulgaria', 'BGN', 'Bulgarian Lev', 'лв', '🇧🇬', 1.66, 'compliant'),
('HRV', 'Croatia', 'EUR', 'Euro', '€', '🇭🇷', 0.85, 'compliant'),
('CYP', 'Cyprus', 'EUR', 'Euro', '€', '🇨🇾', 0.85, 'compliant'),
('CZE', 'Czech Republic', 'CZK', 'Czech Koruna', 'Kč', '🇨🇿', 22.0, 'compliant'),
('DNK', 'Denmark', 'DKK', 'Danish Krone', 'kr', '🇩🇰', 6.3, 'compliant'),
('EST', 'Estonia', 'EUR', 'Euro', '€', '🇪🇪', 0.85, 'compliant'),
('FIN', 'Finland', 'EUR', 'Euro', '€', '🇫🇮', 0.85, 'compliant'),
('FRA', 'France', 'EUR', 'Euro', '€', '🇫🇷', 0.85, 'compliant'),
('DEU', 'Germany', 'EUR', 'Euro', '€', '🇩🇪', 0.85, 'compliant'),
('GRC', 'Greece', 'EUR', 'Euro', '€', '🇬🇷', 0.85, 'compliant'),
('HUN', 'Hungary', 'HUF', 'Hungarian Forint', 'Ft', '🇭🇺', 300.0, 'compliant'),
('ISL', 'Iceland', 'ISK', 'Icelandic Krona', 'kr', '🇮🇸', 125.0, 'compliant'),
('IRL', 'Ireland', 'EUR', 'Euro', '€', '🇮🇪', 0.85, 'compliant'),
('ITA', 'Italy', 'EUR', 'Euro', '€', '🇮🇹', 0.85, 'compliant'),
('XKX', 'Kosovo', 'EUR', 'Euro', '€', '🇽🇰', 0.85, 'compliant'),
('LVA', 'Latvia', 'EUR', 'Euro', '€', '🇱🇻', 0.85, 'compliant'),
('LIE', 'Liechtenstein', 'CHF', 'Swiss Franc', 'Fr', '🇱🇮', 0.92, 'compliant'),
('LTU', 'Lithuania', 'EUR', 'Euro', '€', '🇱🇹', 0.85, 'compliant'),
('LUX', 'Luxembourg', 'EUR', 'Euro', '€', '🇱🇺', 0.85, 'compliant'),
('MLT', 'Malta', 'EUR', 'Euro', '€', '🇲🇹', 0.85, 'compliant'),
('MDA', 'Moldova', 'MDL', 'Moldovan Leu', 'L', '🇲🇩', 17.8, 'compliant'),
('MCO', 'Monaco', 'EUR', 'Euro', '€', '🇲🇨', 0.85, 'compliant'),
('MNE', 'Montenegro', 'EUR', 'Euro', '€', '🇲🇪', 0.85, 'compliant'),
('NLD', 'Netherlands', 'EUR', 'Euro', '€', '🇳🇱', 0.85, 'compliant'),
('MKD', 'North Macedonia', 'MKD', 'Macedonian Denar', 'ден', '🇲🇰', 52.0, 'compliant'),
('NOR', 'Norway', 'NOK', 'Norwegian Krone', 'kr', '🇳🇴', 8.5, 'compliant'),
('POL', 'Poland', 'PLN', 'Polish Zloty', 'zł', '🇵🇱', 3.9, 'compliant'),
('PRT', 'Portugal', 'EUR', 'Euro', '€', '🇵🇹', 0.85, 'compliant'),
('ROU', 'Romania', 'RON', 'Romanian Leu', 'lei', '🇷🇴', 4.2, 'compliant'),
('RUS', 'Russia', 'RUB', 'Russian Ruble', '₽', '🇷🇺', 74.0, 'restricted'),
('SMR', 'San Marino', 'EUR', 'Euro', '€', '🇸🇲', 0.85, 'compliant'),
('SRB', 'Serbia', 'RSD', 'Serbian Dinar', 'дин', '🇷🇸', 100.0, 'compliant'),
('SVK', 'Slovakia', 'EUR', 'Euro', '€', '🇸🇰', 0.85, 'compliant'),
('SVN', 'Slovenia', 'EUR', 'Euro', '€', '🇸🇮', 0.85, 'compliant'),
('ESP', 'Spain', 'EUR', 'Euro', '€', '🇪🇸', 0.85, 'compliant'),
('SWE', 'Sweden', 'SEK', 'Swedish Krona', 'kr', '🇸🇪', 8.7, 'compliant'),
('UKR', 'Ukraine', 'UAH', 'Ukrainian Hryvnia', '₴', '🇺🇦', 27.0, 'compliant'),
('VAT', 'Vatican City', 'EUR', 'Euro', '€', '🇻🇦', 0.85, 'compliant'),

-- North America (23 countries)
('ATG', 'Antigua and Barbuda', 'XCD', 'East Caribbean Dollar', '$', '🇦🇬', 2.7, 'compliant'),
('BHS', 'Bahamas', 'BSD', 'Bahamian Dollar', '$', '🇧🇸', 1.0, 'compliant'),
('BRB', 'Barbados', 'BBD', 'Barbadian Dollar', '$', '🇧🇧', 2.0, 'compliant'),
('BLZ', 'Belize', 'BZD', 'Belize Dollar', '$', '🇧🇿', 2.0, 'compliant'),
('CRI', 'Costa Rica', 'CRC', 'Costa Rican Colon', '₡', '🇨🇷', 620.0, 'compliant'),
('DMA', 'Dominica', 'XCD', 'East Caribbean Dollar', '$', '🇩🇲', 2.7, 'compliant'),
('DOM', 'Dominican Republic', 'DOP', 'Dominican Peso', '$', '🇩🇴', 57.0, 'compliant'),
('SLV', 'El Salvador', 'USD', 'US Dollar', '$', '🇸🇻', 1.0, 'compliant'),
('GRD', 'Grenada', 'XCD', 'East Caribbean Dollar', '$', '🇬🇩', 2.7, 'compliant'),
('GTM', 'Guatemala', 'GTQ', 'Guatemalan Quetzal', 'Q', '🇬🇹', 7.7, 'compliant'),
('HTI', 'Haiti', 'HTG', 'Haitian Gourde', 'G', '🇭🇹', 88.0, 'compliant'),
('HND', 'Honduras', 'HNL', 'Honduran Lempira', 'L', '🇭🇳', 24.0, 'compliant'),
('JAM', 'Jamaica', 'JMD', 'Jamaican Dollar', '$', '🇯🇲', 150.0, 'compliant'),
('MEX', 'Mexico', 'MXN', 'Mexican Peso', '$', '🇲🇽', 20.0, 'compliant'),
('NIC', 'Nicaragua', 'NIO', 'Nicaraguan Cordoba', 'C$', '🇳🇮', 35.0, 'compliant'),
('PAN', 'Panama', 'PAB', 'Panamanian Balboa', 'B/.', '🇵🇦', 1.0, 'compliant'),
('KNA', 'Saint Kitts and Nevis', 'XCD', 'East Caribbean Dollar', '$', '🇰🇳', 2.7, 'compliant'),
('LCA', 'Saint Lucia', 'XCD', 'East Caribbean Dollar', '$', '🇱🇨', 2.7, 'compliant'),
('VCT', 'Saint Vincent and the Grenadines', 'XCD', 'East Caribbean Dollar', '$', '🇻🇨', 2.7, 'compliant'),
('TTO', 'Trinidad and Tobago', 'TTD', 'Trinidad and Tobago Dollar', '$', '🇹🇹', 6.8, 'compliant'),

-- South America (12 countries)
('ARG', 'Argentina', 'ARS', 'Argentine Peso', '$', '🇦🇷', 98.0, 'compliant'),
('BOL', 'Bolivia', 'BOB', 'Bolivian Boliviano', 'Bs.', '🇧🇴', 6.9, 'compliant'),
('BRA', 'Brazil', 'BRL', 'Brazilian Real', 'R$', '🇧🇷', 5.2, 'compliant'),
('CHL', 'Chile', 'CLP', 'Chilean Peso', '$', '🇨🇱', 800.0, 'compliant'),
('COL', 'Colombia', 'COP', 'Colombian Peso', '$', '🇨🇴', 3800.0, 'compliant'),
('ECU', 'Ecuador', 'USD', 'US Dollar', '$', '🇪🇨', 1.0, 'compliant'),
('GUY', 'Guyana', 'GYD', 'Guyanese Dollar', '$', '🇬🇾', 209.0, 'compliant'),
('PRY', 'Paraguay', 'PYG', 'Paraguayan Guarani', '₲', '🇵🇾', 6900.0, 'compliant'),
('PER', 'Peru', 'PEN', 'Peruvian Sol', 'S/', '🇵🇪', 4.0, 'compliant'),
('SUR', 'Suriname', 'SRD', 'Surinamese Dollar', '$', '🇸🇷', 14.3, 'compliant'),
('URY', 'Uruguay', 'UYU', 'Uruguayan Peso', '$', '🇺🇾', 43.0, 'compliant'),
('VEN', 'Venezuela', 'VES', 'Venezuelan Bolívar', 'Bs.S', '🇻🇪', 4200000.0, 'restricted'),

-- Oceania (14 countries)
('FJI', 'Fiji', 'FJD', 'Fijian Dollar', '$', '🇫🇯', 2.1, 'compliant'),
('KIR', 'Kiribati', 'AUD', 'Australian Dollar', '$', '🇰🇮', 1.35, 'compliant'),
('MHL', 'Marshall Islands', 'USD', 'US Dollar', '$', '🇲🇭', 1.0, 'compliant'),
('FSM', 'Micronesia', 'USD', 'US Dollar', '$', '🇫🇲', 1.0, 'compliant'),
('NRU', 'Nauru', 'AUD', 'Australian Dollar', '$', '🇳🇷', 1.35, 'compliant'),
('NZL', 'New Zealand', 'NZD', 'New Zealand Dollar', '$', '🇳🇿', 1.4, 'compliant'),
('PLW', 'Palau', 'USD', 'US Dollar', '$', '🇵🇼', 1.0, 'compliant'),
('PNG', 'Papua New Guinea', 'PGK', 'Papua New Guinean Kina', 'K', '🇵🇬', 3.5, 'compliant'),
('WSM', 'Samoa', 'WST', 'Samoan Tala', 'T', '🇼🇸', 2.6, 'compliant'),
('SLB', 'Solomon Islands', 'SBD', 'Solomon Islands Dollar', '$', '🇸🇧', 8.0, 'compliant'),
('TON', 'Tonga', 'TOP', 'Tongan Pa''anga', 'T$', '🇹🇴', 2.3, 'compliant'),
('TUV', 'Tuvalu', 'AUD', 'Australian Dollar', '$', '🇹🇻', 1.35, 'compliant'),
('VUT', 'Vanuatu', 'VUV', 'Vanuatu Vatu', 'Vt', '🇻🇺', 112.0, 'compliant')

ON CONFLICT (country_code) DO UPDATE SET
    country_name = EXCLUDED.country_name,
    currency_code = EXCLUDED.currency_code,
    currency_name = EXCLUDED.currency_name,
    currency_symbol = EXCLUDED.currency_symbol,
    flag_emoji = EXCLUDED.flag_emoji,
    cred_parity_rate = EXCLUDED.cred_parity_rate,
    compliance_status = EXCLUDED.compliance_status,
    updated_at = CURRENT_TIMESTAMP;

-- Insert default marketplace categories
INSERT INTO marketplace_categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Fashion and apparel'),
('Home & Garden', 'Home improvement and gardening supplies'),
('Books', 'Books and educational materials'),
('Sports', 'Sports equipment and accessories'),
('Health', 'Health and wellness products'),
('Food', 'Food and beverages'),
('Services', 'Professional and personal services')
ON CONFLICT DO NOTHING;

-- Create admin user
INSERT INTO users (email, name, password_hash, role) VALUES
('admin@heavenslive.com', 'Admin User', crypt('admin123', gen_salt('bf')), 'admin'),
('demo@heavenslive.com', 'Demo User', crypt('demo123', gen_salt('bf')), 'user')
ON CONFLICT (email) DO NOTHING;

-- Create useful functions
CREATE OR REPLACE FUNCTION update_currency_parity_rate(
    p_currency_code VARCHAR(3),
    p_new_rate DECIMAL(20,8)
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE global_currencies 
    SET cred_parity_rate = p_new_rate, updated_at = CURRENT_TIMESTAMP
    WHERE currency_code = p_currency_code;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_currencies_country_code ON global_currencies(country_code);
CREATE INDEX IF NOT EXISTS idx_currencies_currency_code ON global_currencies(currency_code);
CREATE INDEX IF NOT EXISTS idx_currencies_active ON global_currencies(is_active);
CREATE INDEX IF NOT EXISTS idx_products_seller ON marketplace_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON marketplace_products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON marketplace_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON marketplace_orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Create view for active currencies
CREATE OR REPLACE VIEW active_currencies AS
SELECT 
    country_code,
    country_name,
    currency_code,
    currency_name,
    currency_symbol,
    flag_emoji,
    cred_parity_rate,
    CONCAT(currency_code, '-CRED') as cred_pair_code,
    compliance_status
FROM global_currencies 
WHERE is_active = true
ORDER BY country_name;

COMMIT;
