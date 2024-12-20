import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import cors from "cors";
import pg from "pg";
import multer from "multer";
import path from "path";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Al Nada",
  password: "NEW@22wntg",
  port: 5432,
});
// const db = new pg.Client({

//   connectionString:
//     "postgresql://neondb_owner:Z50JaCBQWOMr@ep-nameless-darkness-a5mhhisx.us-east-2.aws.neon.tech/neondb?sslmode=require",
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static("../Frontend/public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderName = "";
    if (req.body.E_ID) {
      folderName = "Users";
    } else if (req.body.C_ID) {
      folderName = "Customers";
    } else if (req.body.S_ID) {
      folderName = "Suppliers";
    } else if (req.body.P_ID) {
      folderName = "Products";
    }

    const destinationPath = path.join("../Frontend/public", folderName);
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    let photoname = "";
    console.log(req.body);
    if (req.body.E_ID) {
      photoname = req.body.E_ID;
    } else if (req.body.C_ID) {
      const firstName = req.body.C_ID;
      photoname = firstName;
    } else if (req.body.S_ID) {
      const firstName = req.body.S_ID;
      photoname = firstName;
    } else if (req.body.P_ID) {
      const firstName = req.body.P_ID;
      photoname = firstName;
    }

    const ext = path.extname(file.originalname);
    cb(null, `${photoname}${ext}`);
  },
});

const upload = multer({ storage });

//get The signed user data
const SignedUser = {
  id: 1,
  fName: "",
  lName: "",
  BirthDate: "",
  salary: "",
  Role: "",
  Photo: "",
  Address: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  zipcode: "",
  username: "",
  password: "",
  Gender: "",
};

