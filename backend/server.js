

const express = require('express');
const path = require('path');

const db = require('./db');
const { initDb } = require('./initDb');

const cors = require('cors');

const bcrypt = require('bcrypt');

const app = express();

app.use(cors());

function isValidDateTime(value) {
    if (typeof value !== 'string') {
        return false;
    }

    const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
    );

    if (!match) {
        return false;
    }

    const [, year, month, day, hour, minute, second] = match;

    const date = new Date(
        Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
        )
    );

    return (
        date.getUTCFullYear() === Number(year) &&
        date.getUTCMonth() === Number(month) - 1 &&
        date.getUTCDate() === Number(day) &&
        date.getUTCHours() === Number(hour) &&
        date.getUTCMinutes() === Number(minute) &&
        date.getUTCSeconds() === Number(second)
    );
}


app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_DIR = path.resolve(__dirname, '..');
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});
app.get('/style.css', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'script.js')));

app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DATABASE() AS databaseName');

        res.json({
            success: true,
            message: 'MySQL connected successfully!',
            database: rows[0].databaseName
        });
    } catch (error) {
        console.error('Database connection error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});



app.get('/api/students', async (req, res) => {
    try {
        const [students] = await db.query(`
            SELECT s.student_id, s.full_name, s.email, s.department,
                   s.year_of_study,
                   CASE WHEN COUNT(v.vote_id) > 0 THEN 'Yes' ELSE 'No' END AS voted,
                   'Verified' AS verification_status
            FROM STUDENT s
            LEFT JOIN VOTE v ON v.student_id = s.student_id
            GROUP BY s.student_id, s.full_name, s.email, s.department, s.year_of_study
            ORDER BY s.student_id DESC
        `);
        res.json({ success: true, students });
    } catch (error) {
        console.error('Error fetching students:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch student directory.' });
    }
});

app.post('/api/students/register', async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            department,
            year_of_study
        } = req.body;

        // More validation and registration logic will be added next.


if (
    typeof full_name !== 'string' ||
    full_name.trim().length === 0
) {
    return res.status(400).json({
        success: false,
        message: 'Full name is required'
    });
}



if (
    typeof password !== 'string' ||
    password.length < 8
) {
    return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters'
    });
}


if (
    typeof email !== 'string' ||
    email.trim().length === 0
) {
    return res.status(400).json({
        success: false,
        message: 'Email is required'
    });
}


const normalizedEmail = email.trim().toLowerCase();

if (
    normalizedEmail.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
) {
    return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
    });
}


if (
    department !== undefined &&
    department !== null &&
    (
        typeof department !== 'string' ||
        department.trim().length === 0 ||
        department.trim().length > 100
    )
) {
    return res.status(400).json({
        success: false,
        message: 'Department must be nonempty text with at most 100 characters'
    });
}

if (
    year_of_study !== undefined &&
    year_of_study !== null &&
    (
        !Number.isInteger(year_of_study) ||
        year_of_study < 1 ||
        year_of_study > 6
    )
) {
    return res.status(400).json({
        success: false,
        message: 'Year of study must be an integer between 1 and 6'
    });
}





const [existingStudents] = await db.execute(
    'SELECT student_id FROM STUDENT WHERE email = ?',
    [normalizedEmail]
);

if (existingStudents.length > 0) {
    return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
    });
}

const hashedPassword = await bcrypt.hash(password, 12);




const [result] = await db.execute(
    `INSERT INTO STUDENT
        (full_name, email, password_hash, department, year_of_study)
     VALUES (?, ?, ?, ?, ?)`,
    [
        full_name.trim(),
        normalizedEmail,
        hashedPassword,
        department ? department.trim() : null,
        year_of_study ?? null
    ]
);


return res.status(201).json({
    success: true,
    message: 'Student registered successfully',
    student: {
        student_id: result.insertId,
        full_name: full_name.trim(),
        email: normalizedEmail,
        department: department ? department.trim() : null,
        year_of_study: year_of_study ?? null
    }
});



} catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'An account with this email already exists'
        });
    }       

    console.error('Student registration error:', error);

    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}

});








