-- Financial Assistance Applications
CREATE TABLE financial_applications (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER NOT NULL REFERENCES users(id),
    application_type VARCHAR(20) NOT NULL CHECK (application_type IN ('grant', 'loan')),
    amount_requested DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(10) NOT NULL DEFAULT 'USD-CRED',
    purpose TEXT NOT NULL,
    business_plan TEXT,
    financial_documents JSONB, -- Store document metadata
    employment_status VARCHAR(50),
    annual_income DECIMAL(15,2),
    credit_score INTEGER,
    collateral_description TEXT,
    
    -- Loan specific fields
    requested_term_months INTEGER, -- Only for loans
    proposed_monthly_payment DECIMAL(15,2), -- Only for loans
    
    -- Application status and workflow
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'completed')),
    priority_level VARCHAR(10) DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high', 'urgent')),
    
    -- Review and approval
    assigned_reviewer_id INTEGER REFERENCES users(id),
    review_notes TEXT,
    approval_level VARCHAR(20), -- 'admin', 'super_admin', 'owner'
    approved_by INTEGER REFERENCES users(id),
    approved_amount DECIMAL(15,2),
    approval_conditions TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    disbursed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Application Reviews (for multi-step review process)
CREATE TABLE application_reviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES financial_applications(id),
    reviewer_id INTEGER NOT NULL REFERENCES users(id),
    review_type VARCHAR(20) NOT NULL CHECK (review_type IN ('initial', 'financial', 'risk', 'final')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    comments TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Management (for approved loans)
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES financial_applications(id),
    borrower_id INTEGER NOT NULL REFERENCES users(id),
    principal_amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    interest_rate DECIMAL(5,4) DEFAULT 0.0000, -- Interest-free by default
    term_months INTEGER NOT NULL,
    monthly_payment DECIMAL(15,2) NOT NULL,
    
    -- Loan status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted', 'forgiven')),
    
    -- Balances
    outstanding_balance DECIMAL(15,2) NOT NULL,
    total_paid DECIMAL(15,2) DEFAULT 0,
    
    -- Dates
    disbursement_date DATE NOT NULL,
    first_payment_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Payments
CREATE TABLE loan_payments (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER NOT NULL REFERENCES loans(id),
    payment_amount DECIMAL(15,2) NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_amount DECIMAL(15,2) DEFAULT 0,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'paid', 'late', 'missed')),
    transaction_id INTEGER REFERENCES transactions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant Disbursements (for approved grants)
CREATE TABLE grant_disbursements (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES financial_applications(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    disbursement_type VARCHAR(20) DEFAULT 'lump_sum' CHECK (disbursement_type IN ('lump_sum', 'installment')),
    
    -- Milestone tracking for installment grants
    milestone_description TEXT,
    milestone_due_date DATE,
    milestone_completed BOOLEAN DEFAULT FALSE,
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'disbursed', 'completed')),
    transaction_id INTEGER REFERENCES transactions(id),
    
    disbursed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Assistance Settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('max_grant_amount', '50000', 'Maximum grant amount in CRED'),
('max_loan_amount', '100000', 'Maximum loan amount in CRED'),
('min_credit_score', '600', 'Minimum credit score for loan approval'),
('grant_approval_threshold_admin', '5000', 'Grant amount requiring admin approval'),
('grant_approval_threshold_super_admin', '25000', 'Grant amount requiring super admin approval'),
('loan_approval_threshold_admin', '10000', 'Loan amount requiring admin approval'),
('loan_approval_threshold_super_admin', '50000', 'Loan amount requiring super admin approval'),
('default_loan_term_months', '24', 'Default loan term in months'),
('application_review_deadline_days', '14', 'Days to complete application review');

-- Indexes for performance
CREATE INDEX idx_financial_applications_applicant ON financial_applications(applicant_id);
CREATE INDEX idx_financial_applications_status ON financial_applications(status);
CREATE INDEX idx_financial_applications_type ON financial_applications(application_type);
CREATE INDEX idx_application_reviews_application ON application_reviews(application_id);
CREATE INDEX idx_loans_borrower ON loans(borrower_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loan_payments_loan ON loan_payments(loan_id);
CREATE INDEX idx_loan_payments_due_date ON loan_payments(due_date);
