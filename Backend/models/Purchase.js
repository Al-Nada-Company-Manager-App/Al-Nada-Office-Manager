import db from "../config/db.js";

class Purchase {
  // Get all purchases with supplier info
  static async getAllPurchases() {
    const result = await db.query(`
      SELECT 
        PURCHASE.*, 
        SUPPLIER.S_NAME,
        SUPPLIER.S_PHOTO
      FROM 
        PURCHASE
      JOIN 
        SUPPLIER ON PURCHASE.S_ID = SUPPLIER.S_ID`);
    return result.rows;
  }

  // Create a new purchase with all related data
  static async createPurchase(PURCHASE_DATA) {
    try {
      const {
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
      } = PURCHASE_DATA;

      const purchaseResult = await db.query(
        `INSERT INTO PURCHASE 
          (S_ID, PCH_DATE, PCH_TOTAL, PCH_TAX, PCH_COST, PCH_BILLNUM, PCH_CURRENCY, PCH_EXPENSE, PCH_CUSTOMSCOST, PCH_CUSTOMSNUM) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         RETURNING PCH_ID`,
        [
          supplier.s_id,
          purchasedate,
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
           WHERE P_ID = $3`,
          [product.quantity, product.costprice, product.p_id]
        );
      }

      return purchaseId;
    } catch (error) {
      console.error("Error creating Purchase:", error);
      throw error;
    }
  }

  // Get products in a specific purchase
  static async getProductsInPurchase(PCH_ID) {
    try {
      const result = await db.query(
        `SELECT 
          PURCHASE_ITEMS.P_ID,
          PURCHASE_ITEMS.PCH_ID,
          PURCHASE_ITEMS.PI_QUANTITY,
          PURCHASE_ITEMS.P_COSTPRICE,
          PURCHASE_ITEMS.P_CATEGORY,
          PURCHASE_ITEMS.PI_TOTAL,
          STOCK.P_NAME,
          STOCK.P_SELLPRICE,
          STOCK.P_QUANTITY,
          STOCK.P_PHOTO,
          STOCK.P_DESCRIPTION,
          STOCK.MODEL_CODE,
          STOCK.EXPIRE_DATE,
          STOCK.P_STATUS,
          STOCK.SERIAL_NUMBER
        FROM 
          PURCHASE_ITEMS
        JOIN 
          STOCK ON PURCHASE_ITEMS.P_ID = STOCK.P_ID
        WHERE 
          PURCHASE_ITEMS.PCH_ID = $1
      `,
        [PCH_ID]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching products in purchase:", error);
      throw error;
    }
  }

  // Update an existing purchase
  static async updatePurchase(PCH_ID, updateData) {
    try {
      const { cost, tax, customscost, expense, total, products } = updateData;

      await db.query(
        `UPDATE PURCHASE 
         SET PCH_TOTAL = $1, PCH_TAX = $2, PCH_COST = $3,
             PCH_EXPENSE = $4, PCH_CUSTOMSCOST = $5
         WHERE PCH_ID = $6`,
        [total, tax, cost, expense, customscost, PCH_ID]
      );

      const currentProducts = await db.query(
        `SELECT P_ID, PI_QUANTITY FROM PURCHASE_ITEMS WHERE PCH_ID = $1`,
        [PCH_ID]
      );

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
            `(${product.p_id}, ${PCH_ID}, ${product.quantity}, ${
              product.costprice
            }, ${product.quantity * product.costprice})`
        )
        .join(", ");

      await db.query(
        `INSERT INTO PURCHASE_ITEMS (P_ID, PCH_ID, PI_QUANTITY, P_COSTPRICE, PI_TOTAL) 
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
    } catch (error) {
      console.error("Error updating Purchase:", error);
      throw error;
    }
  }

  // Delete a purchase
  static async deletePurchase(PCH_ID) {
    await db.query("DELETE FROM PURCHASE WHERE PCH_ID = $1", [PCH_ID]);
  }
}

export default Purchase;