app.post('/api/students/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            email.trim().length === 0 ||
            typeof password !== 'string' ||
            password.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [students] = await db.execute(
            `SELECT student_id, full_name, email, password_hash,
                    department, year_of_study
             FROM STUDENT
             WHERE email = ?`,
            [normalizedEmail]
        );

        if (students.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const student = students[0];

        const passwordMatches = await bcrypt.compare(
            password,
            student.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        return res.json({
            success: true,
            message: 'Login successful',
            student: {
                student_id: student.student_id,
                full_name: student.full_name,
                email: student.email,
                department: student.department,
                year_of_study: student.year_of_study
            }
        });

    } catch (error) {
        console.error('Student login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});





app.get('/api/elections', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*,
                   CASE
                     WHEN LOWER(e.status) IN ('completed', 'cancelled') THEN LOWER(e.status)
                     WHEN NOW() < e.start_time THEN 'upcoming'
                     WHEN NOW() <= e.end_time THEN 'active'
                     ELSE 'completed'
                   END AS computed_status,
                   (SELECT COUNT(*) FROM STUDENT) AS eligible,
                   (SELECT COUNT(DISTINCT v.student_id)
                      FROM VOTE v
                     WHERE v.election_id = e.election_id) AS votes
            FROM ELECTION e
            ORDER BY e.election_id DESC
        `);

        rows.forEach(row => {
            row.eligible = Number(row.eligible);
            row.votes = Number(row.votes);
            row.progress = row.eligible > 0
                ? Math.round((row.votes / row.eligible) * 100)
                : 0;
        });

        res.json({
            success: true,
            count: rows.length,
            elections: rows
        });
    } catch (error) {
        console.error('Error fetching elections:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch elections'
        });
    }
});


app.post('/api/elections', async (req, res) => {
    try {
        const {
            election_name,
            description,
            start_time,
            end_time
        } = req.body;

        
if (
    typeof election_name !== 'string' ||
    election_name.trim().length === 0
) {
    return res.status(400).json({
        success: false,
        message: 'Election name is required'
    });
}


        
if (!start_time || !end_time) {
    return res.status(400).json({
        success: false,
        message: 'Start time and end time are required'
    });
}


if (
    description !== undefined &&
    description !== null &&
    (
        typeof description !== 'string' ||
        description.length > 1000
    )
) {
    return res.status(400).json({
        success: false,
        message: 'Description must be text with at most 1000 characters'
    });
}




    
if (
    !isValidDateTime(start_time) ||
    !isValidDateTime(end_time)
) {
    return res.status(400).json({
        success: false,
        message: 'Dates must use YYYY-MM-DD HH:MM:SS format and be valid'
    });
}

const start = new Date(start_time.replace(' ', 'T'));
const end = new Date(end_time.replace(' ', 'T'));

if (end <= start) {
    return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
    });
}



        const [result] = await db.execute(
            `INSERT INTO ELECTION
             (election_name, description, start_time, end_time)
             VALUES (?, ?, ?, ?)`,
            [
                election_name.trim(),
                description || null,
                start_time,
                end_time
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Election created successfully',
            election_id: result.insertId
        });

    } catch (error) {
        console.error('Error creating election:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to create election'
        });
    }
});



app.put('/api/elections/:id', async (req, res) => {
    try {
        const electionId = req.params.id;

        
if (!/^\d+$/.test(electionId) || Number(electionId) <= 0) {
    return res.status(400).json({
        success: false,
        message: 'Election ID must be a positive integer'
    });
}


        const {
            election_name,
            description,
            start_time,
            end_time
        } = req.body;



if (
    typeof election_name !== 'string' ||
    election_name.trim().length === 0
) {
    return res.status(400).json({
        success: false,
        message: 'Election name is required'
    });
}


if (!start_time || !end_time) {
    return res.status(400).json({
        success: false,
        message: 'Start time and end time are required'
    });
}





if (
    !isValidDateTime(start_time) ||
    !isValidDateTime(end_time)
) {
    return res.status(400).json({
        success: false,
        message: 'Dates must use YYYY-MM-DD HH:MM:SS format and be valid'
    });
}

const start = new Date(start_time.replace(' ', 'T'));
const end = new Date(end_time.replace(' ', 'T'));

if (end <= start) {
    return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
    });
}





if (
    description !== undefined &&
    description !== null &&
    (
        typeof description !== 'string' ||
        description.length > 1000
    )
) {
    return res.status(400).json({
        success: false,
        message: 'Description must be text with at most 1000 characters'
    });
}






const [existingElections] = await db.execute(
    `SELECT status, start_time, end_time
     FROM ELECTION
     WHERE election_id = ?`,
    [electionId]
);

if (existingElections.length === 0) {
    return res.status(404).json({
        success: false,
        message: 'Election not found'
    });
}

const existingElection = existingElections[0];

if (['completed', 'cancelled'].includes(String(existingElection.status).toLowerCase())) {
    return res.status(400).json({
        success: false,
        message: 'Completed or cancelled elections cannot be updated'
    });
}

if (new Date(existingElection.start_time) <= new Date()) {
    return res.status(400).json({
        success: false,
        message: 'An election cannot be updated after it has started'
    });
}





        const [result] = await db.execute(
            `UPDATE ELECTION
             SET election_name = ?,
                 description = ?,
                 start_time = ?,
                 end_time = ?
             WHERE election_id = ?`,
            [
                election_name.trim(),
                description || null,
                start_time,
                end_time,
                electionId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        res.json({
            success: true,
            message: 'Election updated successfully'
        });

    } catch (error) {
        console.error('Error updating election:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to update election'
        });
    }
});


app.delete('/api/elections/:id', async (req, res) => {
    try {
        const electionId = req.params.id;



if (!/^\d+$/.test(electionId) || Number(electionId) <= 0) {
    return res.status(400).json({
        success: false,
        message: 'Invalid election ID'
    });
}

const [existingElections] = await db.execute(
    `SELECT status
     FROM ELECTION
     WHERE election_id = ?`,
    [electionId]
);

if (existingElections.length === 0) {
    return res.status(404).json({
        success: false,
        message: 'Election not found'
    });
}





const electionStatus = String(existingElections[0].status).toLowerCase();

if (
    electionStatus === 'completed' ||
    electionStatus === 'cancelled'
) {
    return res.status(400).json({
        success: false,
        message: 'Completed or cancelled elections cannot be deleted'
    });
}

const [voteCount] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM VOTE
     WHERE election_id = ?`,
    [electionId]
);


const [positionCount] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM \`POSITION\`
     WHERE election_id = ?`,
    [electionId]
);

const [candidateCount] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM CANDIDATE
     WHERE election_id = ?`,
    [electionId]
);

const [resultCount] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM ELECTION_RESULT
     WHERE election_id = ?`,
    [electionId]
);

const [complaintCount] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM COMPLAINT
     WHERE election_id = ?`,
    [electionId]
);

if (
    positionCount[0].total > 0 ||
    candidateCount[0].total > 0 ||
    resultCount[0].total > 0 ||
    complaintCount[0].total > 0
) {
    return res.status(400).json({
        success: false,
        message: 'Elections with related records cannot be deleted'
    });
}


if (voteCount[0].total > 0) {
    return res.status(400).json({
        success: false,
        message: 'Elections with recorded votes cannot be deleted'
    });
}


        const [result] = await db.execute(
            'DELETE FROM ELECTION WHERE election_id = ?',
            [electionId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }
        res.json({
            success: true,
            message: 'Election deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting election:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to delete election'
        });
    }
});










app.get('/api/positions', async (req, res) => {
    try {
        const electionIdRaw = req.query.election_id;
        const params = [];
        let where = '';
        if (electionIdRaw !== undefined) {
            const electionId = Number(electionIdRaw);
            if (!Number.isInteger(electionId) || electionId <= 0) {
                return res.status(400).json({ success: false, message: 'A valid election ID is required.' });
            }
            where = 'WHERE p.election_id = ?';
            params.push(electionId);
        }
        const [positions] = await db.execute(`
            SELECT p.position_id, p.election_id, p.position_name, p.description,
                   e.election_name, e.start_time, e.end_time
            FROM \`POSITION\` p
            JOIN ELECTION e ON e.election_id = p.election_id
            ${where}
            ORDER BY p.election_id DESC, p.position_id ASC
        `, params);
        res.json({ success: true, positions });
    } catch (error) {
        console.error('Error fetching positions:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch positions.' });
    }
});

