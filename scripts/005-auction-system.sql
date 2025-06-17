-- Auction Types and Settings
CREATE TABLE auction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert auction types
INSERT INTO auction_types (name, description) VALUES
('forward', 'Traditional auction - highest bid wins'),
('reverse', 'Reverse auction - lowest bid wins'),
('dutch', 'Dutch auction - price decreases over time'),
('sealed_bid', 'Sealed bid auction - bids hidden until end');

-- Auctions Table
CREATE TABLE auctions (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    seller_id INTEGER NOT NULL REFERENCES users(id),
    
    -- Auction Details
    title VARCHAR(200) NOT NULL,
    description TEXT,
    auction_type VARCHAR(20) DEFAULT 'forward' CHECK (auction_type IN ('forward', 'reverse', 'dutch', 'sealed_bid')),
    
    -- Pricing
    starting_price DECIMAL(15,2) NOT NULL,
    reserve_price DECIMAL(15,2), -- Minimum price for forward auctions
    current_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    buy_now_price DECIMAL(15,2), -- Optional buy-it-now price
    price_increment DECIMAL(15,2) DEFAULT 1.00,
    
    -- Timing
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    auto_extend_minutes INTEGER DEFAULT 5, -- Extend auction if bid in last X minutes
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended', 'cancelled', 'settled')),
    winner_id INTEGER REFERENCES users(id),
    winning_bid_id INTEGER,
    
    -- Settings
    allow_buy_now BOOLEAN DEFAULT FALSE,
    require_approval BOOLEAN DEFAULT FALSE, -- Seller must approve bids
    max_bids_per_user INTEGER DEFAULT 0, -- 0 = unlimited
    min_bid_increment DECIMAL(15,2) DEFAULT 1.00,
    
    -- Metadata
    total_bids INTEGER DEFAULT 0,
    unique_bidders INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP
);

-- Bids Table
CREATE TABLE auction_bids (
    id SERIAL PRIMARY KEY,
    auction_id INTEGER NOT NULL REFERENCES auctions(id),
    bidder_id INTEGER NOT NULL REFERENCES users(id),
    
    -- Bid Details
    bid_amount DECIMAL(15,2) NOT NULL,
    bid_type VARCHAR(20) DEFAULT 'regular' CHECK (bid_type IN ('regular', 'auto', 'buy_now')),
    is_winning BOOLEAN DEFAULT FALSE,
    
    -- Auto-bidding (proxy bidding)
    max_bid_amount DECIMAL(15,2), -- For automatic bidding
    is_auto_bid BOOLEAN DEFAULT FALSE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'outbid', 'winning', 'cancelled', 'invalid')),
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auction Watchers (users following auctions)
CREATE TABLE auction_watchers (
    id SERIAL PRIMARY KEY,
    auction_id INTEGER NOT NULL REFERENCES auctions(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    notification_preferences JSONB DEFAULT '{"bid_placed": true, "outbid": true, "ending_soon": true, "ended": true}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(auction_id, user_id)
);

-- Auction Events Log
CREATE TABLE auction_events (
    id SERIAL PRIMARY KEY,
    auction_id INTEGER NOT NULL REFERENCES auctions(id),
    user_id INTEGER REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL, -- 'bid_placed', 'auction_started', 'auction_ended', 'buy_now', etc.
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auction Categories (for better organization)
CREATE TABLE auction_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES auction_categories(id),
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Insert default auction categories
INSERT INTO auction_categories (name, description, slug, sort_order) VALUES
('Electronics', 'Electronic devices and gadgets', 'electronics', 1),
('Art & Collectibles', 'Artwork, antiques and collectible items', 'art-collectibles', 2),
('Vehicles', 'Cars, motorcycles and other vehicles', 'vehicles', 3),
('Real Estate', 'Property and real estate auctions', 'real-estate', 4),
('Fashion', 'Clothing, accessories and fashion items', 'fashion', 5),
('Sports & Recreation', 'Sports equipment and recreational items', 'sports', 6),
('Business & Industrial', 'Business equipment and industrial items', 'business-industrial', 7),
('Services', 'Service-based auctions and contracts', 'services', 8);

-- Auction Settlement Records
CREATE TABLE auction_settlements (
    id SERIAL PRIMARY KEY,
    auction_id INTEGER NOT NULL REFERENCES auctions(id),
    winner_id INTEGER NOT NULL REFERENCES users(id),
    seller_id INTEGER NOT NULL REFERENCES users(id),
    
    -- Settlement Details
    final_price DECIMAL(15,2) NOT NULL,
    seller_fee DECIMAL(15,2) DEFAULT 0,
    buyer_fee DECIMAL(15,2) DEFAULT 0,
    platform_fee DECIMAL(15,2) DEFAULT 0,
    
    -- Payment
    escrow_transaction_id INTEGER REFERENCES transactions(id),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'disputed')),
    
    -- Delivery
    shipping_required BOOLEAN DEFAULT TRUE,
    shipping_address JSONB,
    tracking_number VARCHAR(100),
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'shipped', 'delivered', 'returned')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_auctions_seller ON auctions(seller_id);
CREATE INDEX idx_auction_bids_auction ON auction_bids(auction_id);
CREATE INDEX idx_auction_bids_bidder ON auction_bids(bidder_id);
CREATE INDEX idx_auction_bids_amount ON auction_bids(bid_amount);
CREATE INDEX idx_auction_events_auction ON auction_events(auction_id);
CREATE INDEX idx_auction_events_type ON auction_events(event_type);

