// app.js
import express from "express";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import customerRoutes from "./routes/customerRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";  
import { Strategy } from "passport-local";
import cors from "cors";
import db from "./config/db.js";
import bcrypt from "bcrypt";
import multer from "multer";
const app = express();

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "SECRET_KEY",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Routes
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/products",productRoutes);
app.use("/customers", customerRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/sales", salesRoutes);



passport.use(
  new Strategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const result = await db.query(
          "SELECT * FROM EMPLOYEE WHERE E_USERNAME = $1",
          [username]
        );
        const user = result.rows[0];
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.e_password);
        if (isMatch) {
          if (!user.e_active) {
            return done(null, false, {
              message: "Your account is not activated yet.",
            });
          } else {
            return done(null, user);
          }
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.e_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM EMPLOYEE WHERE E_ID = $1", [
      id,
    ]);
    const user = result.rows[0];
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"));
    }
  } catch (err) {
    done(err);
  }
});



// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