app.post('/api/positions', async (req, res) => {
    try {
        const { election_id, position_name, description } = req.body;
        const electionId = Number(election_id);
        const name = typeof position_name === 'string' ? position_name.trim() : '';
        const details = typeof description === 'string' ? description.trim() : '';
        if (!Number.isInteger(electionId) || electionId <= 0) {
            return res.status(400).json({ success: false, message: 'A valid election ID is required.' });
        }
        if (!name || name.length > 100) {
            return res.status(400).json({ success: false, message: 'Position name is required and must be at most 100 characters.' });
        }
        if (description != null && (typeof description !== 'string' || description.length > 1000)) {
            return res.status(400).json({ success: false, message: 'Description must be text with at most 1000 characters.' });
        }
        const [electionsFound] = await db.execute(`
            SELECT election_id
            FROM ELECTION
            WHERE election_id = ?
              AND LOWER(status) NOT IN ('completed', 'cancelled')
              AND start_time > NOW()
        `, [electionId]);
        if (!electionsFound.length) {
            return res.status(400).json({ success: false, message: 'Election not found or has already started.' });
        }
        const [result] = await db.execute(
            'INSERT INTO `POSITION` (election_id, position_name, description) VALUES (?, ?, ?)',
            [electionId, name, details || null]
        );
        res.status(201).json({ success: true, message: 'Position created successfully.', position_id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'This position already exists for the selected election.' });
        }
        console.error('Error creating position:', error.message);
        res.status(500).json({ success: false, message: 'Failed to create position.' });
    }
});