app.get("/SignedUser", async (req, res) => {
  try {
    if (!SignedUser || !SignedUser.id) {
      return res.status(400).json({ error: "No signed user found" });
    }

    const userId = SignedUser.id;

    const accessQuery = `
      SELECT * 
      FROM ACCESS_Actions 
      WHERE E_ID = $1
    `;

    const accessResult = await db.query(accessQuery, [userId]);

    if (accessResult.rows.length === 0) {
      return res.status(404).json({ error: "Access data not found for user" });
    }

    const userAccess = accessResult.rows[0];

    const responseData = {
      user: SignedUser,
      access: userAccess,
    };

    res.json(responseData);
  } catch (err) {
    console.error("Error fetching signed user access data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/allUsers", async (req, res) => {
  const result = await db.query("SELECT * FROM EMPLOYEE");
  const rows = result.rows;
  res.json(rows);
});

app.post("/deleteUser", async (req, res) => {
  const id = req.body.id;
  await db.query("DELETE FROM EMPLOYEE WHERE E_ID = $1", [id]);
  res.json({ success: true });
});

app.post("/deactivateUser", async (req, res) => {
  const id = req.body.id;
  await db.query("UPDATE EMPLOYEE SET E_ACTIVE = FALSE WHERE E_ID = $1", [id]);
  res.json({ success: true });
});

app.post("/activateUser", async (req, res) => {
  const id = req.body.id;
  await db.query("UPDATE EMPLOYEE SET E_ACTIVE = TRUE WHERE E_ID = $1", [id]);
  res.json({ success: true });
});

app.post("/addUser", async (req, res) => {
  try {
    //console.log(req.body);
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

    const hashedPassword = await bcrypt.hash(pass, 10);

    const result = await db.query(
      `INSERT INTO EMPLOYEE 
             (F_NAME, L_NAME, Birth_Date, SALARY, E_ROLE, E_PHOTO, E_ADDRESS, E_CITY, E_COUNTRY, E_ZIPCODE, E_USERNAME, E_PASSWORD, E_GENDER) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
             RETURNING *`,
      [
        fName,
        lName,
        BirthDate,
        salary,
        role,
        null,
        address,
        city,
        country,
        zipcode,
        username,
        hashedPassword,
        gender,
      ]
    );

    res.json({
      success: true,
      message: "Employee added successfully!",
      id: result.rows[0].e_id,
      fName: result.rows[0].f_name,
      lName: result.rows[0].l_name,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add employee!" });
  }
});

app.post("/updateUserProfile", async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE EMPLOYEE SET 
        F_NAME = $1,
        L_NAME = $2,
        Birth_Date = $3,
        SALARY = $4,
        E_ADDRESS = $5,
        E_EMAIL = $6,
        E_PHONE = $7,
        E_CITY = $8,
        E_COUNTRY = $9,
        E_ZIPCODE = $10,
        E_USERNAME = $11,
        E_PASSWORD = $12
      WHERE E_ID = $13`,
      [
        req.body.fName,
        req.body.lName,
        req.body.BirthDate,
        req.body.salary,
        req.body.Address,
        req.body.email,
        req.body.phone,
        req.body.city,
        req.body.country,
        req.body.zipcode,
        req.body.username,
        req.body.password,
        req.body.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

app.post("/updateuserphoto", upload.single("photo"), async (req, res) => {
  const E_PHOTO = req.file ? req.file.filename : null;
  console.log(E_PHOTO);
  const E_ID = req.body.E_ID; // Should now be available
  console.log(E_ID);
  try {
    await db.query("UPDATE Employee SET E_PHOTO = $1 WHERE E_ID = $2", [
      E_PHOTO,
      req.body.E_ID,
    ]);
    res.send("Employee photo updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating Employee photo");
  }
});
app.get("/notificaions", async (req, res) => {
  const result = await db.query(
    "SELECT N.N_ID, N.N_DATE, N.N_TYPE, N.N_MESSAGE, N.N_STATUS, N.E_ID,N.P_ID,N.D_ID FROM NOTIFICATION N, NOTIFICATION_EMPLOYEE NE WHERE N.N_ID = NE.N_ID AND NE.E_ID = $1",
    [SignedUser.id]
  );
  const rows = result.rows;
  res.json(rows);
});

app.post("/sendNotification", async (req, res) => {
  const message = req.body.n_message;
  const type = req.body.n_type;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedDate = `${year}-${month}-${day}`;
  const result = await db.query(
    "INSERT INTO NOTIFICATION (N_DATE, N_TYPE, N_MESSAGE, N_STATUS,E_ID) VALUES ($1, $2, $3, $4,$5) RETURNING N_ID",
    [formattedDate, type, message, "unread", req.body.n_E_ID]
  );
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
  res.json({ success: true, message: "Notification sent successfully!" });
});
app.get("/getemployeebyid/", async (req, res) => {
  const { id } = req.query;
  const result = await db.query("SELECT * FROM EMPLOYEE WHERE E_ID = $1", [id]);
  res.json(result.rows[0]);
});
app.get("/getproductbyid/", async (req, res) => {
  const { id } = req.query;
  const result = await db.query("SELECT * FROM STOCK WHERE P_ID = $1", [id]);
  res.json(result.rows[0]);
});
app.get("/getdebtbyid/", async (req, res) => {
  const { id } = req.query;
  const result = await db.query("SELECT * FROM DEBTS WHERE D_ID = $1", [id]);
  res.json(result.rows[0]);
});

app.post("/deleteNotification", async (req, res) => {
  await db.query(
    `
        DELETE FROM 
        NOTIFICATION_EMPLOYEE
        WHERE N_ID = $1 and E_ID = $2
        `,
    [req.body.id.n_id, req.body.id.e_id]
  );

  res.json({ success: true });
});

//for Sales

app.get("/allSales", async (req, res) => {
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
  res.json(rows);
});

app.get("/allProductsSales", async (req, res) => {
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

  res.json(rows);
});

app.post("/addSale", async (req, res) => {
  try {
    const saleType = req.body.saleType;
    const customer = req.body.customer;
    const billNumber = req.body.billNumber;
    const cost = req.body.cost;
    const discount = req.body.discount;
    const tax = req.body.tax;
    const paidAmount = req.body.paidAmount;
    const insuranceAmount = req.body.insuranceAmount;
    const status = req.body.status;
    const currency = req.body.currency;
    const saleDate = req.body.saleDate;
    const products = req.body.products;
    const total = req.body.total;
    const DueDate = req.body.dueDate;
    const InsuranceDueDate = req.body.insuranceDueDate;

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
    if (products.length > 0) {
      const productValues = products
        .map(
          (product) =>
            `(${product.p_id}, ${saleId}, ${product.quantity}, ${product.totalCost})`
        )
        .join(", ");

      await db.query(
        `INSERT INTO SELL_ITEMS (P_ID, SL_ID, SI_QUANTITY, SI_TOTAL) 
         VALUES ${productValues}`
      );
    }

    // Update product quantities in the STOCK table
    for (const product of products) {
      await db.query(
        `UPDATE STOCK 
           SET P_QUANTITY = P_QUANTITY - $1 
           WHERE P_ID = $2 AND P_QUANTITY >= $1`,
        [product.quantity, product.p_id]
      );
    }

    // Insert records into the DEBTS table based on paidAmount and insuranceAmount
    if (paidAmount < total) {
      const debtInAmount = -1 * (total - paidAmount);
      await db.query(
        `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, $2, $3, $4, $5)`,
        [DueDate, "DEBT_IN", debtInAmount, currency, saleId]
      );
    } else if (paidAmount > total) {
      const debtOutAmount = paidAmount - total;
      await db.query(
        `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, $2, $3, $4, $5)`,
        [DueDate, "DEBT_OUT", debtOutAmount, currency, saleId]
      );
    }

    if (insuranceAmount > 0) {
      const insuranceDebtAmount = -1 * insuranceAmount;
      await db.query(
        `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, $2, $3, $4, $5)`,
        [InsuranceDueDate, "INSURANCE", insuranceDebtAmount, currency, saleId]
      );
    }

    res.json({
      success: true,
      message: "Sale and products added successfully!",
    });
  } catch (error) {
    console.error("Error adding sale:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add sale",
      error: error.message,
    });
  }
});
//update sale
app.post("/updateSale", async (req, res) => {
  try {
    const { SL_ID, sl_payed, sl_inamount, sl_status } = req.body;

    // Fetch the current sale details
    const saleResult = await db.query(
      `SELECT SL_TOTAL, SL_PAYED, SL_INAMOUNT, SL_CURRENCY 
       FROM SALES 
       WHERE SL_ID = $1`,
      [SL_ID]
    );

    if (saleResult.rows.length === 0) {
      throw new Error(`Sale with ID ${SL_ID} not found`);
    }

    const { sl_total, sl_currency } = saleResult.rows[0];

    // Update the SALES table
    await db.query(
      `UPDATE SALES 
       SET SL_PAYED = $1, SL_INAMOUNT = $2, SL_STATUS = $3 
       WHERE SL_ID = $4`,
      [sl_payed, sl_inamount, sl_status, SL_ID]
    );

    // Handle debts updates
    // Retrieve existing debts for the sale
    const existingDebts = await db.query(
      `SELECT D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY FROM DEBTS WHERE SL_ID = $1`,
      [SL_ID]
    );

    // Clear existing debts for the sale
    await db.query(`DELETE FROM DEBTS WHERE SL_ID = $1`, [SL_ID]);

    // Recalculate debts based on the new payment amounts
    const remainingAmount = sl_total - sl_payed;

    // Insert new debts with preserved D_DATE or current date
    if (remainingAmount > 0) {
      const debtDate =
        existingDebts.rows.find((debt) => debt.D_TYPE === "DEBT_IN")?.D_DATE ||
        new Date();
      await db.query(
        `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
         VALUES ($1, 'DEBT_IN', $2, $3, $4)`,
        [debtDate, -remainingAmount, sl_currency, SL_ID]
      );
    } else if (remainingAmount < 0) {
      // If there is overpayment
      const debtDate =
        existingDebts.rows.find((debt) => debt.D_TYPE === "DEBT_OUT")?.D_DATE ||
        new Date();
      await db.query(
        `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
         VALUES ($1, 'DEBT_OUT', $2, $3, $4)`,
        [debtDate, Math.abs(remainingAmount), sl_currency, SL_ID]
      );
    }

    if (sl_inamount > 0) {
      // Handle insurance debts
      const insuranceDebtDate =
        existingDebts.rows.find((debt) => debt.D_TYPE === "INSURANCE")
          ?.D_DATE || new Date();
      await db.query(
        `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
         VALUES ($1, 'INSURANCE', $2, $3, $4)`,
        [insuranceDebtDate, -sl_inamount, sl_currency, SL_ID]
      );
    }

    res.json({
      success: true,
      message: "Sale and debts updated successfully!",
    });
  } catch (error) {
    console.error("Error updating sale:", error);

    // Rollback the transaction in case of error
    await db.query("ROLLBACK");

    res.status(500).json({
      success: false,
      message: "Failed to update sale",
      error: error.message,
    });
  }
});

//delete sale
app.post("/deleteSale", async (req, res) => {
  const sl_id = req.body.id;
  try {
    await db.query(
      `
        DELETE FROM 
        SALES
        WHERE SL_ID = $1
        `,
      [sl_id]
    );
    res.send("Debt deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting debt");
  }
});

//customer function
app.get("/allcustomers", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Customer");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching customers");
  }
});

// Add a customer
app.post("/addcustomer", async (req, res) => {
  // console.log(req.body);
  const { C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO Customer (C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX, C_PHOTO) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING C_ID",
      [C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX, null]
    );

    const newCustomerId = result.rows[0].c_id;
    res.json({ success: true, c_id: newCustomerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding customer" });
  }
});
//update customer photo
app.post("/updatecustomerphoto", upload.single("photo"), async (req, res) => {
  //console.log(req.body);
  const { C_ID } = req.body.C_ID;
  const C_PHOTO = req.file ? req.file.filename : null;
  console.log(req.body.C_ID);
  try {
    await db.query("UPDATE Customer SET C_PHOTO = $1 WHERE C_ID = $2", [
      C_PHOTO,
      req.body.C_ID,
    ]);
    res.send("Customer photo updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating customer photo");
  }
});

// Delete a customer
app.post("/deletecustomer", async (req, res) => {
  const { id } = req.body;
  try {
    await db.query("DELETE FROM Customer WHERE C_ID = $1", [id]);
    res.send("Customer deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting customer");
  }
});
app.post("/updatecustomer", async (req, res) => {
  const { C_ID, c_name, c_address, c_city, c_country, c_zipcode, c_fax } =
    req.body;
  try {
    await db.query(
      "UPDATE Customer SET C_NAME = $1, C_ADDRESS = $2, C_CITY = $3, C_COUNTRY = $4, C_ZIPCODE = $5, C_FAX = $6  WHERE C_ID = $7",
      [c_name, c_address, c_city, c_country, c_zipcode, c_fax, C_ID]
    );

    res.send("Customer updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating customer");
  }
});
app.get("/customersales", async (req, res) => {
  const { id } = req.body;
  try {
    // Fetch customer details
    const customerQuery = `
            SELECT C_ID, C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX, C_PHOTO 
            FROM CUSTOMER 
            WHERE C_ID = $1
        `;
    const customerResult = await db.query(customerQuery, [id]);

    // If the customer is not found
    if (customerResult.rows.length === 0) {
      return res.status(404).send("Customer not found");
    }

    const customer = customerResult.rows[0];

    // Fetch customer's sales history
    const salesQuery = `
            SELECT SL_ID, SL_DATE, SL_TOTAL, SL_DISCOUNT, SL_TAX, SL_STATUS, SL_TYPE, SL_INAMOUNT, SL_COST, SL_BILLNUM, SL_PAYED, SL_CURRENCY
            FROM SALES 
            WHERE C_ID = $1
            ORDER BY SL_DATE DESC
        `;
    const salesResult = await db.query(salesQuery, [id]);

    // Combine customer details and sales history
    const response = {
      customerDetails: customer,
      salesHistory: salesResult.rows,
    };

    res.json(response);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Error fetching customer details and sales history");
  }
});
// Example Node.js/Express endpoint

//for purchase
app.get("/allPurchase", async (req, res) => {
  const result = await db.query(`
          SELECT 
            PURCHASE.*, 
            SUPPLIER.S_NAME,
            SUPPLIER.S_PHOTO
        FROM 
            PURCHASE
        JOIN 
            SUPPLIER ON PURCHASE.S_ID = SUPPLIER.S_ID
        
    `);
  const rows = result.rows;
  res.json(rows);
});

app.get("/allSupplierPch", async (req, res) => {
  const result = await db.query(`
        SELECT  S_ID,S_NAME
        FROM  SUPPLIER
    `);
  const rows = result.rows;
  res.json(rows);
});

app.get("/allProductsPch", async (req, res) => {
  const result = await db.query(`
        SELECT P_ID, P_NAME, P_COSTPRICE,P_QUANTITY
        FROM STOCK
    `);
  const rows = result.rows;

  res.json(rows);
});

app.post("/addPch", async (req, res) => {
  try {
    let {
      supplier,
      billNumber,
      expense,
      customscost,
      customsnum,
      cost,
      tax,
      total,
      currency,
      purchasedate,
      products,
    } = req.body;

    const formatDate = new Date();
    const year = formatDate.getFullYear();
    const month = formatDate.getMonth() + 1;
    const day = formatDate.getDate();
    const formattedDate = `${year}-${month}-${day}`;

    const purchaseResult = await db.query(
      `INSERT INTO PURCHASE 
          (S_ID, PCH_DATE, PCH_TOTAL, PCH_TAX, PCH_COST, PCH_BILLNUM, PCH_CURRENCY, PCH_EXPENSE, PCH_CUSTOMSCOST, PCH_CUSTOMSNUM) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         RETURNING PCH_ID`,
      [
        supplier.s_id,
        formatDate,
        total,
        tax,
        cost,
        billNumber,
        currency,
        expense,
        customscost,
        customsnum,
      ]
    );

    const purchaseId = purchaseResult.rows[0].pch_id;

    const productValues = products
      .map(
        (product) =>
          `(${product.p_id}, ${purchaseId}, ${product.quantity}, ${
            product.quantity * product.costprice
          })`
      )
      .join(", ");

    await db.query(
      `INSERT INTO PURCHASE_ITEMS (P_ID, PCH_ID, PI_QUANTITY, PI_TOTAL) 
         VALUES ${productValues}`
    );

    for (const product of products) {
      await db.query(
        `UPDATE STOCK 
           SET P_QUANTITY = P_QUANTITY + $1 , P_COSTPRICE = $2
           WHERE P_ID = $3 `,
        [product.quantity, product.costprice, product.p_id]
      );
    }

    res.json({
      success: true,
      message: "Purchase and products added successfully!",
    });
  } catch (error) {
    console.error("Error adding Purchase:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add Purchase",
      error: error.message,
    });
  }
});

app.post("/updatePch", async (req, res) => {
  try {
    const { PCH_ID, cost, tax, customscost, expense, total, products } =
      req.body;
    console.log(req.body);

    await db.query(
      `UPDATE PURCHASE 
             SET  PCH_TOTAL = $1, PCH_TAX = $2, 
                 PCH_COST = $3,
                 PCH_EXPENSE = $4, PCH_CUSTOMSCOST = $5
             WHERE PCH_ID = $6`,
      [total, tax, cost, expense, customscost, PCH_ID]
    );

    const currentProducts = await db.query(
      `SELECT P_ID, PI_QUANTITY FROM PURCHASE_ITEMS WHERE PCH_ID = $1`,
      [PCH_ID]
    );
    console.log(currentProducts.rows);

    for (const item of currentProducts.rows) {
      await db.query(
        `UPDATE STOCK 
                   SET P_QUANTITY = P_QUANTITY - $1 
                   WHERE P_ID = $2`,
        [item.pi_quantity, item.p_id]
      );
    }

    await db.query(`DELETE FROM PURCHASE_ITEMS WHERE PCH_ID = $1`, [PCH_ID]);

    const productValues = products
      .map(
        (product) =>
          `(${product.p_id}, ${PCH_ID}, ${product.quantity},${product.costprice}
        , ${product.quantity * product.costprice})`
      )
      .join(", ");
    console.log(productValues);

    await db.query(
      `INSERT INTO PURCHASE_ITEMS (P_ID, PCH_ID, PI_QUANTITY,P_COSTPRICE,PI_TOTAL) 
               VALUES ${productValues}`
    );

    for (const product of products) {
      await db.query(
        `UPDATE STOCK 
                 SET P_QUANTITY = P_QUANTITY + $1 , P_COSTPRICE = $2
                 WHERE P_ID = $3`,
        [product.quantity, product.costprice, product.p_id]
      );
    }

    res.json({ success: true, message: "Purchase updated successfully!" });
  } catch (error) {
    console.error("Error updating Purchase:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update Purchase",
      error: error.message,
    });
  }
});

app.post("/deletePurchase", async (req, res) => {
  const { id } = req.body;
  console.log("Received ID:", id);
  try {
    await db.query("DELETE FROM PURCHASE WHERE PCH_ID = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete purchase",
      error: error.message,
    });
  }
});
app.get("/getSupplierPurchase/:id", async (req, res) => {
  const supplierId = req.params.id;
  try {
    const purchases = await db.query(
      `SELECT * FROM PURCHASE WHERE S_ID = $1 ORDER BY PCH_DATE DESC`,
      [supplierId]
    );
    res.json(purchases.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Purchases history." });
  }
});

////Supplier
app.get("/allsuppliers", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM SUPPLIER");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Suppliers");
  }
});
// Add a customer
app.post("/addsupplier", async (req, res) => {
  // console.log(req.body);
  const { S_NAME, S_ADDRESS, S_CITY, S_COUNTRY, S_ZIPCODE, S_FAX } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO Supplier (S_NAME, S_ADDRESS, S_CITY, S_COUNTRY, S_ZIPCODE, S_FAX, S_PHOTO) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING S_ID",
      [S_NAME, S_ADDRESS, S_CITY, S_COUNTRY, S_ZIPCODE, S_FAX, null]
    );

    const newSupplierId = result.rows[0].s_id;
    res.json({ success: true, s_id: newSupplierId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding customer" });
  }
});
//update customer photo
app.post("/updatesupplierphoto", upload.single("photo"), async (req, res) => {
  const S_PHOTO = req.file ? req.file.filename : null;
  try {
    await db.query("UPDATE Supplier SET S_PHOTO = $1 WHERE S_ID = $2", [
      S_PHOTO,
      req.body.S_ID,
    ]);
    res.send("Supplier photo updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating Supplier photo");
  }
});
app.post("/deletesupplier", async (req, res) => {
  const { id } = req.body;
  try {
    await db.query("DELETE FROM Supplier WHERE S_ID = $1", [id]);
    res.send("Supplier deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting supplier");
  }
});
app.post("/updatesupplier", async (req, res) => {
  console.log(req.body);
  const { S_ID, s_name, s_address, s_city, s_country, s_zipcode, s_fax } =
    req.body;
  try {
    await db.query(
      "UPDATE Supplier SET S_NAME = $1, S_ADDRESS = $2, S_CITY = $3, S_COUNTRY = $4, S_ZIPCODE = $5, S_FAX = $6  WHERE S_ID = $7",
      [s_name, s_address, s_city, s_country, s_zipcode, s_fax, S_ID]
    );

    res.send("Supplier updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating Supplier");
  }
});

app.get("/getCustomerSales/:id", async (req, res) => {
  const customerId = req.params.id;
  try {
    const sales = await db.query(
      `SELECT * FROM SALES WHERE C_ID = $1 ORDER BY SL_DATE DESC`,
      [customerId]
    );
    res.json(sales.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sales history." });
  }
});

// Get device under maintanence
app.get("/AllRepairProcess", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT 
        r.REP_ID,
        CASE 
          WHEN s.P_STATUS = 'Completed' THEN r.REP_DATE
          ELSE NULL
        END AS REP_DATE,
        s.P_ID,
        s.SERIAL_NUMBER,
        s.P_CATEGORY,
        s.P_NAME,
        s.P_STATUS,
        COALESCE(
          json_agg(
            json_build_object(
              'sp_id', sp.P_ID,
              'sp_name', sp.P_NAME,
              'sp_quantity', rp.SP_QUANTITY,
              'sp_category', sp.P_CATEGORY,
              'sp_model_code', sp.MODEL_CODE
            )
          ) FILTER (WHERE rp.SP_ID IS NOT NULL),
          '[]' -- Return empty array if no spare parts
        ) AS spare_parts
      FROM REPAIR r
      LEFT JOIN STOCK s ON r.P_ID = s.P_ID -- Link REPAIR to STOCK
      LEFT JOIN REPAIR_PROCESS rp ON r.REP_ID = rp.REP_ID -- Link REPAIR_PROCESS to REPAIR
      LEFT JOIN STOCK sp ON rp.SP_ID = sp.P_ID -- Link spare parts to STOCK
      WHERE s.P_CATEGORY = 'Device Under Maintenance'
      GROUP BY 
        r.REP_ID, 
        r.REP_DATE, 
        s.P_ID, 
        s.SERIAL_NUMBER, 
        s.P_CATEGORY, 
        s.P_NAME, 
        s.P_STATUS
      ORDER BY r.REP_DATE DESC NULLS LAST;
      `
    );
    console.log("all result data", result.rows[0].spare_parts);
    res.json(result.rows.length > 0 ? result.rows : []);
  } catch (error) {
    console.error("Error fetching repair process data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// add repair process
app.post("/AddRepairProcess", async (req, res) => {
  let { p_id, remarks, rep_date, spare_parts } = req.body;

  console.log(p_id, remarks, rep_date, spare_parts);
  console.log(spare_parts ? spare_parts.length : 0);

  if (!p_id) {
    return res
      .status(400)
      .json({ success: false, message: "Device (p_id) is required." });
  }
  if (!Array.isArray(spare_parts)) {
    spare_parts = []; // Ensure spare_parts is an empty array if null or invalid
  }

  try {
    await db.query("BEGIN");

    const repairResult = await db.query(
      `INSERT INTO REPAIR (P_ID, REMARKS, REP_DATE) 
       VALUES ($1, $2, $3) 
       RETURNING REP_ID`,
      [p_id, remarks, rep_date]
    );
    const rep_id = repairResult.rows[0].rep_id;

    console.log("Inserted REPAIR with REP_ID:", rep_id);

    for (const sparePart of spare_parts) {
      const { sp_id, sp_quantity } = sparePart;

      const stockResult = await db.query(
        "SELECT P_QUANTITY FROM STOCK WHERE P_ID = $1",
        [sp_id]
      );

      if (
        stockResult.rows.length === 0 ||
        stockResult.rows[0].p_quantity < sp_quantity
      ) {
        throw new Error(
          `Not enough stock for spare part ID ${sp_id}. Available: ${
            stockResult.rows[0]?.p_quantity || 0
          }`
        );
      }

      await db.query(
        `INSERT INTO REPAIR_PROCESS (REP_ID, SP_ID, SP_QUANTITY) 
         VALUES ($1, $2, $3)`,
        [rep_id, sp_id, sp_quantity]
      );

      // Update stock quantity in STOCK table
      await db.query(
        `UPDATE STOCK 
         SET P_QUANTITY = P_QUANTITY - $1 
         WHERE P_ID = $2`,
        [sp_quantity, sp_id]
      );

      const updatedQuantity = await db.query(
        "SELECT P_QUANTITY FROM STOCK WHERE P_ID = $1",
        [sp_id]
      );

      console.log(
        `Updated STOCK for SP_ID ${sp_id}: the quntity before update:${stockResult.rows[0].p_quantity} , Reduced quantity by ${sp_quantity}: the updated quantity is ${updatedQuantity.rows[0].p_quantity}`
      );
    }

    await db.query("COMMIT");

    res.json({
      success: true,
      message: "Repair process added successfully!",
      rep_id,
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error adding repair process:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/AllDUM", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT P_ID, P_NAME, SERIAL_NUMBER,P_STATUS FROM STOCK WHERE P_CATEGORY = 'Device Under Maintenance'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching devices:", error.message);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

app.get("/api/AllSpareParts", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT P_ID, P_NAME, P_QUANTITY, MODEL_CODE, P_CATEGORY FROM STOCK WHERE P_CATEGORY = 'Spare Part'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching spare parts:", error.message);
    res.status(500).json({ error: "Failed to fetch spare parts" });
  }
});

app.get("/api/ProductStatus", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT P_STATUS, COUNT(P_ID) FROM STOCK WHERE P_CATEGORY = 'Spare Part'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching spare parts:", error.message);
    res.status(500).json({ error: "Failed to fetch spare parts" });
  }
});

// Add Device Under Maintenance
app.post("/AddDUM", async (req, res) => {
  try {
    const SERIALNUMBER = req.body.serialnumber;
    const PNAME = req.body.productname;
    //const CATEGORY = req.body.category; 
    const PSTATUS = req.body.maintenanceStatus;

    await db.query(
      "INSERT INTO STOCK (P_NAME, P_CATEGORY, SERIAL_NUMBER, P_STATUS) VALUES ($1, 'Device Under Maintenance', $2, $3)",
      [PNAME, SERIALNUMBER, PSTATUS]
    );

    res.json({
      success: true,
      message: "Device Under Maintenance added successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add Device Under Maintenance!",
    });
  }
});

//edit spare part quantity
app.put("/api/repair-process/:rep_id/spare-part/:sp_id", async (req, res) => {
  const { rep_id, sp_id } = req.params;
  const { sp_quantity } = req.body;

  try {
    const checkExistence = await db.query(
      "SELECT * FROM REPAIR_PROCESS WHERE REP_ID = $1 AND SP_ID = $2",
      [rep_id, sp_id]
    );

    if (checkExistence.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Spare part not found in this repair process." });
    }

    const previousQuantity = checkExistence.rows[0].sp_quantity;

    const quantityDifference = sp_quantity - previousQuantity;

    await db.query(
      "UPDATE REPAIR_PROCESS SET SP_QUANTITY = $1 WHERE REP_ID = $2 AND SP_ID = $3",
      [sp_quantity, rep_id, sp_id]
    );

    // Reflect the changes in the STOCK table
    if (quantityDifference !== 0) {
      await db.query(
        `UPDATE STOCK
         SET P_QUANTITY = P_QUANTITY - $1
         WHERE P_ID = $2`,
        [quantityDifference, sp_id]
      );
    }

    res.status(200).json({ message: "Spare part updated successfully!" });
  } catch (error) {
    console.error("Error updating spare part:", error);
    res.status(500).json({ message: "Failed to update spare part." });
  }
});

// delete spare part
app.delete(
  "/api/repair-process/:rep_id/spare-part/:sp_id",
  async (req, res) => {
    const { rep_id, sp_id } = req.params;

    try {
      const useQuantity = await db.query(
        "SELECT SP_QUANTITY FROM REPAIR_PROCESS WHERE SP_ID = $1 AND REP_ID = $2",
        [sp_id, rep_id]
      );

      if (useQuantity.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Spare part not found in this repair process." });
      }

      const sp_quantity = useQuantity.rows[0].sp_quantity;
      console.log(`Spare part used qunatity before delete : ${sp_quantity}`);

      const result = await db.query(
        "DELETE FROM REPAIR_PROCESS WHERE REP_ID = $1 AND SP_ID = $2",
        [rep_id, sp_id]
      );

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Spare part not found in the repair process." });
      }

      // Update the stock quantity if the spare part quantity was used
      if (sp_quantity > 0) {
        await db.query(
          `UPDATE STOCK 
         SET P_QUANTITY = P_QUANTITY + $1 
         WHERE P_ID = $2`,
          [sp_quantity, sp_id]
        );
      }

      const updatedQuantity = await db.query(
        "SELECT P_QUANTITY FROM STOCK WHERE P_ID = $1",
        [sp_id]
      );
      //////////////////////////////////
      console.log(
        `Spare part stock qunatity after delete : ${updatedQuantity.rows[0].p_quantity}`
      );

      res.status(200).json({
        message: "Spare part deleted and stock updated successfully!",
      });
    } catch (error) {
      console.error("Error deleting spare part:", error);
      res.status(500).json({ message: "Failed to delete spare part." });
    }
  }
);

// delete repair process
app.delete("/api/repair/:rep_id", async (req, res) => {
  const { rep_id } = req.params;

  try {
    await db.query("BEGIN");

    const repairStatusResult = await db.query(
      "SELECT P_STATUS FROM REPAIR r JOIN STOCK s ON r.P_ID = s.P_ID WHERE r.REP_ID = $1",
      [rep_id]
    );

    if (repairStatusResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Repair process not found." });
    }

    const repairStatus = repairStatusResult.rows[0].p_status;

    if (repairStatus === "Repairing") {
      const repairProcessResult = await db.query(
        "SELECT SP_ID, SP_QUANTITY FROM REPAIR_PROCESS WHERE REP_ID = $1",
        [rep_id]
      );

      for (const sparePart of repairProcessResult.rows) {
        const { sp_id, sp_quantity } = sparePart;

        await db.query(
          "UPDATE STOCK SET P_QUANTITY = P_QUANTITY + $1 WHERE P_ID = $2",
          [sp_quantity, sp_id]
        );
      }
    }

    await db.query("DELETE FROM REPAIR_PROCESS WHERE REP_ID = $1", [rep_id]);

    const deleteRepairResult = await db.query(
      "DELETE FROM REPAIR WHERE REP_ID = $1 RETURNING REP_ID",
      [rep_id]
    );

    if (deleteRepairResult.rowCount === 0) {
      await db.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Repair process not found." });
    }

    await db.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Repair process and related spare parts deleted successfully.",
      rep_id: rep_id,
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error deleting repair process:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete repair process." });
  }
});

// update repair remarks and date
app.post("/api/updateRepair", async (req, res) => {
  const { REP_ID, P_ID, P_STATUS, REMARKS, REP_DATE } = req.body;

  console.log("repair ID", REP_ID, P_ID, P_STATUS, REMARKS, REP_DATE);
  try {
    await db.query("UPDATE STOCK SET P_STATUS = $1 WHERE P_ID = $2", [
      P_STATUS,
      P_ID,
    ]);

    await db.query(
      "UPDATE REPAIR SET REMARKS = $1, REP_DATE = $2 WHERE REP_ID = $3",
      [REMARKS, REP_DATE, REP_ID]
    );

    res.json({ message: "Update successful!" });
  } catch (error) {
    console.error("Error updating repair details:", error);
    res.status(500).json({ error: "Failed to update repair details" });
  }
});

// Get status of product
app.get("/api/getProductStatus/:p_id", async (req, res) => {
  const { p_id } = req.params;

  try {
    const result = await db.query(
      "SELECT P_STATUS FROM STOCK WHERE P_ID = $1",
      [p_id]
    );

    if (result.rows.length > 0) {
      res.json({ p_status: result.rows[0].p_status });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product status:", error);
    res.status(500).json({ error: "Failed to fetch product status" });
  }
});

// get repairing data to be fetch before open the form
app.get("/api/getRepairProduct/:rep_id", async (req, res) => {
  const { rep_id } = req.params;
  console.log(rep_id);
  try {
    const repairResult = await db.query(
      "SELECT r.REMARKS, r.REP_DATE, s.P_STATUS FROM REPAIR r INNER JOIN STOCK s ON r.P_ID = s.P_ID WHERE r.REP_ID = $1",
      [rep_id]
    );
    console.log(repairResult.rows[0]);
    if (repairResult.rows.length > 0) {
      res.json(repairResult.rows[0]);
    } else {
      res.status(404).json({ message: "Repair record not found" });
    }
  } catch (error) {
    console.error("Error fetching repair details:", error);
    res.status(500).json({ error: "Failed to fetch repair details" });
  }
});

// add spare part to repair process table
app.post("/addSpare_RepairProcess", async (req, res) => {
  const { rep_id, sp_id, sp_quantity } = req.body;

  if (!rep_id || !sp_id || !sp_quantity) {
    return res.status(400).json({
      success: false,
      message: "Repair ID, Spare Part ID, and quantity are required.",
    });
  }

  try {
    const existing = await db.query(
      "SELECT SP_QUANTITY FROM REPAIR_PROCESS WHERE REP_ID = $1 AND SP_ID = $2",
      [rep_id, sp_id]
    );
    console.log(existing.rows.length);
    // Insert into REPAIR_PROCESS table
    await db.query(
      "INSERT INTO REPAIR_PROCESS (REP_ID, SP_ID, SP_QUANTITY) VALUES ($1, $2, $3)",
      [rep_id, sp_id, sp_quantity]
    );
    console.log("add spare part in repair is success");

    res.json({
      success: true,
      message: "Repair process updated successfully.",
    });
  } catch (error) {
    console.error("Error adding repair process:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error adding repair process." });
  }
});

//get the spare parts that doesn't exist before in the repair process
app.get("/availableSpareParts", async (req, res) => {
  try {
    const query = `
      SELECT P_ID, P_NAME, P_CATEGORY, P_QUANTITY, MODEL_CODE
      FROM STOCK
      WHERE P_CATEGORY = 'Spare Part' 
      AND P_ID NOT IN (SELECT SP_ID FROM REPAIR_PROCESS WHERE REP_ID = $1)
    `;

    const { rep_id } = req.query;

    const result = await db.query(query, [rep_id]);

    res.json(result.rows);
    console.log("available spare parts true");
  } catch (error) {
    console.error("Error fetching available spare parts:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching spare parts." });
  }
});

// update spare part quantity in the stock after add it in the repair process
app.post("/updateSpareinStock", async (req, res) => {
  const { sp_id, quantity } = req.body;

  if (!sp_id || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Spare part ID and quantity are required.",
    });
  }

  try {
    await db.query("BEGIN");

    const result = await db.query(
      "SELECT P_QUANTITY FROM STOCK WHERE P_ID = $1",
      [sp_id]
    );
    if (result.rows.length === 0 || result.rows[0].p_quantity < quantity) {
      throw new Error("Not enough stock for this spare part.");
    }

    // Update the stock quantity
    await db.query(
      "UPDATE STOCK SET P_QUANTITY = P_QUANTITY - $1 WHERE P_ID = $2",
      [quantity, sp_id]
    );

    await db.query("COMMIT");
    console.log("update spare in stock true");
    res.json({ success: true, message: "Stock updated successfully." });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating stock:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

//check the quantity in the stock
app.get("/checkSparePartStock/:sp_id", async (req, res) => {
  const { sp_id } = req.params;
  try {
    const result = await db.query(
      "SELECT P_QUANTITY FROM STOCK WHERE P_ID = $1",
      [sp_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Spare part not found." });
    }

    const availableStock = result.rows[0].p_quantity;
    res.json({ success: true, stock: availableStock });
    console.log("check spare part in the stock is true");
  } catch (error) {
    console.error("Error checking spare part stock:", error.message);
    res.status(500).json({ success: false, message: "Error checking stock." });
  }
});

// Get All Products
app.get("/AllProducts", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM STOCK WHERE P_CATEGORY <> 'Device Under Maintenance'"
  );
  const rows = result.rows;
  res.json(rows);
});
// Delete Product
app.post("/DeleteProduct", async (req, res) => {
  const id = req.body.id;
  await db.query("DELETE FROM STOCK WHERE P_ID = $1", [id]);
  res.json({ success: true });
});
//Add Product
app.post("/AddProduct", async (req, res) => {
  try {
    const PNAME = req.body.productname;
    const CATEGORY =
      req.body.category === "Other"
        ? req.body.customCategory
        : req.body.category;
    const COSTPRICE = req.body.costprice;
    const SELLPRICE = req.body.sellprice;
    const QUANTITY = req.body.quantity;
    const MODEL_CODE = req.body.modelcode;
    const DESCRIPTION = req.body.pdescription;
    const EXPIRE_DATE =
      req.body.category === "Chemical" ? req.body.expiredate : null;
    console.log(EXPIRE_DATE);

    const result = await db.query(
      "INSERT INTO STOCK (P_NAME, P_COSTPRICE, P_SELLPRICE, P_QUANTITY, P_PHOTO, P_DESCRIPTION, P_CATEGORY, EXPIRE_DATE, MODEL_CODE) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING P_ID",
      [
        PNAME,
        COSTPRICE,
        SELLPRICE,
        QUANTITY,
        null,
        DESCRIPTION,
        CATEGORY,
        EXPIRE_DATE,
        MODEL_CODE,
      ]
    );
    const newProductId = result.rows[0].p_id;

    res.json({
      success: true,
      message: "Product added successfully!",
      p_id: newProductId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add Product!" });
  }
});

app.post("/updatesproductphoto", upload.single("photo"), async (req, res) => {
  const P_PHOTO = req.file ? req.file.filename : null;
  try {
    await db.query("UPDATE Stock SET P_PHOTO = $1 WHERE P_ID = $2", [
      P_PHOTO,
      req.body.P_ID,
    ]);
    res.send("Product photo updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating Product photo");
  }
});

app.get("/allPriceQuotation", async (req, res) => {
  try {
    // Fetch price quotations along with customer details
    const result = await db.query(`
      SELECT 
      pq.PQ_ID, 
      pq.PQ_DISCOUNT, 
      pq.PQ_CURRENCY, 
      pq.PQ_DURATION, 
      pq.PQ_TOTAL,
      c.C_NAME , 
      c.C_PHOTO 
FROM 
    PRICE_QUOTATION pq
JOIN 
    OFFER o 
ON 
    pq.PQ_ID = o.PQ_ID
LEFT JOIN 
    CUSTOMER c 
ON 
    o.C_ID = c.C_ID;
    `);

    const rows = result.rows;
    res.json(rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Failed to fetch price quotations" });
  }
});

app.post("/deletepq", async (req, res) => {
  const id = req.body.id;
  await db.query("DELETE FROM PRICE_QUOTATION WHERE pq_id = $1", [id]);
  await db.query("DELETE FROM OFFER WHERE pq_id = $1", [id]);
  res.json({ success: true });
});

app.post("/addpq", async (req, res) => {
  try {
    const {
      customer,
      products, // Array of product objects: [{ p_id, quantity }]
      discount,
      currency,
      duration,
      total,
    } = req.body;
    // Insert the pq into the SALES table
    const pqresult = await db.query(
      `INSERT INTO PRICE_QUOTATION (PQ_DISCOUNT,PQ_CURRENCY,PQ_DURATION,PQ_TOTAL) values ($1,$2,$3,$4) RETURNING PQ_ID`,
      [
        req.body.pq_discount,
        req.body.pq_currency,
        req.body.pq_duration,
        req.body.total,
      ]
    );

    const pqid = pqresult.rows[0].pq_id;

    // Insert products into the SELL_ITEMS table
    const productValues = products
      .map((product) => `(${product.p_id}, ${pqid}, ${customer.c_id})`)
      .join(", ");

    await db.query(
      `INSERT INTO offer (P_ID, PQ_ID,  C_ID) 
         VALUES ${productValues}`
    );
    res.json({
      success: true,
      message: "Prica quotation and products added successfully!",
    });
  } catch (error) {
    console.error("Error adding price quotation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add price quotation",
      error: error.message,
    });
  }
});

// Edit Product
app.post("/updateProduct",async (req, res) => {
  const {
    P_ID,
    p_name,
    p_quantity,
    p_costprice,
    p_sellprice,
    model_code,
    p_discription,
    expire_date,
  } = req.body;
  try {
    await db.query(
      "UPDATE STOCK SET P_NAME = $1, P_COSTPRICE = $2, P_SELLPRICE = $3, P_QUANTITY = $4, P_DESCRIPTION = $5, MODEL_CODE = $6, EXPIRE_DATE = $7 WHERE P_ID = $8",
      [
        p_name,
        p_costprice,
        p_sellprice,
        p_quantity,
        p_discription,
        model_code,
        expire_date,
        P_ID,
      ]
    );

    res.send("Product updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product");
  }
});

//add repair product
// app.post("/AddRepairProduct", async (req, res) => {
//   try {
//     const PNAME = req.body.productname;
//     const CATEGORY = req.body.category;
//     const SERIAL_NUMBER = req.body.serialnumber;
//     const PSTATUS = req.body.pstatus;
//     await db.query(
//       "INSERT INTO STOCK (P_NAME, P_CATEGORY, P_STATUS, SERIAL_NUMBER) VALUES ($1, $2, $3, $4)",
//       [
//         PNAME,
//         CATEGORY,
//         PSTATUS,
//         SERIAL_NUMBER,
//       ]
//     );

//     res.json({ success: true, message: "Repair Product added successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to add Repare Product!" });
//   }
// });

// edit repair product

// get allDebts
app.get("/allDebts", async (req, res) => {
  const result = await db.query(`
    SELECT 
    C.C_NAME ,
    C.C_PHOTO ,
    D.SL_ID ,
    D.D_ID ,
    D.D_DATE ,
    D.D_TYPE ,
    D.D_AMOUNT ,
    D.D_CURRENCY
    FROM 
        DEBTS D
    LEFT JOIN 
        SALES S ON D.SL_ID = S.SL_ID
    LEFT JOIN 
        CUSTOMER C ON S.C_ID = C.C_ID;
`);
  const rows = result.rows;
  res.json(rows);
});

// Add Debt
app.post("/addDebt", async (req, res) => {
  try {
    const { debtDate, debtType, debtAmount, currency, sl_id } = req.body;
    const result = await db.query(
      `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT,D_CURRENCY,SL_ID) VALUES ($1, $2, $3, $4, $5)`,
      [debtDate, debtType, debtAmount, currency, sl_id]
    );
    res.json({ success: true, message: "Debt added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add Debt!" });
  }
});
//update Debt
app.post("/updateDebt", async (req, res) => {
  try {
    const SL_ID = req.body.SL_ID;
    const D_ID = req.body.D_ID;
    const D_TYPE = req.body.D_TYPE;
    const D_AMOUNT = req.body.d_amount;
    const D_DATE = req.body.d_date;
    const saleResult = await db.query(
      `SELECT SL_TOTAL 
       FROM SALES 
       WHERE SL_ID = $1`,
      [SL_ID]
    );

    const { sl_total } = saleResult.rows[0];

    // Update the SALES table based on D_TYPE
    if (D_TYPE === "INSURANCE") {
      await db.query(
        `UPDATE SALES 
         SET SL_INAMOUNT = $1 
         WHERE SL_ID = $2`,
        [-D_AMOUNT, SL_ID]
      );
      // Update the DEBTS table
      await db.query(
        `UPDATE DEBTS 
       SET D_AMOUNT = $1, D_DATE = $2 
       WHERE D_ID = $3 and D_TYPE = 'INSURANCE'`,
        [D_AMOUNT, D_DATE, D_ID]
      );
    } else {
      if (D_AMOUNT < 0) {
        await db.query(
          `UPDATE DEBTS 
         SET D_AMOUNT = $1, D_DATE = $2, D_TYPE = 'DEBT_IN' 
         WHERE D_ID = $3 and D_TYPE = 'DEBT_IN' or D_TYPE = 'DEBT_OUT'`,
          [D_AMOUNT, D_DATE, D_ID]
        );
      } else if (D_AMOUNT > 0) {
        await db.query(
          `UPDATE DEBTS 
         SET D_AMOUNT = $1, D_DATE = $2, D_TYPE = 'DEBT_OUT' 
         WHERE D_ID = $3 and D_TYPE = 'DEBT_IN' or D_TYPE = 'DEBT_OUT'`,
          [D_AMOUNT, D_DATE, D_ID]
        );
      }

      await db.query(
        `UPDATE SALES 
         SET SL_PAYED = $1 
         WHERE SL_ID = $2`,
        [sl_total + D_AMOUNT, SL_ID]
      );
    }

    // Commit transaction

    res.json({
      success: true,
      message: "Debt and sale updated successfully!",
    });
  } catch (error) {
    console.error("Error updating debt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update debt",
      error: error.message,
    });
  }
});
//changepassword
app.post("/changepassword", async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res
      .status(400)
      .json({ message: "Username and new password are required." });
  }

  try {
    // Check if the user exists
    const userResult = await db.query(
      "SELECT E_ID, F_NAME, L_NAME, E_ROLE FROM EMPLOYEE WHERE E_USERNAME = $1",
      [username]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "Username does not exist." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (userResult.rows[0].e_role === "Manager") {
      // Update the password and deactivate the user
      await db.query(
        "UPDATE EMPLOYEE SET E_PASSWORD = $1 WHERE E_USERNAME = $2",
        [hashedPassword, username]
      );
    } else {
      // Update the password and deactivate the user
      await db.query(
        "UPDATE EMPLOYEE SET E_PASSWORD = $1, E_ACTIVE = FALSE WHERE E_USERNAME = $2",
        [hashedPassword, username]
      );
    }

    // Return the user details along with success message
    return res.status(200).json({
      message:
        "Password updated successfully. Wait for reactivation from the manager.",
      E_ID: userResult.rows[0].e_id,
      F_NAME: userResult.rows[0].f_name,
      L_NAME: userResult.rows[0].l_name,
      E_ROLE: userResult.rows[0].e_role,
    });
  } catch (err) {
    console.error("Error updating password:", err);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

// Passport Strategy
passport.use(
  new Strategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const result = await db.query(
          "SELECT * FROM EMPLOYEE WHERE E_USERNAME = $1",
          [username]
        );
        const rows = result.rows;
        if (rows.length === 0) {
          return done(null, false, { message: "User not found" });
        }

        const user = rows[0];

        SignedUser.id = user.e_id;
        SignedUser.fName = user.f_name;
        SignedUser.lName = user.l_name;
        SignedUser.BirthDate = user.birth_date;
        SignedUser.salary = user.salary;
        SignedUser.Photo = user.e_photo;
        SignedUser.Role = user.e_role;
        SignedUser.Address = user.e_address;
        SignedUser.email = user.e_email;
        SignedUser.phone = user.e_phone;
        SignedUser.city = user.e_city;
        SignedUser.country = user.e_country;
        SignedUser.zipcode = user.e_zipcode;
        SignedUser.username = user.e_username;
        SignedUser.password = user.e_password;
        SignedUser.Gender = user.e_gender;

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

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.e_id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM EMPLOYEE WHERE E_ID = $1", [
      id,
    ]);
    const rows = result.rows;
    if (rows.length > 0) {
      done(null, rows[0]);
    } else {
      done(new Error("User not found"));
    }
  } catch (err) {
    done(err);
  }
});

// Routes

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    if (!user) {
      console.log("Authentication failed:", info);
      return res.json({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
      }
      res.json({
        success: true,
        message: "Login successful",
        user: { id: user.E_ID, username: user.E_USERNAME },
      });
    });
  })(req, res, next);
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Could not log out" });
      }
      res.clearCookie("connect.sid", { path: "/" });
      res.json({ success: true, message: "Logout successful" });
    });
  });
});

app.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.json({ success: false, message: "Not authenticated" });
  }
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
