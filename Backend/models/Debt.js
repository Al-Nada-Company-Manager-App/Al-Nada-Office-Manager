import db from "../config/db.js";

class Debt {
  // Get all debts with customer information
  static async getAllDebts() {
    const result = await db.query(`
      SELECT 
        C.C_NAME,
        C.C_PHOTO,
        D.SL_ID,
        D.D_ID,
        D.D_DATE,
        D.D_TYPE,
        D.D_AMOUNT,
        D.D_CURRENCY
      FROM 
        DEBTS D
      LEFT JOIN 
        SALES S ON D.SL_ID = S.SL_ID
      LEFT JOIN 
        CUSTOMER C ON S.C_ID = C.C_ID;
    `);
    return result.rows;
  }

  // Add a new debt
  static async addDebt(debtData) {
    const { debtDate, debtType, debtAmount, currency, sl_id } = debtData;
    const result = await db.query(
      `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [debtDate, debtType, debtAmount, currency, sl_id]
    );
    return result.rows[0];
  }

  // Update debt and related sales data
  static async updateDebt(debtId, debtData) {
    const { SL_ID, D_TYPE, D_AMOUNT, D_DATE } = debtData;

    // Get sale total
    const saleResult = await db.query(
      `SELECT SL_TOTAL FROM SALES WHERE SL_ID = $1`,
      [SL_ID]
    );

    if (saleResult.rows.length === 0) {
      throw new Error("Sale not found");
    }

    const { sl_total } = saleResult.rows[0];

    if (D_TYPE === "INSURANCE") {
      // Update sales insurance amount
      await db.query(`UPDATE SALES SET SL_INAMOUNT = $1 WHERE SL_ID = $2`, [
        -D_AMOUNT,
        SL_ID,
      ]);

      // Update debt
      await db.query(
        `UPDATE DEBTS 
         SET D_AMOUNT = $1, D_DATE = $2 
         WHERE D_ID = $3 AND D_TYPE = 'INSURANCE'`,
        [D_AMOUNT, D_DATE, debtId]
      );
    } else {
      // Update debt type based on amount
      const newType = D_AMOUNT < 0 ? "DEBT_IN" : "DEBT_OUT";

      await db.query(
        `UPDATE DEBTS 
         SET D_AMOUNT = $1, D_DATE = $2, D_TYPE = $3 
         WHERE D_ID = $4`,
        [D_AMOUNT, D_DATE, newType, debtId]
      );

      // Update sales paid amount
      await db.query(`UPDATE SALES SET SL_PAYED = $1 WHERE SL_ID = $2`, [
        sl_total + D_AMOUNT,
        SL_ID,
      ]);
    }

    return { success: true };
  }

  // Delete a debt
  static async deleteDebt(debtId) {
    const result = await db.query(
      `DELETE FROM DEBTS WHERE D_ID = $1 RETURNING *`,
      [debtId]
    );
    return result.rows[0];
  }

  // Get debt by ID
  static async getDebtById(debtId) {
    const result = await db.query(`SELECT * FROM DEBTS WHERE D_ID = $1`, [
      debtId,
    ]);
    return result.rows[0];
  }

  // Get debts by sale ID
  static async getDebtsBySlId(slId) {
    const result = await db.query(`SELECT * FROM DEBTS WHERE SL_ID = $1`, [
      slId,
    ]);
    return result.rows;
  }

  // Get total debts summary
  static async getTotalDebts() {
    const result = await db.query(`
      SELECT SUM(D_AMOUNT) as total_amount
      FROM DEBTS
    `);
    return result.rows[0];
  }

  // Get debts overview by type
  static async getDebtsOverview() {
    const result = await db.query(`
      SELECT 
        D_TYPE, 
        SUM(D_AMOUNT) AS total_debt
      FROM DEBTS
      GROUP BY D_TYPE
      ORDER BY D_TYPE;
    `);
    return result.rows;
  }
}

export default Debt;