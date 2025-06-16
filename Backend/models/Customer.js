import db from "../config/db.js";

class Customer {
  // Get all customers
  static async getAll() {
    const result = await db.query("SELECT * FROM CUSTOMER");
    return result.rows;
  }

  // Delete customer
  static async delete(id) {
    await db.query("DELETE FROM CUSTOMER WHERE C_ID = $1", [id]);
  }

  // Create new customer
  static async create(customerData) {
    const result = await db.query(
      `INSERT INTO CUSTOMER 
       (C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, C_ZIPCODE, C_FAX, C_PHOTO) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING C_ID`,
      [
        customerData.C_NAME,
        customerData.C_ADDRESS,
        customerData.C_CITY,
        customerData.C_COUNTRY,
        customerData.C_ZIPCODE,
        customerData.C_FAX,
        customerData.C_PHOTO || null
      ]
    );
    return result.rows[0];
  }

  // Update customer
  static async update(id, updateData) {
    await db.query(
      `UPDATE CUSTOMER SET 
        C_NAME = $1, C_ADDRESS = $2, C_CITY = $3, 
        C_COUNTRY = $4, C_ZIPCODE = $5, C_FAX = $6 
       WHERE C_ID = $7`,
      [
        updateData.C_NAME,
        updateData.C_ADDRESS,
        updateData.C_CITY,
        updateData.C_COUNTRY,
        updateData.C_ZIPCODE,
        updateData.C_FAX,
        id,
      ]
    );
  }

  // Update customer photo
  static async updatePhoto(id, filename) {
    console.log("filename", filename);
    console.log("id", id);
    await db.query(
      "UPDATE CUSTOMER SET C_PHOTO = $1 WHERE C_ID = $2",
      [filename, id]
    );
  }

  // Get customer with sales
  static async getWithSales(id) {
    const customerResult = await db.query(
      `SELECT C_ID, C_NAME, C_ADDRESS, C_CITY, C_COUNTRY, 
              C_ZIPCODE, C_FAX, C_PHOTO 
       FROM CUSTOMER 
       WHERE C_ID = $1`,
      [id]
    );
    
    if (customerResult.rows.length === 0) return null;

    const salesResult = await db.query(
      `SELECT SL_ID, SL_DATE, SL_TOTAL, SL_DISCOUNT, SL_TAX, 
              SL_STATUS, SL_TYPE, SL_INAMOUNT, SL_COST, 
              SL_BILLNUM, SL_PAYED, SL_CURRENCY 
       FROM SALES 
       WHERE C_ID = $1 
       ORDER BY SL_DATE DESC`,
      [id]
    );
    return {
      salesHistory: salesResult.rows
    };
  }
}

export default Customer;