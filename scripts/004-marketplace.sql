-- Product Categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50), -- Icon name for UI
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace Listings
CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    
    -- Pricing
    price DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(10) NOT NULL DEFAULT 'USD-CRED',
    price_type VARCHAR(20) DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'negotiable', 'auction')),
    
    -- Product details
    condition VARCHAR(20) DEFAULT 'new' CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
    quantity INTEGER DEFAULT 1,
    sku VARCHAR(50),
    brand VARCHAR(100),
    model VARCHAR(100),
    
    -- Shipping
    shipping_required BOOLEAN DEFAULT TRUE,
    shipping_cost DECIMAL(15,2) DEFAULT 0,
    shipping_from_country VARCHAR(3), -- ISO country code
    ships_to_countries TEXT[], -- Array of country codes
    processing_time_days INTEGER DEFAULT 3,
    
    -- Digital products
    is_digital BOOLEAN DEFAULT FALSE,
    digital_delivery_method VARCHAR(50), -- 'download', 'email', 'platform'
    
    -- Listing status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'sold', 'expired', 'removed')),
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP,
    
    -- SEO and discovery
    tags TEXT[],
    search_keywords TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Listing Images
CREATE TABLE listing_images (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listing Views and Analytics
CREATE TABLE listing_views (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    viewer_id INTEGER REFERENCES users(id), -- NULL for anonymous views
    viewer_ip VARCHAR(45),
    viewer_country VARCHAR(3),
    referrer VARCHAR(500),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    buyer_id INTEGER NOT NULL REFERENCES users(id),
    seller_id INTEGER NOT NULL REFERENCES users(id),
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    
    -- Order details
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    shipping_cost DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    
    -- Escrow
    escrow_transaction_id INTEGER REFERENCES transactions(id),
    escrow_fee DECIMAL(15,2) DEFAULT 0,
    escrow_status VARCHAR(20) DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'funded', 'released', 'disputed', 'refunded')),
    
    -- Order status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed')),
    
    -- Shipping
    shipping_address JSONB,
    tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(50),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Order Messages (buyer-seller communication)
CREATE TABLE order_messages (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    is_system_message BOOLEAN DEFAULT FALSE,
    attachments JSONB, -- File attachments metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews and Ratings
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    reviewer_id INTEGER NOT NULL REFERENCES users(id),
    reviewed_user_id INTEGER NOT NULL REFERENCES users(id), -- seller or buyer
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    
    -- Review categories
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    shipping_rating INTEGER CHECK (shipping_rating >= 1 AND shipping_rating <= 5),
    item_quality_rating INTEGER CHECK (item_quality_rating >= 1 AND item_quality_rating <= 5),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'flagged')),
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    
    -- Response
    seller_response TEXT,
    seller_response_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disputes
CREATE TABLE disputes (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    complainant_id INTEGER NOT NULL REFERENCES users(id),
    respondent_id INTEGER NOT NULL REFERENCES users(id),
    
    -- Dispute details
    dispute_type VARCHAR(50) NOT NULL CHECK (dispute_type IN ('item_not_received', 'item_not_as_described', 'damaged_item', 'wrong_item', 'refund_request', 'other')),
    description TEXT NOT NULL,
    evidence JSONB, -- Photos, documents, etc.
    
    -- Resolution
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    resolution TEXT,
    resolved_by INTEGER REFERENCES users(id),
    resolution_amount DECIMAL(15,2),
    resolution_type VARCHAR(50), -- 'full_refund', 'partial_refund', 'replacement', 'no_action'
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Featured Listings (paid promotion)
CREATE TABLE featured_listings (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    
    -- Feature details
    feature_type VARCHAR(20) DEFAULT 'homepage' CHECK (feature_type IN ('homepage', 'category', 'search')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_fee DECIMAL(15,2) DEFAULT 0.19,
    
    -- Payment
    payment_transaction_id INTEGER REFERENCES transactions(id),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- Performance
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seller Verification
CREATE TABLE seller_verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    
    -- Verification details
    business_name VARCHAR(200),
    business_type VARCHAR(50), -- 'individual', 'business', 'corporation'
    tax_id VARCHAR(50),
    business_address JSONB,
    
    -- Documents
    documents JSONB, -- Store document metadata
    
    -- Verification status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'expired')),
    verified_by INTEGER REFERENCES users(id),
    verification_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Saved Listings (user favorites)
CREATE TABLE saved_listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

-- Insert default categories
INSERT INTO categories (name, description, slug, icon, sort_order) VALUES
('Electronics', 'Computers, phones, gadgets and electronic devices', 'electronics', 'Smartphone', 1),
('Fashion & Clothing', 'Clothing, shoes, accessories and fashion items', 'fashion', 'Shirt', 2),
('Home & Garden', 'Furniture, decor, tools and home improvement', 'home-garden', 'Home', 3),
('Sports & Recreation', 'Sports equipment, outdoor gear and recreational items', 'sports', 'Dumbbell', 4),
('Books & Media', 'Books, movies, music and educational materials', 'books-media', 'Book', 5),
('Automotive', 'Cars, motorcycles, parts and automotive accessories', 'automotive', 'Car', 6),
('Health & Beauty', 'Cosmetics, health products and wellness items', 'health-beauty', 'Heart', 7),
('Services', 'Professional services, consulting and digital services', 'services', 'Briefcase', 8),
('Art & Collectibles', 'Artwork, antiques, collectibles and handmade items', 'art-collectibles', 'Palette', 9),
('Baby & Kids', 'Baby products, toys, children clothing and accessories', 'baby-kids', 'Baby', 10);

-- Insert subcategories for Electronics
INSERT INTO categories (name, description, slug, parent_id, sort_order) VALUES
('Smartphones', 'Mobile phones and accessories', 'smartphones', 1, 1),
('Computers', 'Laptops, desktops and computer accessories', 'computers', 1, 2),
('Gaming', 'Video games, consoles and gaming accessories', 'gaming', 1, 3),
('Audio', 'Headphones, speakers and audio equipment', 'audio', 1, 4);

-- Update system settings for marketplace
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('featured_listing_fee', '0.19', 'Monthly fee for featured listings in CRED'),
('escrow_fee_min', '0.01', 'Minimum escrow fee percentage'),
('escrow_fee_max', '1.00', 'Maximum escrow fee percentage'),
('max_listing_images', '10', 'Maximum number of images per listing'),
('listing_expiry_days', '90', 'Default listing expiry in days'),
('dispute_resolution_days', '14', 'Days to resolve disputes'),
('seller_verification_required', 'false', 'Require seller verification for listings'),
('international_shipping_enabled', 'true', 'Enable international shipping options');

-- Indexes for performance
CREATE INDEX idx_listings_seller ON listings(seller_id);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_featured ON listings(is_featured, featured_until);
CREATE INDEX idx_listings_search ON listings USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_listing ON reviews(listing_id);
CREATE INDEX idx_reviews_user ON reviews(reviewed_user_id);
