-- Add flag emoji column to global_currencies table
ALTER TABLE global_currencies ADD COLUMN IF NOT EXISTS flag_emoji VARCHAR(10);

-- Update all countries with their flag emojis
UPDATE global_currencies SET flag_emoji = '🇺🇸' WHERE country_code = 'USA';
UPDATE global_currencies SET flag_emoji = '🇪🇺' WHERE country_code = 'EUR';
UPDATE global_currencies SET flag_emoji = '🇬🇧' WHERE country_code = 'GBR';
UPDATE global_currencies SET flag_emoji = '🇯🇵' WHERE country_code = 'JPN';
UPDATE global_currencies SET flag_emoji = '🇨🇳' WHERE country_code = 'CHN';
UPDATE global_currencies SET flag_emoji = '🇮🇳' WHERE country_code = 'IND';
UPDATE global_currencies SET flag_emoji = '🇨🇦' WHERE country_code = 'CAN';
UPDATE global_currencies SET flag_emoji = '🇦🇺' WHERE country_code = 'AUS';
UPDATE global_currencies SET flag_emoji = '🇨🇭' WHERE country_code = 'CHE';
UPDATE global_currencies SET flag_emoji = '🇰🇷' WHERE country_code = 'KOR';

-- Africa
UPDATE global_currencies SET flag_emoji = '🇩🇿' WHERE country_code = 'DZA';
UPDATE global_currencies SET flag_emoji = '🇦🇴' WHERE country_code = 'AGO';
UPDATE global_currencies SET flag_emoji = '🇧🇯' WHERE country_code = 'BEN';
UPDATE global_currencies SET flag_emoji = '🇧🇼' WHERE country_code = 'BWA';
UPDATE global_currencies SET flag_emoji = '🇧🇫' WHERE country_code = 'BFA';
UPDATE global_currencies SET flag_emoji = '🇧🇮' WHERE country_code = 'BDI';
UPDATE global_currencies SET flag_emoji = '🇨🇲' WHERE country_code = 'CMR';
UPDATE global_currencies SET flag_emoji = '🇨🇻' WHERE country_code = 'CPV';
UPDATE global_currencies SET flag_emoji = '🇨🇫' WHERE country_code = 'CAF';
UPDATE global_currencies SET flag_emoji = '🇹🇩' WHERE country_code = 'TCD';
UPDATE global_currencies SET flag_emoji = '🇰🇲' WHERE country_code = 'COM';
UPDATE global_currencies SET flag_emoji = '🇨🇬' WHERE country_code = 'COG';
UPDATE global_currencies SET flag_emoji = '🇨🇩' WHERE country_code = 'COD';
UPDATE global_currencies SET flag_emoji = '🇨🇮' WHERE country_code = 'CIV';
UPDATE global_currencies SET flag_emoji = '🇩🇯' WHERE country_code = 'DJI';
UPDATE global_currencies SET flag_emoji = '🇪🇬' WHERE country_code = 'EGY';
UPDATE global_currencies SET flag_emoji = '🇬🇶' WHERE country_code = 'GNQ';
UPDATE global_currencies SET flag_emoji = '🇪🇷' WHERE country_code = 'ERI';
UPDATE global_currencies SET flag_emoji = '🇸🇿' WHERE country_code = 'SWZ';
UPDATE global_currencies SET flag_emoji = '🇪🇹' WHERE country_code = 'ETH';
UPDATE global_currencies SET flag_emoji = '🇬🇦' WHERE country_code = 'GAB';
UPDATE global_currencies SET flag_emoji = '🇬🇲' WHERE country_code = 'GMB';
UPDATE global_currencies SET flag_emoji = '🇬🇭' WHERE country_code = 'GHA';
UPDATE global_currencies SET flag_emoji = '🇬🇳' WHERE country_code = 'GIN';
UPDATE global_currencies SET flag_emoji = '🇬🇼' WHERE country_code = 'GNB';
UPDATE global_currencies SET flag_emoji = '🇰🇪' WHERE country_code = 'KEN';
UPDATE global_currencies SET flag_emoji = '🇱🇸' WHERE country_code = 'LSO';
UPDATE global_currencies SET flag_emoji = '🇱🇷' WHERE country_code = 'LBR';
UPDATE global_currencies SET flag_emoji = '🇱🇾' WHERE country_code = 'LBY';
UPDATE global_currencies SET flag_emoji = '🇲🇬' WHERE country_code = 'MDG';
UPDATE global_currencies SET flag_emoji = '🇲🇼' WHERE country_code = 'MWI';
UPDATE global_currencies SET flag_emoji = '🇲🇱' WHERE country_code = 'MLI';
UPDATE global_currencies SET flag_emoji = '🇲🇷' WHERE country_code = 'MRT';
UPDATE global_currencies SET flag_emoji = '🇲🇺' WHERE country_code = 'MUS';
UPDATE global_currencies SET flag_emoji = '🇲🇦' WHERE country_code = 'MAR';
UPDATE global_currencies SET flag_emoji = '🇲🇿' WHERE country_code = 'MOZ';
UPDATE global_currencies SET flag_emoji = '🇳🇦' WHERE country_code = 'NAM';
UPDATE global_currencies SET flag_emoji = '🇳🇪' WHERE country_code = 'NER';
UPDATE global_currencies SET flag_emoji = '🇳🇬' WHERE country_code = 'NGA';
UPDATE global_currencies SET flag_emoji = '🇷🇼' WHERE country_code = 'RWA';
UPDATE global_currencies SET flag_emoji = '🇸🇹' WHERE country_code = 'STP';
UPDATE global_currencies SET flag_emoji = '🇸🇳' WHERE country_code = 'SEN';
UPDATE global_currencies SET flag_emoji = '🇸🇨' WHERE country_code = 'SYC';
UPDATE global_currencies SET flag_emoji = '🇸🇱' WHERE country_code = 'SLE';
UPDATE global_currencies SET flag_emoji = '🇸🇴' WHERE country_code = 'SOM';
UPDATE global_currencies SET flag_emoji = '🇿🇦' WHERE country_code = 'ZAF';
UPDATE global_currencies SET flag_emoji = '🇸🇸' WHERE country_code = 'SSD';
UPDATE global_currencies SET flag_emoji = '🇸🇩' WHERE country_code = 'SDN';
UPDATE global_currencies SET flag_emoji = '🇹🇿' WHERE country_code = 'TZA';
UPDATE global_currencies SET flag_emoji = '🇹🇬' WHERE country_code = 'TGO';
UPDATE global_currencies SET flag_emoji = '🇹🇳' WHERE country_code = 'TUN';
UPDATE global_currencies SET flag_emoji = '🇺🇬' WHERE country_code = 'UGA';
UPDATE global_currencies SET flag_emoji = '🇿🇲' WHERE country_code = 'ZMB';
UPDATE global_currencies SET flag_emoji = '🇿🇼' WHERE country_code = 'ZWE';