app.get('/api/candidates', async (req, res) => {
    try {
        const [candidates] = await db.query(`
            SELECT
                c.candidate_id,
                c.student_id,
                s.full_name,
                s.email,
                c.election_id,
                e.election_name,
                c.position_id,
                p.position_name,
                c.manifesto,
                c.status,
                c.created_at
            FROM CANDIDATE c
            JOIN STUDENT s
                ON c.student_id = s.student_id
            JOIN ELECTION e
                ON c.election_id = e.election_id
            JOIN \`POSITION\` p
                ON c.position_id = p.position_id
            ORDER BY c.created_at DESC
        `);

        res.json({
            success: true,
            candidates
        });

    } catch (error) {
        console.error('Error fetching candidates:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch candidates'
        });
    }
});



app.post('/api/candidates', async (req, res) => {
    try {
        const {
            student_id,
            election_id,
            position_id,
            manifesto
        } = req.body;

        // Validate required fields
        if (
            !Number.isInteger(Number(student_id)) ||
            Number(student_id) <= 0 ||
            !Number.isInteger(Number(election_id)) ||
            Number(election_id) <= 0 ||
            !Number.isInteger(Number(position_id)) ||
            Number(position_id) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Valid student_id, election_id, and position_id are required.'
            });
        }

        // Confirm the position belongs to the selected election
        const [positions] = await db.query(
            `SELECT position_id
             FROM \`POSITION\`
             WHERE position_id = ? AND election_id = ?`,
            [Number(position_id), Number(election_id)]
        );

        if (positions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'The selected position does not belong to this election.'
            });
        }

        // Save the application; status defaults to pending
        const [result] = await db.query(
            `INSERT INTO CANDIDATE
             (student_id, election_id, position_id, manifesto)
             VALUES (?, ?, ?, ?)`,
            [
                Number(student_id),
                Number(election_id),
                Number(position_id),
                manifesto?.trim() || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Candidate application submitted successfully.',
            candidate_id: result.insertId
        });

    } catch (error) {
        console.error('Error creating candidate application:', error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: 'The selected student, election, or position does not exist.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to submit candidate application.'
        });
    }
});






app.patch('/api/candidates/:id/status', async (req, res) => {
    try {
        const candidateId = Number(req.params.id);
        const { status } = req.body;

        // Validate candidate ID
        if (!Number.isInteger(candidateId) || candidateId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid candidate ID.'
            });
        }

        // Only allow approved or rejected
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be approved or rejected.'
            });
        }

        // Check whether the candidate exists
        const [candidatesFound] = await db.query(
            'SELECT candidate_id FROM CANDIDATE WHERE candidate_id = ?',
            [candidateId]
        );

        if (candidatesFound.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found.'
            });
        }

        // Update the application status
        await db.query(
            'UPDATE CANDIDATE SET status = ? WHERE candidate_id = ?',
            [status, candidateId]
        );

        res.json({
            success: true,
            message: `Candidate application ${status} successfully.`,
            candidate_id: candidateId,
            status
        });

    } catch (error) {
        console.error('Error updating candidate status:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update candidate status.'
        });
    }
});




