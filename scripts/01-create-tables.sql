-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  attendance VARCHAR(20) NOT NULL CHECK (attendance IN ('Yes', 'No', 'Maybe')),
  number_of_guests INTEGER DEFAULT 1,
  team_prediction VARCHAR(10) CHECK (team_prediction IN ('pink', 'blue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  team VARCHAR(10) CHECK (team IN ('pink', 'blue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_votes table for tracking predictions
CREATE TABLE IF NOT EXISTS team_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team VARCHAR(10) NOT NULL CHECK (team IN ('pink', 'blue')),
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_votes ENABLE ROW LEVEL SECURITY;
