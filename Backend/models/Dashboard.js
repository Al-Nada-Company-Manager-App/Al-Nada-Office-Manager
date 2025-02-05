// controllers/Dashboard.js
import db from "../config/db.js";

class Dashboard {
  static async getTotalStock(req, res) {
    try {
      const result = await db.query("SELECT SUM(P_QUANTITY) FROM STOCK");
      res.json(result.rows[0].sum);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalPurchase(req, res) {
    try {
      const result = await db.query("SELECT SUM(PCH_TOTAL) FROM PURCHASE");
      res.json(result.rows[0].sum);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalSales(req, res) {
    try {
      const result = await db.query("SELECT SUM(SL_TOTAL) FROM SALES");
      res.json(result.rows[0].sum);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalDebts(req, res) {
    try {
      const result = await db.query("SELECT SUM(D_AMOUNT) FROM DEBTS");
      res.json(result.rows[0].sum);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalRepairs(req, res) {
    try {
      const result = await db.query("SELECT COUNT(*) FROM REPAIR");
      res.json({ totalRepairs: result.rows[0].count });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalDUM(req, res) {
    try {
      const result = await db.query(
        "SELECT COUNT(*) FROM STOCK WHERE P_CATEGORY = 'Device Under Maintenance'"
      );
      res.json({ totalDUM: result.rows[0].count });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalSpareParts(req, res) {
    try {
      const result = await db.query(
        "SELECT SUM(SP_QUANTITY) FROM REPAIR_PROCESS"
      );
      res.json({ totalSpare: result.rows[0].sum });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalPending(req, res) {
    try {
      const result = await db.query(
        "SELECT COUNT(P_STATUS) FROM STOCK WHERE P_STATUS = 'Pending'"
      );
      res.json({ totalpending: result.rows[0].count });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getCustomersCount(req, res) {
    try {
      const result = await db.query("SELECT COUNT(C_ID) FROM CUSTOMER");
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getSuppliersCount(req, res) {
    try {
      const result = await db.query("SELECT COUNT(S_ID) FROM SUPPLIER");
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getTopCustomers(req, res) {
    try {
      const result = await db.query(`
        SELECT CUSTOMER.C_NAME AS c_name, SUM(SALES.SL_TOTAL) AS total_paid
        FROM CUSTOMER
        JOIN SALES ON CUSTOMER.C_ID = SALES.C_ID
        GROUP BY CUSTOMER.c_id
        ORDER BY total_paid DESC
        LIMIT 10
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getProductsCount(req, res) {
    try {
      const result = await db.query("SELECT COUNT(P_ID) FROM STOCK");
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getTopRepairedProducts(req, res) {
    try {
      const result = await db.query(`
        SELECT STOCK.P_NAME AS p_name, COUNT(REPAIR.P_ID) AS repair_count
        FROM STOCK
        JOIN REPAIR ON STOCK.P_ID = REPAIR.P_ID
        GROUP BY STOCK.P_ID
        ORDER BY repair_count DESC
        LIMIT 10
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getRepairStatus(req, res) {
    try {
      const result = await db.query(`
           SELECT P_STATUS, COUNT(*) AS status_count FROM STOCK WHERE P_CATEGORY = 'Device Under Maintenance' GROUP BY P_STATUS
        `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getTopSoldProducts(req, res) {
    try {
      const result = await db.query(`
        SELECT STOCK.P_NAME AS p_name, COUNT(SELL_ITEMS.P_ID) AS sales_count
        FROM STOCK
        JOIN SELL_ITEMS ON STOCK.P_ID = SELL_ITEMS.P_ID
        GROUP BY STOCK.P_ID
        ORDER BY sales_count DESC
        LIMIT 10
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getCustomerSales(req, res) {
    try {
      const result = await db.query(`
        SELECT CUSTOMER.C_NAME AS c_name, COUNT(SALES.SL_ID) AS salescount
        FROM CUSTOMER
        JOIN SALES ON CUSTOMER.C_ID = SALES.C_ID
        GROUP BY CUSTOMER.c_id
        ORDER BY salescount DESC
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getCustomerMarkets(req, res) {
    try {
      const result = await db.query(`
        SELECT CUSTOMER.C_NAME AS c_name, COUNT(MARKETING.E_ID) AS marketing_count
        FROM CUSTOMER
        JOIN MARKETING ON CUSTOMER.C_ID = MARKETING.C_ID
        GROUP BY CUSTOMER.c_id
        ORDER BY marketing_count DESC
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getCustomersProducts(req, res) {
    try {
      const result = await db.query(`
        SELECT C.C_ID AS CustomerID, C.C_NAME AS CustomerName, COUNT(SI.P_ID) AS ProductCount
        FROM CUSTOMER C
        LEFT JOIN SALES SL ON C.C_ID = SL.C_ID
        LEFT JOIN SELL_ITEMS SI ON SL.SL_ID = SI.SL_ID
        GROUP BY C.C_ID, C.C_NAME
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getDebtsOverview(req, res) {
    try {
      const result = await db.query(`
        SELECT D_TYPE, SUM(D_AMOUNT) AS total_debt
        FROM DEBTS
        GROUP BY D_TYPE
        ORDER BY D_TYPE
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getPurchasesOverview(req, res) {
    try {
      const result = await db.query(`
        SELECT TO_CHAR(PCH_DATE, 'YYYY-MM-DD') AS month, SUM(PCH_TOTAL) AS total_purchases
        FROM PURCHASE
        GROUP BY TO_CHAR(PCH_DATE, 'YYYY-MM-DD')
        ORDER BY month
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getRepairsOverTime(req, res) {
    try {
      const result = await db.query(`
        SELECT TO_CHAR(REP_DATE, 'YYYY-MM-DD') as REP_DATE, COUNT(*) AS repairs_count
        FROM REPAIR
        WHERE REP_DATE IS NOT NULL
        GROUP BY REP_DATE
        ORDER BY REP_DATE
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getSalesOverview(req, res) {
    try {
      const result = await db.query(`
        SELECT TO_CHAR(SL_DATE, 'YYYY-MM-DD') AS month, SUM(SL_TOTAL) AS total_sales
        FROM SALES
        GROUP BY TO_CHAR(SL_DATE, 'YYYY-MM-DD')
        ORDER BY month
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getSparePartsUsed(req, res) {
    try {
      const result = await db.query(`
        SELECT s.P_NAME AS spare_part_name, SUM(rp.SP_QUANTITY) AS total_used
        FROM REPAIR_PROCESS rp
        JOIN STOCK s ON rp.SP_ID = s.P_ID
        WHERE s.P_CATEGORY = 'Spare Part'
        GROUP BY s.P_NAME
        ORDER BY SUM(rp.SP_QUANTITY) DESC
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getLowStockAlert(req, res) {
    try {
      const result = await db.query(`
        SELECT P_NAME, P_QUANTITY
        FROM STOCK
        WHERE P_CATEGORY = 'Spare Part' AND P_QUANTITY < 10
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getStockSummary(req, res) {
    try {
      const result = await db.query(`
        SELECT P_CATEGORY, COUNT(*) AS TOTAL_PRODUCTS, SUM(P_QUANTITY) AS TOTAL_QUANTITY
        FROM STOCK
        GROUP BY P_CATEGORY
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getSuppliersProducts(req, res) {
    try {
      const result = await db.query(`
        SELECT S.S_ID AS SupplierID, S.S_NAME AS SupplierName, COUNT(PI.P_ID) AS ProductCount
        FROM SUPPLIER S
        LEFT JOIN PURCHASE P ON S.S_ID = P.S_ID
        LEFT JOIN PURCHASE_ITEMS PI ON P.PCH_ID = PI.PCH_ID
        GROUP BY S.S_ID, S.S_NAME
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getTopProducts(req, res) {
    try {
      const result = await db.query(`
        SELECT P.P_NAME, SUM(SI.SI_QUANTITY) AS total_sale
        FROM SELL_ITEMS SI
        JOIN STOCK P ON SI.P_ID = P.P_ID
        GROUP BY P.P_NAME
        ORDER BY total_sale DESC
        LIMIT 5
      `);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }
}

export default Dashboard;
