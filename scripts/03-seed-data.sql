-- Initialize team votes
INSERT INTO team_votes (team, count) VALUES 
  ('pink', 12),
  ('blue', 8)
ON CONFLICT DO NOTHING;

-- Add some sample messages
INSERT INTO messages (name, message, team) VALUES 
  ('Sarah M.', 'So excited for you both! 💕', 'pink'),
  ('Mike R.', 'Team Blue all the way! 💙', 'blue'),
  ('Emma L.', 'Can''t wait to find out! 🎉', 'pink')
ON CONFLICT DO NOTHING;
