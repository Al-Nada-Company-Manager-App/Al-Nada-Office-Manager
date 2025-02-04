import db from "../config/db.js";

class Supplier {
  // Get all suppliers
  static async getAll() {
    const result = await db.query("SELECT * FROM SUPPLIER");
    return result.rows;
  }

  // Delete supplier
  static async delete(id) {
    await db.query("DELETE FROM SUPPLIER WHERE S_ID = $1", [id]);
  }

  // Create new supplier
  static async create(supplierData) {
    const result = await db.query(
      `INSERT INTO SUPPLIER 
      (S_NAME, S_ADDRESS, S_CITY, S_COUNTRY, S_ZIPCODE, S_FAX, S_PHOTO) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING S_ID`,
      [
        supplierData.S_NAME,
        supplierData.S_ADDRESS,
        supplierData.S_CITY,
        supplierData.S_COUNTRY,
        supplierData.S_ZIPCODE,
        supplierData.S_FAX,
        supplierData.S_PHOTO || null,
      ]
    );
    return result.rows[0];
  }

  // Update supplier
  static async update(id, updateData) {
    await db.query(
      `UPDATE SUPPLIER SET 
        S_NAME = $1, S_ADDRESS = $2, S_CITY = $3, 
        S_COUNTRY = $4, S_ZIPCODE = $5, S_FAX = $6 
       WHERE S_ID = $7`,
      [
        updateData.s_name,
        updateData.s_address,
        updateData.s_city,
        updateData.s_country,
        updateData.s_zipcode,
        updateData.s_fax,
        id,
      ]
    );
  }

  // Update supplier photo
  static async updatePhoto(id, filename) {
    console.log("filename", filename);
    console.log("id", id);
    await db.query("UPDATE SUPPLIER SET S_PHOTO = $1 WHERE S_ID = $2", [
      filename,
      id,
    ]);
  }

  // Get supplier with sales
  static async getWithPurchases(id) {
    const purchasesResult = await db.query(
      `SELECT * FROM PURCHASE WHERE S_ID = $1 ORDER BY PCH_DATE DESC`,
      [id]
    );
    return {
      purchasesHistory: purchasesResult.rows,
    };
  }
}

export default Supplier;