-- Functions for auction management
CREATE OR REPLACE FUNCTION update_auction_current_price()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current price based on auction type
    IF (SELECT auction_type FROM auctions WHERE id = NEW.auction_id) = 'forward' THEN
        -- Forward auction: highest bid wins
        UPDATE auctions 
        SET current_price = NEW.bid_amount,
            total_bids = total_bids + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.auction_id;
        
        -- Mark previous bids as outbid
        UPDATE auction_bids 
        SET status = 'outbid', is_winning = FALSE
        WHERE auction_id = NEW.auction_id AND id != NEW.id;
        
        -- Mark new bid as winning
        UPDATE auction_bids 
        SET status = 'winning', is_winning = TRUE
        WHERE id = NEW.id;
        
    ELSIF (SELECT auction_type FROM auctions WHERE id = NEW.auction_id) = 'reverse' THEN
        -- Reverse auction: lowest bid wins
        UPDATE auctions 
        SET current_price = NEW.bid_amount,
            total_bids = total_bids + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.auction_id;
        
        -- Mark previous bids as outbid
        UPDATE auction_bids 
        SET status = 'outbid', is_winning = FALSE
        WHERE auction_id = NEW.auction_id AND id != NEW.id;
        
        -- Mark new bid as winning
        UPDATE auction_bids 
        SET status = 'winning', is_winning = TRUE
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update auction price when new bid is placed
CREATE TRIGGER trigger_update_auction_price
    AFTER INSERT ON auction_bids
    FOR EACH ROW
    EXECUTE FUNCTION update_auction_current_price();

-- Function to end auctions automatically
CREATE OR REPLACE FUNCTION end_expired_auctions()
RETURNS INTEGER AS $$
DECLARE
    ended_count INTEGER := 0;
    auction_record RECORD;
BEGIN
    -- Find and end expired auctions
    FOR auction_record IN 
        SELECT id FROM auctions 
        WHERE status = 'active' AND end_time <= CURRENT_TIMESTAMP
    LOOP
        -- Update auction status
        UPDATE auctions 
        SET status = 'ended', updated_at = CURRENT_TIMESTAMP
        WHERE id = auction_record.id;
        
        -- Set winner if there are bids
        UPDATE auctions 
        SET winner_id = (
            SELECT bidder_id FROM auction_bids 
            WHERE auction_id = auction_record.id AND is_winning = TRUE 
            LIMIT 1
        )
        WHERE id = auction_record.id;
        
        ended_count := ended_count + 1;
    END LOOP;
    
    RETURN ended_count;
END;
$$ LANGUAGE plpgsql;

-- Update system settings for auctions
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('auction_seller_fee', '2.5', 'Seller fee percentage for auctions'),
('auction_buyer_fee', '1.0', 'Buyer fee percentage for auctions'),
('auction_min_duration_hours', '1', 'Minimum auction duration in hours'),
('auction_max_duration_days', '30', 'Maximum auction duration in days'),
('auction_auto_extend_enabled', 'true', 'Enable automatic auction extension'),
('auction_reserve_price_enabled', 'true', 'Enable reserve price auctions'),
('auction_buy_now_enabled', 'true', 'Enable buy-it-now feature');
