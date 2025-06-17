-- AI & Automation System - Simplified Version
-- Core tables for AI features and automation

-- User behavior tracking for recommendations
CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'view', 'purchase', 'search', 'like'
    target_type VARCHAR(50) NOT NULL, -- 'product', 'listing', 'auction'
    target_id INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}', -- Additional interaction data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product recommendations cache
CREATE TABLE IF NOT EXISTS product_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL, -- 'collaborative', 'content_based', 'trending'
    score DECIMAL(5,4) DEFAULT 0.0000, -- Recommendation strength 0-1
    reason TEXT, -- Why this was recommended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- Search analytics and optimization
CREATE TABLE IF NOT EXISTS search_analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    search_query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    clicked_result_id INTEGER,
    search_filters JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI-powered fraud detection alerts
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'suspicious_login', 'unusual_transaction', 'fake_listing'
    risk_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    description TEXT,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'false_positive'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- AI chatbot conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID DEFAULT gen_random_uuid(),
    message_type VARCHAR(20) NOT NULL, -- 'user', 'ai'
    message_content TEXT NOT NULL,
    intent VARCHAR(100), -- Detected user intent
    confidence_score DECIMAL(3,2), -- AI confidence in response
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dynamic pricing suggestions
CREATE TABLE IF NOT EXISTS pricing_suggestions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    suggested_price DECIMAL(10,2) NOT NULL,
    reason TEXT,
    market_data JSONB DEFAULT '{}',
    confidence_score DECIMAL(3,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'applied', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type, target_type);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_user_id ON product_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_expires ON product_recommendations(expires_at);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(search_query);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_suggestions_status ON pricing_suggestions(status);

-- Insert some demo data for AI features
INSERT INTO user_interactions (user_id, interaction_type, target_type, target_id, metadata) VALUES
(1, 'view', 'product', 1, '{"duration_seconds": 45}'),
(1, 'search', 'product', 0, '{"query": "electronics", "results_shown": 12}'),
(1, 'purchase', 'product', 1, '{"amount": 299.99, "payment_method": "CRED"}'),
(2, 'view', 'product', 2, '{"duration_seconds": 30}'),
(2, 'like', 'product', 2, '{"added_to_wishlist": true}')
ON CONFLICT DO NOTHING;

INSERT INTO product_recommendations (user_id, product_id, recommendation_type, score, reason) VALUES
(1, 2, 'collaborative', 0.8500, 'Users who bought similar items also liked this'),
(1, 3, 'content_based', 0.7200, 'Similar category and features to your recent purchases'),
(1, 4, 'trending', 0.6800, 'Popular item in your area of interest'),
(2, 1, 'collaborative', 0.9100, 'Highly rated by users with similar preferences'),
(2, 5, 'content_based', 0.7800, 'Matches your browsing history patterns')
ON CONFLICT DO NOTHING;

INSERT INTO search_analytics (user_id, search_query, results_count, search_filters) VALUES
(1, 'wireless headphones', 8, '{"category": "electronics", "price_range": "100-300"}'),
(1, 'gaming laptop', 5, '{"category": "computers", "brand": "any"}'),
(2, 'vintage clothing', 12, '{"category": "fashion", "condition": "used"}'),
(NULL, 'cryptocurrency guide', 3, '{"category": "education"}')
ON CONFLICT DO NOTHING;

INSERT INTO fraud_alerts (user_id, alert_type, risk_score, description, metadata) VALUES
(1, 'unusual_transaction', 0.75, 'Large transaction from new location', '{"amount": 5000, "location": "Unknown City"}'),
(2, 'suspicious_login', 0.60, 'Login attempt from unusual device', '{"device": "Unknown Browser", "ip_country": "Different Country"}')
ON CONFLICT DO NOTHING;

INSERT INTO ai_conversations (user_id, conversation_id, message_type, message_content, intent, confidence_score) VALUES
(1, gen_random_uuid(), 'user', 'How do I track my order?', 'order_tracking', 0.95),
(1, gen_random_uuid(), 'ai', 'I can help you track your order. Please provide your order number or I can look up your recent orders.', 'support_response', 0.90),
(2, gen_random_uuid(), 'user', 'What are the fees for selling?', 'seller_inquiry', 0.88),
(2, gen_random_uuid(), 'ai', 'Our selling fees are very competitive. Standard listings are free, with a small transaction fee only when you make a sale.', 'support_response', 0.92)
ON CONFLICT DO NOTHING;

INSERT INTO pricing_suggestions (product_id, current_price, suggested_price, reason, confidence_score) VALUES
(1, 299.99, 279.99, 'Market analysis shows similar products selling 7% lower', 0.82),
(2, 149.99, 169.99, 'High demand detected, competitors pricing higher', 0.78),
(3, 89.99, 89.99, 'Current price is optimal based on market conditions', 0.91)
ON CONFLICT DO NOTHING;