-- Asia
UPDATE global_currencies SET flag_emoji = '🇦🇫' WHERE country_code = 'AFG';
UPDATE global_currencies SET flag_emoji = '🇦🇲' WHERE country_code = 'ARM';
UPDATE global_currencies SET flag_emoji = '🇦🇿' WHERE country_code = 'AZE';
UPDATE global_currencies SET flag_emoji = '🇧🇭' WHERE country_code = 'BHR';
UPDATE global_currencies SET flag_emoji = '🇧🇩' WHERE country_code = 'BGD';
UPDATE global_currencies SET flag_emoji = '🇧🇹' WHERE country_code = 'BTN';
UPDATE global_currencies SET flag_emoji = '🇧🇳' WHERE country_code = 'BRN';
UPDATE global_currencies SET flag_emoji = '🇰🇭' WHERE country_code = 'KHM';
UPDATE global_currencies SET flag_emoji = '🇬🇪' WHERE country_code = 'GEO';
UPDATE global_currencies SET flag_emoji = '🇮🇩' WHERE country_code = 'IDN';
UPDATE global_currencies SET flag_emoji = '🇮🇷' WHERE country_code = 'IRN';
UPDATE global_currencies SET flag_emoji = '🇮🇶' WHERE country_code = 'IRQ';
UPDATE global_currencies SET flag_emoji = '🇮🇱' WHERE country_code = 'ISR';
UPDATE global_currencies SET flag_emoji = '🇯🇴' WHERE country_code = 'JOR';
UPDATE global_currencies SET flag_emoji = '🇰🇿' WHERE country_code = 'KAZ';
UPDATE global_currencies SET flag_emoji = '🇰🇼' WHERE country_code = 'KWT';
UPDATE global_currencies SET flag_emoji = '🇰🇬' WHERE country_code = 'KGZ';
UPDATE global_currencies SET flag_emoji = '🇱🇦' WHERE country_code = 'LAO';
UPDATE global_currencies SET flag_emoji = '🇱🇧' WHERE country_code = 'LBN';
UPDATE global_currencies SET flag_emoji = '🇲🇾' WHERE country_code = 'MYS';
UPDATE global_currencies SET flag_emoji = '🇲🇻' WHERE country_code = 'MDV';
UPDATE global_currencies SET flag_emoji = '🇲🇳' WHERE country_code = 'MNG';
UPDATE global_currencies SET flag_emoji = '🇲🇲' WHERE country_code = 'MMR';
UPDATE global_currencies SET flag_emoji = '🇳🇵' WHERE country_code = 'NPL';
UPDATE global_currencies SET flag_emoji = '🇰🇵' WHERE country_code = 'PRK';
UPDATE global_currencies SET flag_emoji = '🇴🇲' WHERE country_code = 'OMN';
UPDATE global_currencies SET flag_emoji = '🇵🇰' WHERE country_code = 'PAK';
UPDATE global_currencies SET flag_emoji = '🇵🇭' WHERE country_code = 'PHL';
UPDATE global_currencies SET flag_emoji = '🇶🇦' WHERE country_code = 'QAT';
UPDATE global_currencies SET flag_emoji = '🇸🇦' WHERE country_code = 'SAU';
UPDATE global_currencies SET flag_emoji = '🇸🇬' WHERE country_code = 'SGP';
UPDATE global_currencies SET flag_emoji = '🇱🇰' WHERE country_code = 'LKA';
UPDATE global_currencies SET flag_emoji = '🇸🇾' WHERE country_code = 'SYR';
UPDATE global_currencies SET flag_emoji = '🇹🇼' WHERE country_code = 'TWN';
UPDATE global_currencies SET flag_emoji = '🇹🇯' WHERE country_code = 'TJK';
UPDATE global_currencies SET flag_emoji = '🇹🇭' WHERE country_code = 'THA';
UPDATE global_currencies SET flag_emoji = '🇹🇱' WHERE country_code = 'TLS';
UPDATE global_currencies SET flag_emoji = '🇹🇷' WHERE country_code = 'TUR';
UPDATE global_currencies SET flag_emoji = '🇹🇲' WHERE country_code = 'TKM';
UPDATE global_currencies SET flag_emoji = '🇦🇪' WHERE country_code = 'ARE';
UPDATE global_currencies SET flag_emoji = '🇺🇿' WHERE country_code = 'UZB';
UPDATE global_currencies SET flag_emoji = '🇻🇳' WHERE country_code = 'VNM';
UPDATE global_currencies SET flag_emoji = '🇾🇪' WHERE country_code = 'YEM';

