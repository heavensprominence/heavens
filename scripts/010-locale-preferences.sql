-- Create locale preferences table
CREATE TABLE IF NOT EXISTS user_locale_preferences (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for timestamp updates
CREATE TRIGGER update_user_locale_preferences_updated_at
BEFORE UPDATE ON user_locale_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_locale_preferences_user_id ON user_locale_preferences(user_id);

-- Insert some demo data
INSERT INTO user_locale_preferences (user_id, locale)
VALUES 
  (1, 'en'),
  (2, 'es'),
  (3, 'fr')
ON CONFLICT (user_id) DO NOTHING;
