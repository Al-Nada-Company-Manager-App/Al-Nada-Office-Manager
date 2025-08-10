// controllers/Dashboard.js
import prisma from "../config/db.js";

class Dashboard {
  static async getTotalStock(req, res) {
    try {
      const result = await prisma.stock.aggregate({
        _sum: { p_quantity: true },
      });
      res.json(result._sum.p_quantity);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalPurchase(req, res) {
    try {
      const result = await prisma.purchase.aggregate({
        _sum: { pch_total: true },
      });
      res.json(result._sum.pch_total);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalSales(req, res) {
    try {
      const result = await prisma.sales.aggregate({
        _sum: { sl_total: true },
      });
      res.json(result._sum.sl_total);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalDebts(req, res) {
    try {
      const result = await prisma.debts.aggregate({
        _sum: { d_amount: true },
      });
      res.json(result._sum.d_amount);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalRepairs(req, res) {
    try {
      const result = await prisma.repair.count();
      res.json({ totalRepairs: result });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalDUM(req, res) {
    try {
      const result = await prisma.stock.count({
        where: { p_category: "Device Under Maintenance" },
      });
      res.json({ totalDUM: result });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalSpareParts(req, res) {
    try {
      const result = await prisma.repair_process.aggregate({
        _sum: { sp_quantity: true },
      });
      res.json({ totalSpare: result._sum.sp_quantity });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getTotalPending(req, res) {
    try {
      const result = await prisma.stock.count({
        where: { p_status: "Pending" },
      });
      res.json({ totalpending: result });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getCustomersCount(req, res) {
    try {
      const result = await prisma.customer.count();
      res.json({ count: result });
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getSuppliersCount(req, res) {
    try {
      const result = await prisma.supplier.count();
      res.json({ count: result });
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getTopCustomers(req, res) {
    try {
      const result = await prisma.customer.findMany({
        include: {
          sales: {
            select: { sl_total: true },
          },
        },
        take: 10,
      });

      const formattedResult = result
        .map((customer) => ({
          c_name: customer.c_name,
          total_paid: customer.sales.reduce(
            (sum, sale) => sum + (sale.sl_total || 0),
            0
          ),
        }))
        .sort((a, b) => b.total_paid - a.total_paid);

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getProductsCount(req, res) {
    try {
      const result = await prisma.stock.count();
      res.json({ count: result });
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getTopRepairedProducts(req, res) {
    try {
      const result = await prisma.stock.findMany({
        include: {
          repair: true,
        },
        take: 10,
      });

      const formattedResult = result
        .filter((product) => product.repair.length > 0)
        .map((product) => ({
          p_name: product.p_name,
          repair_count: product.repair.length,
        }))
        .sort((a, b) => b.repair_count - a.repair_count);

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getRepairStatus(req, res) {
    try {
      const result = await prisma.stock.groupBy({
        by: ["p_status"],
        where: { p_category: "Device Under Maintenance" },
        _count: true,
      });

      const formattedResult = result.map((item) => ({
        p_status: item.p_status,
        status_count: item._count,
      }));

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getTopSoldProducts(req, res) {
    try {
      const result = await prisma.stock.findMany({
        include: {
          sell_items: true,
        },
        take: 10,
      });

      const formattedResult = result
        .filter((product) => product.sell_items.length > 0)
        .map((product) => ({
          p_name: product.p_name,
          sales_count: product.sell_items.length,
        }))
        .sort((a, b) => b.sales_count - a.sales_count);

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getCustomerSales(req, res) {
    try {
      const result = await prisma.customer.findMany({
        include: {
          sales: true,
        },
      });

      const formattedResult = result
        .map((customer) => ({
          c_name: customer.c_name,
          salescount: customer.sales.length,
        }))
        .sort((a, b) => b.salescount - a.salescount);

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getCustomerMarkets(req, res) {
    try {
      const result = await prisma.customer.findMany({
        include: {
          marketing: true,
        },
      });

      const formattedResult = result
        .map((customer) => ({
          c_name: customer.c_name,
          marketing_count: customer.marketing.length,
        }))
        .sort((a, b) => b.marketing_count - a.marketing_count);

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getCustomersProducts(req, res) {
    try {
      const result = await prisma.customer.findMany({
        include: {
          sales: {
            include: {
              sell_items: true,
            },
          },
        },
      });

      const formattedResult = result.map((customer) => ({
        CustomerID: customer.c_id,
        CustomerName: customer.c_name,
        ProductCount: customer.sales.reduce(
          (count, sale) => count + sale.sell_items.length,
          0
        ),
      }));

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getDebtsOverview(req, res) {
    try {
      const result = await prisma.debts.groupBy({
        by: ["d_type"],
        _sum: { d_amount: true },
        orderBy: { d_type: "asc" },
      });

      const formattedResult = result.map((item) => ({
        d_type: item.d_type,
        total_debt: item._sum.d_amount,
      }));

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getPurchasesOverview(req, res) {
    try {
      const result = await prisma.$queryRaw`
        SELECT TO_CHAR(pch_date, 'YYYY-MM-DD') AS month, SUM(pch_total) AS total_purchases
        FROM purchase
        GROUP BY TO_CHAR(pch_date, 'YYYY-MM-DD')
        ORDER BY month
      `;
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getRepairsOverTime(req, res) {
    try {
      const result = await prisma.$queryRaw`
        SELECT TO_CHAR(rep_date, 'YYYY-MM-DD') as rep_date, COUNT(*) AS repairs_count
        FROM repair
        WHERE rep_date IS NOT NULL
        GROUP BY rep_date
        ORDER BY rep_date
      `;
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getSalesOverview(req, res) {
    try {
      const result = await prisma.$queryRaw`
        SELECT TO_CHAR(sl_date, 'YYYY-MM-DD') AS month, SUM(sl_total) AS total_sales
        FROM sales
        GROUP BY TO_CHAR(sl_date, 'YYYY-MM-DD')
        ORDER BY month
      `;
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getSparePartsUsed(req, res) {
    try {
      const result = await prisma.repair_process.findMany({
        include: {
          stock: {
            where: { p_category: "Spare Part" },
            select: { p_name: true },
          },
        },
      });

      const groupedResult = result.reduce((acc, item) => {
        if (item.stock) {
          const name = item.stock.p_name;
          acc[name] = (acc[name] || 0) + (item.sp_quantity || 0);
        }
        return acc;
      }, {});

      const formattedResult = Object.entries(groupedResult)
        .map(([spare_part_name, total_used]) => ({
          spare_part_name,
          total_used,
        }))
        .sort((a, b) => b.total_used - a.total_used);

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getLowStockAlert(req, res) {
    try {
      const result = await prisma.stock.findMany({
        where: {
          p_category: "Spare Part",
          p_quantity: { lt: 10 },
        },
        select: {
          p_name: true,
          p_quantity: true,
        },
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getStockSummary(req, res) {
    try {
      const result = await prisma.stock.groupBy({
        by: ["p_category"],
        _count: true,
        _sum: { p_quantity: true },
      });

      const formattedResult = result.map((item) => ({
        p_category: item.p_category,
        total_products: item._count,
        total_quantity: item._sum.p_quantity,
      }));

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getSuppliersProducts(req, res) {
    try {
      const result = await prisma.supplier.findMany({
        include: {
          purchase: {
            include: {
              purchase_items: true,
            },
          },
        },
      });

      const formattedResult = result.map((supplier) => ({
        SupplierID: supplier.s_id,
        SupplierName: supplier.s_name,
        ProductCount: supplier.purchase.reduce(
          (count, purchase) => count + purchase.purchase_items.length,
          0
        ),
      }));

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }

  static async getTopProducts(req, res) {
    try {
      const result = await prisma.sell_items.groupBy({
        by: ["p_id"],
        _sum: { si_quantity: true },
        orderBy: { _sum: { si_quantity: "desc" } },
        take: 5,
      });

      const productIds = result.map((item) => item.p_id);
      const products = await prisma.stock.findMany({
        where: { p_id: { in: productIds } },
        select: { p_id: true, p_name: true },
      });

      const formattedResult = result.map((item) => {
        const product = products.find((p) => p.p_id === item.p_id);
        return {
          p_name: product?.p_name || "Unknown",
          total_sale: item._sum.si_quantity,
        };
      });

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: "Database query failed" });
    }
  }
}

export default Dashboard;
