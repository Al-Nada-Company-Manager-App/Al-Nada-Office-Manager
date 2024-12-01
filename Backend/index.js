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
    filename: (req,  file, cb) => {
        let photoname="";
      if(req.body.username){
         photoname=req.body.username;
      }
      else if (req.body.C_NAME) {
        const firstName = req.body.C_NAME.split(' ')[0]; // Take the first part before a space
        photoname = firstName;
    }
      console.log(photoname);
      console.log(req.body);
      const username = req.body.username; 
      const ext = path.extname(file.originalname); 
      cb(null, `${photoname}${ext}`);
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

        const result = await db.query(
            `INSERT INTO EMPLOYEE 
             (F_NAME, L_NAME, Birth_Date, SALARY, E_ROLE, E_PHOTO, E_ADDRESS, E_CITY, E_COUNTRY, E_ZIPCODE, E_USERNAME, E_PASSWORD, E_GENDER) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
             RETURNING *`,
            [fName, lName, BirthDate, salary, role, photo, address, city, country, zipcode, username, hashedPassword, gender]
          );
          
        res.json({ success: true, message: 'Employee added successfully!', id: result.rows[0].e_id,fName : result.rows[0].f_name, lName : result.rows[0].l_name});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to add employee!' });
    }
});

//for Notifications

app.get('/notificaions', async (req, res) => {
    const result = await db.query(
        'SELECT N.N_ID, N.N_DATE, N.N_TYPE, N.N_MESSAGE, N.N_STATUS, N.E_ID FROM NOTIFICATION N, NOTIFICATION_EMPLOYEE NE WHERE N.N_ID = NE.N_ID AND NE.E_ID = $1', [SignedUser.id]);
    const rows = result.rows;
    res.json(rows);
});

app.post('/sendNotification', async (req, res) => {
    const message = req.body.n_message;
    const type = req.body.n_type;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    
    const formattedDate = `${year}-${month}-${day}`;    const result = await db.query('INSERT INTO NOTIFICATION (N_DATE, N_TYPE, N_MESSAGE, N_STATUS,E_ID) VALUES ($1, $2, $3, $4,$5) RETURNING N_ID', [formattedDate, type, message, 'unread',req.body.n_E_ID]);
    const nId = result.rows[0].n_id;
    await db.query(
        `
        INSERT INTO NOTIFICATION_EMPLOYEE (N_ID, E_ID)
        SELECT $1, E_ID
        FROM EMPLOYEE
        WHERE E_ROLE = 'Manager'
        `,
        [nId]
      );    
      res.json({ success: true, message: 'Notification sent successfully!' });
});
app.get('/getemployeebyid',async (req, res) => {
    const { e_id } = req.query; 
    const result = await db.query(
      'SELECT * FROM EMPLOYEE WHERE E_ID = $1', [e_id]
    );
    res.json(result.rows[0]);
});
app.post('/deleteNotification', async (req, res) => {
    const { n_id } = req.body;  
    console.log(n_id);

    await db.query(
        `
        DELETE FROM 
        NOTIFICATION
        WHERE N_ID = $1
        `, [n_id]
    );

    res.json({ success: true });
});


//for Sales

app.get('/allSales', async (req, res) => {
    const result = await db.query(`
        SELECT 
            SALES.*, 
            CUSTOMER.C_NAME,
            CUSTOMER.C_PHOTO
        FROM 
            SALES
        JOIN 
            CUSTOMER ON SALES.C_ID = CUSTOMER.C_ID
    `);  
    const rows = result.rows;
    console.log(rows);
    res.json(rows);
});

app.get('/allCustomerSales', async (req, res) => {
    const result = await db.query(`
        SELECT
            C_ID,
            C_NAME
        FROM
            CUSTOMER
    `);
    const rows = result.rows;
    res.json(rows);
});

