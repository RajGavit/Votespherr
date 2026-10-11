# VoteSphere — Digital Voting Management System

Updated bundle based on your existing VoteSphere UI and Node.js/MySQL project. It preserves the dashboard styling and adds dynamic positions, student directory, live results, and transactional vote submission.

## Requirements
- Node.js LTS
- MySQL Server
- Your existing `digital_voting` schema with `STUDENT`, `ELECTION`, `POSITION`, `CANDIDATE`, and `VOTE` tables

## Setup
1. Keep `index.html`, `style.css`, and `script.js` in the project root.
2. Open a terminal in `backend/` and run `npm install`.
3. Copy `.env.example` to `.env` and set your local MySQL username/password. Never share or upload `.env`.
4. Ensure `DB_NAME=digital_voting` matches your database.
5. Start the backend with `npm start`.
6. Open **http://localhost:3000**. The backend serves the frontend and API from the same origin.
7. Check **http://localhost:3000/api/db-test**, **http://localhost:3000/api/positions**, **http://localhost:3000/api/elections**, and **http://localhost:3000/api/results**. Optional non-destructive database checks are in `database_checks.sql`.

## Included database-backed flows
- Election list and existing election CRUD
- Create positions for upcoming elections
- Candidate directory and approve/reject candidate applications
- Student login checked against the password hash stored in MySQL
- Student directory with vote status
- Candidate results and turnout summary
- Vote submission for all selected positions in one database transaction; the existing unique key `(student_id, election_id, position_id)` prevents duplicate votes per position

## Important
- The bundle expects your current schema and does not drop or recreate the database.
- Positions can only be added before an election starts.
- Election display status is computed from the scheduled times; explicitly completed/cancelled elections remain closed.
- Complaints remain illustrative UI data because the supplied backend/schema did not include a complaint table or complaint API. The candidate API ignores records where a candidate’s position belongs to a different election; run `database_checks.sql` to identify such legacy records.
- This is an academic local prototype, not production election software. API endpoints are not protected by an admin authorization/session layer; do not use this for a real election.
