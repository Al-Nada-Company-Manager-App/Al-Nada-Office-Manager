import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { Strategy } from "passport-local";
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import path from 'path';


const db = new pg.Client({
  connectionString: "postgresql://neondb_owner:C4VjIugfa2ye@ep-late-river-a55ncq5u.us-east-2.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false 
  }
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'SECRET_KEY',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        secure:false, 
        maxAge: 3600000 
    }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static('../Frontend/public'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../Frontend/public'); 
    },
    filename: (req, file, cb) => {
      const username = req.body.username; 
      const ext = path.extname(file.originalname); 
      cb(null, `${username}${ext}`);
    },
  });
  
  const upload = multer({ storage });


//get The signed user data
const SignedUser ={
    id: 1,
    fName: '',
    lName: '',
    Photo: '',
    Role: '',
}

app.get('/SignedUser', (req, res) => {
    res.json(SignedUser);
});

app.get('/allUsers', async (req, res) => {
    const result = await db.query('SELECT * FROM EMPLOYEE');
    const rows = result.rows;
    res.json(rows);
});

app.post('/deleteUser', async (req, res) => {
    const id = req.body.id;
    await
    db.query('DELETE FROM EMPLOYEE WHERE E_ID = $1', [id]);
    res.json({ success: true });
});

app.post('/deactivateUser', async (req, res) => {
    const id = req.body.id;
    await
    db.query('UPDATE EMPLOYEE SET E_ACTIVE = FALSE WHERE E_ID = $1', [id]);
    res.json({ success: true });
});

app.post('/activateUser', async (req, res) => {
    const id = req.body.id;
    await
    db.query('UPDATE EMPLOYEE SET E_ACTIVE = TRUE WHERE E_ID = $1', [id]);
    res.json({ success: true });
});

app.post('/addUser', upload.single('photo'), async (req, res) => {
    try {
        const fName = req.body.fName;
        const lName = req.body.lName;
        const gender = req.body.gender;
        const salary = req.body.salary;
        const role = req.body.role;
        const address = req.body.address;
        const city = req.body.city;
        const country = req.body.country;
        const zipcode = req.body.zipcode;
        const username = req.body.username;
        const pass = req.body.password;
        const BirthDate = req.body.birth_date;
       

        const photo = req.file ? req.file.filename : null; 
        const hashedPassword = await bcrypt.hash(pass, 10);

         await db.query(
          'INSERT INTO EMPLOYEE (F_NAME, L_NAME, Birth_Date, SALARY, E_ROLE, E_PHOTO, E_ADDRESS, E_CITY, E_COUNTRY, E_ZIPCODE, E_USERNAME, E_PASSWORD, E_GENDER) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
           [fName, lName, BirthDate, salary, role, photo, address, city, country, zipcode, username, hashedPassword, gender]
         );

        res.json({ success: true, message: 'Employee added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to add employee!' });
    }
});

app.get('/notificaions', async (req, res) => {
    const result = await db.query(
        'SELECT N.N_ID, N.N_DATE, N.N_TYPE, N.N_MESSAGE, N.N_STATUS FROM NOTIFICATION N, NOTIFICATION_EMPLOYEE NE WHERE N.N_ID = NE.N_ID AND NE.E_ID = $1', [SignedUser.id]);
    const rows = result.rows;
    res.json(rows);
});




































// Passport Strategy
passport.use(new Strategy(
    { usernameField: 'username' },
    async (username, password, done) => {
        try {
            const result = await db.query('SELECT * FROM EMPLOYEE WHERE E_USERNAME = $1', [username]);
            const rows = result.rows;
            if (rows.length === 0) {
                return done(null, false, { message: 'User not found' });
            }

            const user = rows[0];           

            SignedUser.id = user.e_id;
            SignedUser.fName = user.f_name;
            SignedUser.lName = user.l_name;
            SignedUser.Photo = user.e_photo;
            SignedUser.Role = user.e_role;
          

            const isMatch = await bcrypt.compare(password, user.e_password);
            if (isMatch) {
                if (!user.e_active) {
                    return done(null, false, { message: 'Your account is not activated yet.' });
                }
                else{
                 return done(null, user);
                }
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
           
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.e_id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query('SELECT * FROM EMPLOYEE WHERE E_ID = $1', [id]);
        const rows = result.rows;
        if (rows.length > 0) {
            done(null, rows[0]);
        } else {
            done(new Error('User not found'));
        }
    } catch (err) {
        done(err);
    }
});

// Routes

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (!user) {
            console.log('Authentication failed:', info);
            return res.json({ success: false, message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            res.json({ success: true, message: 'Login successful', user: { id: user.E_ID, username: user.E_USERNAME } });
        });
    })(req, res, next);
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).json({ success: false, message: 'Could not log out' });
            }
            res.clearCookie('connect.sid', { path: '/' });
            res.json({ success: true, message: 'Logout successful' });
        });
    });
});

app.get('/session', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ success: true, user: req.user });
    } else {
        res.json({ success: false, message: 'Not authenticated' });
    }
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