app.post('/api/votes/batch', async (req, res) => {
    const votes = req.body && req.body.votes;
    if (!Array.isArray(votes) || votes.length === 0 || votes.length > 50) {
        return res.status(400).json({ success: false, message: 'Provide between 1 and 50 votes.' });
    }
    let connection;
    try {
        const normalized = votes.map(vote => ({
            student_id: Number(vote.student_id),
            election_id: Number(vote.election_id),
            position_id: Number(vote.position_id),
            candidate_id: Number(vote.candidate_id)
        }));
        const first = normalized[0];
        if (normalized.some(vote => ![vote.student_id, vote.election_id, vote.position_id, vote.candidate_id].every(value => Number.isInteger(value) && value > 0))) {
            return res.status(400).json({ success: false, message: 'All vote records must contain valid positive IDs.' });
        }
        if (normalized.some(vote => vote.student_id !== first.student_id || vote.election_id !== first.election_id)) {
            return res.status(400).json({ success: false, message: 'A ballot can contain votes for only one student and one election.' });
        }
        const positionIds = normalized.map(vote => vote.position_id);
        if (new Set(positionIds).size !== positionIds.length) {
            return res.status(400).json({ success: false, message: 'Only one vote per position is allowed in a ballot.' });
        }
        connection = await db.getConnection();
        await connection.beginTransaction();
        for (const vote of normalized) {
            const [valid] = await connection.execute(`
                SELECT c.candidate_id
                FROM CANDIDATE c
                JOIN ELECTION e ON e.election_id = c.election_id
                JOIN \`POSITION\` p ON p.position_id = c.position_id
                WHERE c.candidate_id = ?
                  AND c.election_id = ?
                  AND c.position_id = ?
                  AND c.status = 'approved'
                  AND LOWER(e.status) NOT IN ('cancelled', 'completed')
                  AND NOW() BETWEEN e.start_time AND e.end_time
                  AND p.election_id = e.election_id
            `, [vote.candidate_id, vote.election_id, vote.position_id]);
            if (!valid.length) {
                throw Object.assign(new Error('A selected candidate is not approved for this active election and position.'), { statusCode: 400 });
            }
        }
        for (const vote of normalized) {
            await connection.execute(
                'INSERT INTO VOTE (student_id, election_id, position_id, candidate_id) VALUES (?, ?, ?, ?)',
                [vote.student_id, vote.election_id, vote.position_id, vote.candidate_id]
            );
        }
        await connection.commit();
        return res.status(201).json({ success: true, message: 'All votes were recorded successfully.', count: normalized.length });
    } catch (error) {
        if (connection) await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'You have already voted for one or more positions in this election.' });
        }
        if (error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ success: false, message: 'A student, election, position, or candidate does not exist.' });
        }
        console.error('Error recording ballot:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to record ballot.' });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/api/votes', async (req, res) => {
    try {
        const {
            student_id,
            election_id,
            position_id,
            candidate_id
        } = req.body;

        const studentId = Number(student_id);
        const electionId = Number(election_id);
        const positionId = Number(position_id);
        const candidateId = Number(candidate_id);

        // Validate IDs
        if (
            !Number.isInteger(studentId) || studentId <= 0 ||
            !Number.isInteger(electionId) || electionId <= 0 ||
            !Number.isInteger(positionId) || positionId <= 0 ||
            !Number.isInteger(candidateId) || candidateId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Valid student, election, position, and candidate IDs are required.'
            });
        }

       
        // Confirm the candidate is approved for this election and position,
        // and that voting is within the scheduled election period.
        const [candidatesFound] = await db.query(
            `SELECT c.candidate_id
             FROM CANDIDATE c
             JOIN ELECTION e ON e.election_id = c.election_id
             JOIN \`POSITION\` p ON p.position_id = c.position_id
             WHERE c.candidate_id = ?
               AND c.election_id = ?
               AND c.position_id = ?
               AND c.status = 'approved'
               AND LOWER(e.status) NOT IN ('cancelled', 'completed')
               AND NOW() BETWEEN e.start_time AND e.end_time
               AND p.election_id = e.election_id`,
            [candidateId, electionId, positionId]
        );


        if (candidatesFound.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Candidate is not approved for this active election and position.'
            });
        }

        // Record the vote
        await db.query(
            `INSERT INTO VOTE
             (student_id, election_id, position_id, candidate_id)
             VALUES (?, ?, ?, ?)`,
            [studentId, electionId, positionId, candidateId]
        );

        return res.status(201).json({
            success: true,
            message: 'Vote recorded successfully.'
        });

    } catch (error) {
        console.error('Error recording vote:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'You have already voted for this position in this election.'
            });
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: 'The selected student, election, position, or candidate does not exist.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to record vote.'
        });
    }
});




