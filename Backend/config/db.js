import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "NEW@22wntg",
  port: 5432,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

export default db;