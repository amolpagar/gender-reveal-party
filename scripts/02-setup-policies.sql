-- RLS Policies for RSVPs (allow read and insert for everyone)
CREATE POLICY "Allow public read access to rsvps" ON rsvps
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to rsvps" ON rsvps
  FOR INSERT WITH CHECK (true);

-- RLS Policies for messages (allow read and insert for everyone)
CREATE POLICY "Allow public read access to messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to messages" ON messages
  FOR INSERT WITH CHECK (true);

-- RLS Policies for team_votes (allow read and update for everyone)
CREATE POLICY "Allow public read access to team_votes" ON team_votes
  FOR SELECT USING (true);

CREATE POLICY "Allow public update to team_votes" ON team_votes
  FOR UPDATE USING (true);