app.get('/api/results', async (req, res) => {
    try {
        const electionIdRaw = req.query.election_id;
        const params = [];
        let where = "WHERE c.status = 'approved'";
        if (electionIdRaw !== undefined && electionIdRaw !== '') {
            const electionId = Number(electionIdRaw);
            if (!Number.isInteger(electionId) || electionId <= 0) {
                return res.status(400).json({ success: false, message: 'A valid election ID is required.' });
            }
            where += ' AND e.election_id = ?';
            params.push(electionId);
        }
        const [results] = await db.execute(`
            SELECT e.election_id, e.election_name,
                   p.position_id, p.position_name,
                   c.candidate_id, s.full_name,
                   COUNT(v.vote_id) AS vote_count
            FROM CANDIDATE c
            JOIN ELECTION e ON e.election_id = c.election_id
            JOIN \`POSITION\` p ON p.position_id = c.position_id AND p.election_id = e.election_id
            JOIN STUDENT s ON s.student_id = c.student_id
            LEFT JOIN VOTE v ON v.candidate_id = c.candidate_id
                             AND v.election_id = e.election_id
                             AND v.position_id = p.position_id
            ${where}
            GROUP BY e.election_id, e.election_name, p.position_id, p.position_name,
                     c.candidate_id, s.full_name
            ORDER BY p.position_id ASC, vote_count DESC, s.full_name ASC
        `, params);
        const selectedElectionId = electionIdRaw ? Number(electionIdRaw) : null;
        const voteParams = selectedElectionId ? [selectedElectionId] : [];
        const voteWhere = selectedElectionId ? 'WHERE election_id = ?' : '';
        const [voteSummary] = await db.execute(`
            SELECT COUNT(*) AS total_votes, COUNT(DISTINCT student_id) AS students_voted
            FROM VOTE ${voteWhere}
        `, voteParams);
        const [studentSummary] = await db.query('SELECT COUNT(*) AS eligible_voters FROM STUDENT');
        const [positionSummary] = await db.execute(`
            SELECT COUNT(DISTINCT p.position_id) AS positions_contested
            FROM \`POSITION\` p
            JOIN CANDIDATE c ON c.position_id = p.position_id AND c.election_id = p.election_id
            ${selectedElectionId ? 'WHERE p.election_id = ? AND c.status = \'approved\'' : "WHERE c.status = 'approved'"}
        `, selectedElectionId ? [selectedElectionId] : []);
        res.json({
            success: true,
            results,
            summary: {
                total_votes: Number(voteSummary[0]?.total_votes || 0),
                students_voted: Number(voteSummary[0]?.students_voted || 0),
                eligible_voters: Number(studentSummary[0]?.eligible_voters || 0),
                positions_contested: Number(positionSummary[0]?.positions_contested || 0)
            }
        });
    } catch (error) {
        console.error('Error fetching results:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch election results.' });
    }
});

// Catch-all error handler so malformed JSON bodies return JSON instead of an HTML error page.
app.use((error, req, res, next) => {
    if (error && error.type === 'entity.parse.failed') {
        return res.status(400).json({ success: false, message: 'Request body is not valid JSON.' });
    }
    console.error('Unhandled error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Listen first so Render detects the open port quickly, then make sure the tables exist.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    initDb().catch(error => {
        console.error('Could not initialise the database schema:', error.message);
    });
});