app.get('/allProductsSales', async (req, res) => {
    const result = await db.query(`
        SELECT
            P_ID,
            P_NAME,
            P_SELLPRICE,
            P_QUANTITY
        FROM
            STOCK
    `);
    const rows = result.rows;
    console.log(rows);

    res.json(rows);
});

app.post('/addSale', async (req, res) => {
    try {
      const {
        saleType,
        customer,
        billNumber,
        cost,
        discount,
        tax,
        total,
        paidAmount,
        insuranceAmount,
        status,
        currency,
        saleDate,
        products, // Array of product objects: [{ p_id, quantity }]
      } = req.body;
  
      const formatDate = new Date(saleDate);
      const year = formatDate.getFullYear();
      const month = formatDate.getMonth() + 1;
      const day = formatDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
  
      // Insert the sale into the SALES table
      const saleResult = await db.query(
        `INSERT INTO SALES 
          (C_ID, SL_DATE, SL_TOTAL, SL_DISCOUNT, SL_TAX, SL_STATUS, SL_TYPE, SL_INAMOUNT, SL_COST, SL_BILLNUM, SL_PAYED, SL_CURRENCY) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
         RETURNING SL_ID`,
        [
          customer.c_id,
          formattedDate,
          total,
          discount,
          tax,
          status,
          saleType,
          insuranceAmount,
          cost,
          billNumber,
          paidAmount,
          currency,
        ]
      );
  
      const saleId = saleResult.rows[0].sl_id;
  
      // Insert products into the SELL_ITEMS table
      const productValues = products.map(
        (product) => `(${product.p_id}, ${saleId}, ${product.quantity}, ${product.totalCost})`
      ).join(", ");
      
      await db.query(
        `INSERT INTO SELL_ITEMS (P_ID, SL_ID, SI_QUANTITY, SI_TOTAL) 
         VALUES ${productValues}`
      );
  
      // Update product quantities in the STOCK table
      for (const product of products) {
        await db.query(
          `UPDATE STOCK 
           SET P_QUANTITY = P_QUANTITY - $1 
           WHERE P_ID = $2 AND P_QUANTITY >= $1`,
          [product.quantity, product.p_id]
        );
      }
  
      res.json({ success: true, message: "Sale and products added successfully!" });
    } catch (error) {
      console.error("Error adding sale:", error);
      res.status(500).json({ success: false, message: "Failed to add sale", error: error.message });
    }
  });
  //customer function
app.get('/allcustomers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Customer');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching customers');
    }
});

// Add a customer
app.post('/addcustomer', upload.single('photo'), async (req, res) => {
    const { C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX } = req.body;
    const C_PHOTO = req.file ? req.file.filename : null;
    try {
        await db.query(
            'INSERT INTO Customer (C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX, C_PHOTO) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX, C_PHOTO]
        );
        res.send('Customer added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding customer');
    }
});

// Delete a customer
app.post('/deletecustomer', async (req, res) => {
    const { id } = req.body;
    try {
        await db.query('DELETE FROM Customer WHERE C_ID = $1', [id]);
        res.send('Customer deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting customer');
    }
});
app.post('/updatecustomer', upload.single('photo'), async (req, res) => {
    const { C_ID, C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX } = req.body;
    const C_PHOTO = req.file ? req.file.filename : null;  // If a new photo is uploaded, use the new filename
    try {
        // Correct the SQL query
        await db.query(
            'UPDATE Customer SET C_NAME = $1, C_ADDRESS = $2, C_CITY = $3, C_COUNTRY = $4, C_ZIPCODE = $5, C_FAX = $6, C_PHOTO = $7 WHERE C_ID = $8',
            [
                C_NAME, 
                C_ADDRESS, 
                C_CITY, 
                C_COUNTRY, 
                C_ZIPCODE, 
                C_FAX, 
                C_PHOTO,  // Add the photo to the update query
                C_ID       // Use C_ID as the identifier to update the correct customer
            ]
        );

        res.send('Customer updated successfully');  // Success message
    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).send('Error updating customer');  // Error response
    }
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
