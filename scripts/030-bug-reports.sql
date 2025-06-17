-- Bug Reports System
CREATE TABLE IF NOT EXISTS bug_reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('ui', 'functionality', 'performance', 'security', 'translation', 'mobile', 'general')),
  user_id INTEGER REFERENCES users(id),
  user_email VARCHAR(255),
  user_agent TEXT,
  browser_info JSONB,
  page_url VARCHAR(500),
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  screenshot_url VARCHAR(500),
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  resolved_by INTEGER REFERENCES users(id),
  resolution_notes TEXT
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_severity ON bug_reports(severity);
CREATE INDEX IF NOT EXISTS idx_bug_reports_created_at ON bug_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_bug_reports_user_id ON bug_reports(user_id);

-- Insert some sample bug reports for demo
INSERT INTO bug_reports (title, description, severity, category, user_email, page_url, steps_to_reproduce, expected_behavior, actual_behavior) VALUES
('Language selector not working on mobile', 'The language dropdown does not open when tapped on mobile devices', 'high', 'mobile', 'demo@example.com', '/currencies', '1. Open app on mobile\n2. Tap language selector\n3. Nothing happens', 'Language dropdown should open', 'Nothing happens when tapped'),
('Currency conversion shows wrong rates', 'CRED to USD conversion showing incorrect exchange rates', 'critical', 'functionality', 'trader@example.com', '/currencies', '1. Go to currencies page\n2. Convert 100 CRED to USD\n3. Rate appears wrong', 'Should show current market rate', 'Shows outdated or incorrect rate'),
('Dark theme not applying to all components', 'Some UI elements still show light theme colors in dark mode', 'medium', 'ui', 'user@example.com', '/marketplace', '1. Enable dark mode\n2. Navigate to marketplace\n3. Some buttons are still white', 'All elements should be dark themed', 'Some buttons remain light colored');
