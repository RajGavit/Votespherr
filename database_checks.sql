-- Non-destructive checks for VoteSphere's existing digital_voting database.
-- Run these queries in MySQL Workbench or the mysql client.

-- 1) Positions currently attached to each election.
SELECT p.position_id, p.election_id, e.election_name,
       p.position_name, p.description
FROM `POSITION` p
JOIN ELECTION e ON e.election_id = p.election_id
ORDER BY p.election_id, p.position_id;

-- 2) Find candidate records whose position belongs to a different election.
-- Such rows are ignored by the updated candidate/results APIs until corrected.
SELECT c.candidate_id,
       c.election_id AS candidate_election_id,
       e.election_name AS candidate_election,
       c.position_id,
       p.election_id AS position_election_id,
       p.position_name
FROM CANDIDATE c
JOIN ELECTION e ON e.election_id = c.election_id
JOIN `POSITION` p ON p.position_id = c.position_id
WHERE c.election_id <> p.election_id;

-- 3) Vote totals by election and position.
SELECT e.election_name, p.position_name,
       COUNT(v.vote_id) AS votes_recorded
FROM VOTE v
JOIN ELECTION e ON e.election_id = v.election_id
JOIN `POSITION` p ON p.position_id = v.position_id
GROUP BY e.election_id, e.election_name, p.position_id, p.position_name
ORDER BY e.election_id, p.position_id;
