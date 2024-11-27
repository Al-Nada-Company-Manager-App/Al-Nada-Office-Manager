import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { Strategy } from "passport-local";
import cors from 'cors';

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
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));


const users = [
    {
        id: 1,
        username: 'test@example.com',
        password: bcrypt.hashSync('password123', 10) 
    },
    {
        id: 2,
        username: 'admin',
        password: bcrypt.hashSync('123', 10) 
    }
];

passport.use(new Strategy(
    { usernameField: 'username' },
    (username, password, done) => {
        const user = users.find(user => user.username === username);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    }
));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    if (user) {
        done(null, user);
    } else {
        done(new Error('User not found'));
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
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            res.json({ success: true, message: 'Login successful', user: { email: user.username } });
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
