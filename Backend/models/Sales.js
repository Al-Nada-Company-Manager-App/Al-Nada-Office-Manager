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
  static async createSale(saleData) {
    const client = await db.connect();
    console.log(saleData);
    try {
      await client.query("BEGIN");

      // Destructure sale data
      const {
        saleType,
        customer,
        billNumber,
        cost,
        discount,
        tax,
        paidAmount,
        insuranceAmount,
        status,
        currency,
        saleDate,
        products,
        total,
        dueDate,
        insuranceDueDate,
        addedDum,
      } = saleData;

      // Format sale date
      const formatDate = new Date(saleDate);
      const formattedDate = `${formatDate.getFullYear()}-${
        formatDate.getMonth() + 1
      }-${formatDate.getDate()}`;

      // Insert sale into SALES table
      const saleResult = await client.query(
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

      // Handle REPAIR type sales (ADDDUM table)
      if (saleType === "REPAIR" && addedDum) {
        const Dums = Object.values(addedDum); // Convert object to array
        for (const Dum of Dums) {
          await client.query(`INSERT INTO ADDDUM VALUES ($1, $2)`, [
            Dum,
            saleId,
          ]);
        }
      }

      // Insert products into SELL_ITEMS table
      if (products && products.length > 0) {
        const productValues = products
          .map(
            (product) =>
              `(${product.p_id}, ${saleId}, ${product.quantity}, ${product.totalCost})`
          )
          .join(", ");

        await client.query(
          `INSERT INTO SELL_ITEMS (P_ID, SL_ID, SI_QUANTITY, SI_TOTAL) 
           VALUES ${productValues}`
        );

        // Update product quantities in STOCK table
        for (const product of products) {
          await client.query(
            `UPDATE STOCK 
             SET P_QUANTITY = P_QUANTITY - $1 
             WHERE P_ID = $2 AND P_QUANTITY >= $1`,
            [product.quantity, product.p_id]
          );
        }
      }

      // Handle debts based on paidAmount and insuranceAmount
      if (paidAmount < total) {
        const debtInAmount = -1 * (total - paidAmount);
        await client.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, $2, $3, $4, $5)`,
          [dueDate, "DEBT_IN", debtInAmount, currency, saleId]
        );
      } else if (paidAmount > total) {
        const debtOutAmount = paidAmount - total;
        await client.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, $2, $3, $4, $5)`,
          [dueDate, "DEBT_OUT", debtOutAmount, currency, saleId]
        );
      }

      if (insuranceAmount > 0) {
        const insuranceDebtAmount = -1 * insuranceAmount;
        await client.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, $2, $3, $4, $5)`,
          [insuranceDueDate, "INSURANCE", insuranceDebtAmount, currency, saleId]
        );
      }

      await client.query("COMMIT");
      return saleId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
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
      const { SL_ID, sl_payed, sl_inamount, sl_status } = updateData;

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
          existingDebts.rows.find((debt) => debt.D_TYPE === "DEBT_IN")
            ?.D_DATE || new Date();
        await db.query(
          `INSERT INTO DEBTS (D_DATE, D_TYPE, D_AMOUNT, D_CURRENCY, SL_ID) 
           VALUES ($1, 'DEBT_IN', $2, $3, $4)`,
          [debtDate, -remainingAmount, sl_currency, SL_ID]
        );
      } else if (remainingAmount < 0) {
        // If there is overpayment
        const debtDate =
          existingDebts.rows.find((debt) => debt.D_TYPE === "DEBT_OUT")
            ?.D_DATE || new Date();
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
