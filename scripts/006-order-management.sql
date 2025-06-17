-- Enhanced Order Management System
-- Comprehensive order processing, fulfillment, and customer service

-- Order statuses and workflow
CREATE TABLE IF NOT EXISTS order_statuses (
    id SERIAL PRIMARY KEY,
    status_code VARCHAR(50) UNIQUE NOT NULL,
    status_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default order statuses
INSERT INTO order_statuses (status_code, status_name, description, sort_order) VALUES
('pending_payment', 'Pending Payment', 'Order created, awaiting payment confirmation', 1),
('payment_confirmed', 'Payment Confirmed', 'Payment received and confirmed', 2),
('processing', 'Processing', 'Order is being prepared by seller', 3),
('shipped', 'Shipped', 'Order has been shipped to customer', 4),
('in_transit', 'In Transit', 'Order is on the way to customer', 5),
('delivered', 'Delivered', 'Order successfully delivered to customer', 6),
('completed', 'Completed', 'Order completed and confirmed by customer', 7),
('cancelled', 'Cancelled', 'Order was cancelled', 8),
('refunded', 'Refunded', 'Order was refunded to customer', 9),
('disputed', 'Disputed', 'Order is under dispute resolution', 10)
ON CONFLICT (status_code) DO NOTHING;

-- Enhanced orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    
    -- Order details
    total_amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(10) DEFAULT 'CRED',
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Status and workflow
    status VARCHAR(50) REFERENCES order_statuses(status_code) DEFAULT 'pending_payment',
    payment_status VARCHAR(50) DEFAULT 'pending',
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
    
    -- Source tracking
    source_type VARCHAR(50) DEFAULT 'marketplace', -- 'marketplace', 'auction', 'direct'
    source_id INTEGER, -- marketplace_listing_id or auction_id
    
    -- Shipping information
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    
    -- Tracking
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    estimated_delivery DATE,
    actual_delivery_date TIMESTAMP,
    
    -- Notes and communication
    buyer_notes TEXT,
    seller_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Order items (products in each order)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES marketplace_listings(id),
    
    -- Item details
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    
    -- Product snapshot (in case product changes)
    product_description TEXT,
    product_image_url VARCHAR(500),
    seller_id INTEGER REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order status history (audit trail)
CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    change_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order communications (messages between buyer/seller)
CREATE TABLE IF NOT EXISTS order_messages (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    message_type VARCHAR(50) DEFAULT 'general', -- 'general', 'shipping_update', 'issue', 'resolution'
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_internal BOOLEAN DEFAULT false, -- for admin notes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping methods
CREATE TABLE IF NOT EXISTS shipping_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_cost DECIMAL(10,2) NOT NULL,
    cost_per_kg DECIMAL(10,2) DEFAULT 0,
    estimated_days_min INTEGER DEFAULT 1,
    estimated_days_max INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default shipping methods
INSERT INTO shipping_methods (name, description, base_cost, estimated_days_min, estimated_days_max) VALUES
('Standard Shipping', 'Regular delivery service', 5.00, 3, 7),
('Express Shipping', 'Fast delivery service', 15.00, 1, 3),
('Overnight Shipping', 'Next day delivery', 25.00, 1, 1),
('Free Shipping', 'Free standard delivery', 0.00, 5, 10)
ON CONFLICT DO NOTHING;

-- Order disputes and returns
CREATE TABLE IF NOT EXISTS order_disputes (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    initiated_by INTEGER REFERENCES users(id),
    dispute_type VARCHAR(50) NOT NULL, -- 'return', 'refund', 'quality', 'shipping', 'other'
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
    resolution TEXT,
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order reviews and ratings
CREATE TABLE IF NOT EXISTS order_reviews (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES users(id),
    reviewed_user_id INTEGER REFERENCES users(id), -- seller being reviewed
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_type VARCHAR(50) DEFAULT 'seller', -- 'seller', 'product', 'shipping'
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_order_id ON order_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_order_disputes_order_id ON order_disputes(order_id);

-- Demo data for order management
INSERT INTO orders (order_number, buyer_id, seller_id, total_amount, status, source_type, shipping_address_line1, shipping_city, shipping_state, shipping_postal_code, shipping_country) VALUES
('ORD-2024-001', 1, 2, 299.99, 'processing', 'marketplace', '123 Main St', 'New York', 'NY', '10001', 'USA'),
('ORD-2024-002', 2, 1, 149.50, 'shipped', 'auction', '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'USA'),
('ORD-2024-003', 1, 3, 89.99, 'delivered', 'marketplace', '789 Pine Rd', 'Chicago', 'IL', '60601', 'USA'),
('ORD-2024-004', 3, 2, 199.99, 'pending_payment', 'marketplace', '321 Elm St', 'Houston', 'TX', '77001', 'USA'),
('ORD-2024-005', 2, 1, 449.99, 'completed', 'auction', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'USA')
ON CONFLICT (order_number) DO NOTHING;

-- Demo order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, seller_id) VALUES
(1, 1, 'Premium Wireless Headphones', 1, 299.99, 299.99, 2),
(2, 2, 'Smart Fitness Tracker', 1, 149.50, 149.50, 1),
(3, 3, 'Bluetooth Speaker', 1, 89.99, 89.99, 3),
(4, 1, 'Premium Wireless Headphones', 1, 199.99, 199.99, 2),
(5, 4, 'Gaming Mechanical Keyboard', 1, 449.99, 449.99, 1)
ON CONFLICT DO NOTHING;

-- Demo order status history
INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by, change_reason) VALUES
(1, 'pending_payment', 'payment_confirmed', 1, 'Payment processed successfully'),
(1, 'payment_confirmed', 'processing', 2, 'Order being prepared for shipment'),
(2, 'pending_payment', 'payment_confirmed', 2, 'Payment processed successfully'),
(2, 'payment_confirmed', 'processing', 1, 'Order being prepared for shipment'),
(2, 'processing', 'shipped', 1, 'Order shipped via Express Shipping'),
(3, 'pending_payment', 'payment_confirmed', 1, 'Payment processed successfully'),
(3, 'payment_confirmed', 'processing', 3, 'Order being prepared for shipment'),
(3, 'processing', 'shipped', 3, 'Order shipped via Standard Shipping'),
(3, 'shipped', 'delivered', 3, 'Order delivered successfully')
ON CONFLICT DO NOTHING;

-- Demo order messages
INSERT INTO order_messages (order_id, sender_id, recipient_id, message_type, subject, message) VALUES
(1, 2, 1, 'shipping_update', 'Order Processing Update', 'Your order is being prepared and will ship within 24 hours.'),
(2, 1, 2, 'general', 'Shipping Address Confirmation', 'Please confirm the shipping address is correct before dispatch.'),
(3, 3, 1, 'shipping_update', 'Order Delivered', 'Your order has been delivered. Please confirm receipt when convenient.')
ON CONFLICT DO NOTHING;

-- Demo reviews
INSERT INTO order_reviews (order_id, reviewer_id, reviewed_user_id, rating, review_text, review_type) VALUES
(3, 1, 3, 5, 'Excellent product quality and fast shipping. Highly recommended seller!', 'seller'),
(5, 2, 1, 4, 'Great keyboard, exactly as described. Good communication from seller.', 'seller')
ON CONFLICT DO NOTHING;
