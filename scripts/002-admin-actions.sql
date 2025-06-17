-- Admin Actions Log Table
CREATE TABLE admin_actions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- 'status_change', 'role_change', 'user_edit', 'transaction_approval', etc.
    target_user_id INTEGER REFERENCES users(id),
    target_transaction_id INTEGER REFERENCES transactions(id),
    details JSONB, -- Store action details as JSON
    notes TEXT, -- Optional admin notes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);