-- Europe
UPDATE global_currencies SET flag_emoji = '🇦🇱' WHERE country_code = 'ALB';
UPDATE global_currencies SET flag_emoji = '🇦🇩' WHERE country_code = 'AND';
UPDATE global_currencies SET flag_emoji = '🇦🇹' WHERE country_code = 'AUT';
UPDATE global_currencies SET flag_emoji = '🇧🇾' WHERE country_code = 'BLR';
UPDATE global_currencies SET flag_emoji = '🇧🇪' WHERE country_code = 'BEL';
UPDATE global_currencies SET flag_emoji = '🇧🇦' WHERE country_code = 'BIH';
UPDATE global_currencies SET flag_emoji = '🇧🇬' WHERE country_code = 'BGR';
UPDATE global_currencies SET flag_emoji = '🇭🇷' WHERE country_code = 'HRV';
UPDATE global_currencies SET flag_emoji = '🇨🇾' WHERE country_code = 'CYP';
UPDATE global_currencies SET flag_emoji = '🇨🇿' WHERE country_code = 'CZE';
UPDATE global_currencies SET flag_emoji = '🇩🇰' WHERE country_code = 'DNK';
UPDATE global_currencies SET flag_emoji = '🇪🇪' WHERE country_code = 'EST';
UPDATE global_currencies SET flag_emoji = '🇫🇮' WHERE country_code = 'FIN';
UPDATE global_currencies SET flag_emoji = '🇫🇷' WHERE country_code = 'FRA';
UPDATE global_currencies SET flag_emoji = '🇩🇪' WHERE country_code = 'DEU';
UPDATE global_currencies SET flag_emoji = '🇬🇷' WHERE country_code = 'GRC';
UPDATE global_currencies SET flag_emoji = '🇭🇺' WHERE country_code = 'HUN';
UPDATE global_currencies SET flag_emoji = '🇮🇸' WHERE country_code = 'ISL';
UPDATE global_currencies SET flag_emoji = '🇮🇪' WHERE country_code = 'IRL';
UPDATE global_currencies SET flag_emoji = '🇮🇹' WHERE country_code = 'ITA';
UPDATE global_currencies SET flag_emoji = '🇽🇰' WHERE country_code = 'XKX';
UPDATE global_currencies SET flag_emoji = '🇱🇻' WHERE country_code = 'LVA';
UPDATE global_currencies SET flag_emoji = '🇱🇮' WHERE country_code = 'LIE';
UPDATE global_currencies SET flag_emoji = '🇱🇹' WHERE country_code = 'LTU';
UPDATE global_currencies SET flag_emoji = '🇱🇺' WHERE country_code = 'LUX';
UPDATE global_currencies SET flag_emoji = '🇲🇹' WHERE country_code = 'MLT';
UPDATE global_currencies SET flag_emoji = '🇲🇩' WHERE country_code = 'MDA';
UPDATE global_currencies SET flag_emoji = '🇲🇨' WHERE country_code = 'MCO';
UPDATE global_currencies SET flag_emoji = '🇲🇪' WHERE country_code = 'MNE';
UPDATE global_currencies SET flag_emoji = '🇳🇱' WHERE country_code = 'NLD';
UPDATE global_currencies SET flag_emoji = '🇲🇰' WHERE country_code = 'MKD';
UPDATE global_currencies SET flag_emoji = '🇳🇴' WHERE country_code = 'NOR';
UPDATE global_currencies SET flag_emoji = '🇵🇱' WHERE country_code = 'POL';
UPDATE global_currencies SET flag_emoji = '🇵🇹' WHERE country_code = 'PRT';
UPDATE global_currencies SET flag_emoji = '🇷🇴' WHERE country_code = 'ROU';
UPDATE global_currencies SET flag_emoji = '🇷🇺' WHERE country_code = 'RUS';
UPDATE global_currencies SET flag_emoji = '🇸🇲' WHERE country_code = 'SMR';
UPDATE global_currencies SET flag_emoji = '🇷🇸' WHERE country_code = 'SRB';
UPDATE global_currencies SET flag_emoji = '🇸🇰' WHERE country_code = 'SVK';
UPDATE global_currencies SET flag_emoji = '🇸🇮' WHERE country_code = 'SVN';
UPDATE global_currencies SET flag_emoji = '🇪🇸' WHERE country_code = 'ESP';
UPDATE global_currencies SET flag_emoji = '🇸🇪' WHERE country_code = 'SWE';
UPDATE global_currencies SET flag_emoji = '🇺🇦' WHERE country_code = 'UKR';
UPDATE global_currencies SET flag_emoji = '🇻🇦' WHERE country_code = 'VAT';

