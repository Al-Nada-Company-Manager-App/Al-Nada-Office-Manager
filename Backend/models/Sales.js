import db from "../config/db.js";

class Sales {
  // Get all sales with customer info
  static async getAllSales() {
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
    return result.rows;
  }

  // Create a new sale with all related data
  static async createSale(SALE_DATA) {
    console.log(SALE_DATA);
    try {
      await db.query("BEGIN");

      // Destructure sale data
      const {
        SL_TYPE,
        CUSTOMER,
        SL_BILLNUM,
        SL_COST,
        SL_DISCOUNT,
        SL_TAX,
        SL_PAYED,
        SL_INAMOUNT,
        SL_STATUS,
        SL_CURRENCY,
        SL_DATE,
        PRODUCTS,
        SL_TOTAL,
        DUE_DATE,
        IN_DUE_DATE,
        ADDDUM,
      } = SALE_DATA;

      const formattedDate = new Date(SL_DATE);
      const SL_DATE_FORMATTED = `${formattedDate.getFullYear()}-${
        formattedDate.getMonth() + 1
      }-${formattedDate.getDate()}`;

      // Insert into SALES
      const saleResult = await db.query(
        `INSERT INTO SALES 
        (C_ID, SL_DATE, SL_TOTAL, SL_DISCOUNT, SL_TAX, SL_STATUS, SL_TYPE, SL_INAMOUNT, SL_COST, SL_BILLNUM, SL_PAYED, SL_CURRENCY) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING SL_ID`,
        [
          CUSTOMER.C_ID,
          SL_DATE_FORMATTED,
          SL_TOTAL,
          SL_DISCOUNT,
          SL_TAX,
          SL_STATUS,
          SL_TYPE,
          SL_INAMOUNT,
          SL_COST,
          SL_BILLNUM,
          SL_PAYED,
          SL_CURRENCY,
        ]
      );

      const SL_ID = saleResult.rows[0].sl_id;

      if (SL_TYPE === "REPAIR" && ADDDUM) {
        const DUMS = Object.values(ADDDUM);
        for (const DUM of DUMS) {
          await db.query(`INSERT INTO ADDDUM VALUES ($1, $2)`, [
            DUM,
            SL_ID,
          ]);
        }
      }

      if (PRODUCTS && PRODUCTS.length > 0) {
        const productValues = PRODUCTS.map(
          (P) => `(${P.P_ID}, ${SL_ID}, ${P.SI_QUANTITY}, ${P.SI_TOTAL})`
        ).join(", ");

        await db.query(
          `INSERT INTO SELL_ITEMS (P_ID, SL_ID, SI_QUANTITY, SI_TOTAL) 
         VALUES ${productValues}`
        );

        for (const P of PRODUCTS) {
          await db.query(
            `UPDATE STOCK 
           SET P_QUANTITY = P_QUANTITY - $1 
           WHERE P_ID = $2 AND P_QUANTITY >= $1`,
            [P.SI_QUANTITY, P.P_ID]
          );
        }
      }

      if (SL_PAYED < SL_TOTAL) {
        const DEBT_IN = -1 * (SL_TOTAL - SL_PAYED);
        await db.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
         VALUES ($1, $2, $3, $4, $5)`,
          [DUE_DATE, "DEBT_IN", DEBT_IN, SL_CURRENCY, SL_ID]
        );
      } else if (SL_PAYED > SL_TOTAL) {
        const DEBT_OUT = SL_PAYED - SL_TOTAL;
        await db.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
         VALUES ($1, $2, $3, $4, $5)`,
          [DUE_DATE, "DEBT_OUT", DEBT_OUT, SL_CURRENCY, SL_ID]
        );
      }

      if (SL_INAMOUNT > 0) {
        const INSURANCE_DEBT = -1 * SL_INAMOUNT;
        await db.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
         VALUES ($1, $2, $3, $4, $5)`,
          [IN_DUE_DATE, "INSURANCE", INSURANCE_DEBT, SL_CURRENCY, SL_ID]
        );
      }

      await db.query("COMMIT");
      return SL_ID;
    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Transaction failed:", error);
      throw error;
    }
  }

  // Get products in sale by type
  static async getProductsInSale(saleId, saleType) {
    let query = "";
    if (saleType === "SELLITEMS") {
      query = `
        SELECT 
          SI.P_ID, 
          SI.SI_QUANTITY, 
          SI.SI_TOTAL, 
          ST.P_NAME, 
          ST.P_COSTPRICE 
        FROM 
          SELL_ITEMS SI
        JOIN 
          STOCK ST 
        ON 
          SI.P_ID = ST.P_ID
        WHERE 
          SI.SL_ID = $1
      `;
    } else if (saleType === "REPAIR") {
      query = `
        SELECT 
          AD.P_ID, 
          ST.P_NAME, 
          ST.SERIAL_NUMBER 
        FROM 
          ADDDUM AD
        JOIN 
          STOCK ST 
        ON 
          AD.P_ID = ST.P_ID
        WHERE 
          AD.SL_ID = $1
      `;
    } else {
      throw new Error("Invalid Sale Type");
    }

    const result = await db.query(query, [saleId]);
    return result.rows;
  }

  // Update sale and debts
  static async updateSale(saleId, updateData) {
    try {
      const { SL_ID, SL_PAYED, SL_INAMOUNT, SL_STATUS } = updateData;

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

      const { SL_TOTAL, SL_CURRENCY } = saleResult.rows[0];

      // Update the SALES table
      await db.query(
        `UPDATE SALES 
         SET SL_PAYED = $1, SL_INAMOUNT = $2, SL_STATUS = $3 
         WHERE SL_ID = $4`,
        [SL_PAYED, SL_INAMOUNT, SL_STATUS, SL_ID]
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
      const remainingAmount = SL_TOTAL - SL_PAYED;

      // Insert new debts with preserved D_DATE or current date
      if (remainingAmount > 0) {
        const debtDate =
          existingDebts.rows.find((debt) => debt.D_TYPE === "DEBT_IN")
            ?.D_DATE || new Date();
        await db.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, 'DEBT_IN', $2, $3, $4)`,
          [debtDate, -remainingAmount, SL_CURRENCY, SL_ID]
        );
      } else if (remainingAmount < 0) {
        // If there is overpayment
        const debtDate =
          existingDebts.rows.find((debt) => debt.D_TYPE === "DEBT_OUT")
            ?.D_DATE || new Date();
        await db.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, 'DEBT_OUT', $2, $3, $4)`,
          [debtDate, Math.abs(remainingAmount), SL_CURRENCY, SL_ID]
        );
      }

      if (SL_INAMOUNT > 0) {
        // Handle insurance debts
        const insuranceDebtDate =
          existingDebts.rows.find((debt) => debt.D_TYPE === "INSURANCE")
            ?.D_DATE || new Date();
        await db.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, 'INSURANCE', $2, $3, $4)`,
          [insuranceDebtDate, -SL_INAMOUNT, SL_CURRENCY, SL_ID]
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // Delete sale
  static async deleteSale(saleId) {
    await db.query(`DELETE FROM SALES WHERE SL_ID = $1`, [saleId]);
  }
}

export default Sales;
