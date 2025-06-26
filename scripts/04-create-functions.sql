-- Function to increment team votes
CREATE OR REPLACE FUNCTION increment_team_vote(team_name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO team_votes (team, count) 
  VALUES (team_name, 1)
  ON CONFLICT (team) 
  DO UPDATE SET 
    count = team_votes.count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint on team to prevent duplicates
ALTER TABLE team_votes ADD CONSTRAINT unique_team UNIQUE (team);