-- North America
UPDATE global_currencies SET flag_emoji = '🇦🇬' WHERE country_code = 'ATG';
UPDATE global_currencies SET flag_emoji = '🇧🇸' WHERE country_code = 'BHS';
UPDATE global_currencies SET flag_emoji = '🇧🇧' WHERE country_code = 'BRB';
UPDATE global_currencies SET flag_emoji = '🇧🇿' WHERE country_code = 'BLZ';
UPDATE global_currencies SET flag_emoji = '🇨🇷' WHERE country_code = 'CRI';
UPDATE global_currencies SET flag_emoji = '🇨🇺' WHERE country_code = 'CUB';
UPDATE global_currencies SET flag_emoji = '🇩🇲' WHERE country_code = 'DMA';
UPDATE global_currencies SET flag_emoji = '🇩🇴' WHERE country_code = 'DOM';
UPDATE global_currencies SET flag_emoji = '🇸🇻' WHERE country_code = 'SLV';
UPDATE global_currencies SET flag_emoji = '🇬🇩' WHERE country_code = 'GRD';
UPDATE global_currencies SET flag_emoji = '🇬🇹' WHERE country_code = 'GTM';
UPDATE global_currencies SET flag_emoji = '🇭🇹' WHERE country_code = 'HTI';
UPDATE global_currencies SET flag_emoji = '🇭🇳' WHERE country_code = 'HND';
UPDATE global_currencies SET flag_emoji = '🇯🇲' WHERE country_code = 'JAM';
UPDATE global_currencies SET flag_emoji = '🇲🇽' WHERE country_code = 'MEX';
UPDATE global_currencies SET flag_emoji = '🇳🇮' WHERE country_code = 'NIC';
UPDATE global_currencies SET flag_emoji = '🇵🇦' WHERE country_code = 'PAN';
UPDATE global_currencies SET flag_emoji = '🇰🇳' WHERE country_code = 'KNA';
UPDATE global_currencies SET flag_emoji = '🇱🇨' WHERE country_code = 'LCA';
UPDATE global_currencies SET flag_emoji = '🇻🇨' WHERE country_code = 'VCT';
UPDATE global_currencies SET flag_emoji = '🇹🇹' WHERE country_code = 'TTO';

-- South America
UPDATE global_currencies SET flag_emoji = '🇦🇷' WHERE country_code = 'ARG';
UPDATE global_currencies SET flag_emoji = '🇧🇴' WHERE country_code = 'BOL';
UPDATE global_currencies SET flag_emoji = '🇧🇷' WHERE country_code = 'BRA';
UPDATE global_currencies SET flag_emoji = '🇨🇱' WHERE country_code = 'CHL';
UPDATE global_currencies SET flag_emoji = '🇨🇴' WHERE country_code = 'COL';
UPDATE global_currencies SET flag_emoji = '🇪🇨' WHERE country_code = 'ECU';
UPDATE global_currencies SET flag_emoji = '🇬🇾' WHERE country_code = 'GUY';
UPDATE global_currencies SET flag_emoji = '🇵🇾' WHERE country_code = 'PRY';
UPDATE global_currencies SET flag_emoji = '🇵🇪' WHERE country_code = 'PER';
UPDATE global_currencies SET flag_emoji = '🇸🇷' WHERE country_code = 'SUR';
UPDATE global_currencies SET flag_emoji = '🇺🇾' WHERE country_code = 'URY';
UPDATE global_currencies SET flag_emoji = '🇻🇪' WHERE country_code = 'VEN';

-- Oceania
UPDATE global_currencies SET flag_emoji = '🇫🇯' WHERE country_code = 'FJI';
UPDATE global_currencies SET flag_emoji = '🇰🇮' WHERE country_code = 'KIR';
UPDATE global_currencies SET flag_emoji = '🇲🇭' WHERE country_code = 'MHL';
UPDATE global_currencies SET flag_emoji = '🇫🇲' WHERE country_code = 'FSM';
UPDATE global_currencies SET flag_emoji = '🇳🇷' WHERE country_code = 'NRU';
UPDATE global_currencies SET flag_emoji = '🇳🇿' WHERE country_code = 'NZL';
UPDATE global_currencies SET flag_emoji = '🇵🇼' WHERE country_code = 'PLW';
UPDATE global_currencies SET flag_emoji = '🇵🇬' WHERE country_code = 'PNG';
UPDATE global_currencies SET flag_emoji = '🇼🇸' WHERE country_code = 'WSM';
UPDATE global_currencies SET flag_emoji = '🇸🇧' WHERE country_code = 'SLB';
UPDATE global_currencies SET flag_emoji = '🇹🇴' WHERE country_code = 'TON';
UPDATE global_currencies SET flag_emoji = '🇹🇻' WHERE country_code = 'TUV';
UPDATE global_currencies SET flag_emoji = '🇻🇺' WHERE country_code = 'VUT';

-- Special CRED flag
UPDATE global_currencies SET flag_emoji = '₢' WHERE country_code = 'CRED';

-- Update the view to include flag emojis
CREATE OR REPLACE VIEW active_currencies AS
SELECT 
  country_code,
  country_name,
  currency_code,
  currency_name,
  currency_symbol,
  flag_emoji,
  cred_parity_rate,
  CONCAT(currency_code, '-CRED') as cred_pair_code
FROM global_currencies 
WHERE is_active = true
ORDER BY country_name;
