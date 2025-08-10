import prisma from "../config/db.js";

class Debt {
  // Get all debts with customer information
  static async getAllDebts() {
    return await prisma.debts.findMany({
      include: {
        sales: {
          include: {
            customer: {
              select: {
                c_name: true,
                c_photo: true,
              },
            },
          },
        },
      },
    });
  }

  // Add a new debt
  static async addDebt(debtData) {
    const { debtDate, debtType, debtAmount, currency, sl_id } = debtData;
    return await prisma.debts.create({
      data: {
        d_date: new Date(debtDate),
        d_type: debtType,
        d_amount: debtAmount,
        d_currency: currency,
        sl_id: sl_id,
      },
    });
  }

  // Update debt and related sales data
  static async updateDebt(debtId, debtData) {
    const { SL_ID, D_TYPE, D_AMOUNT, D_DATE } = debtData;

    await prisma.$transaction(async (tx) => {
      // Get sale total
      const sale = await tx.sales.findUnique({
        where: { sl_id: parseInt(SL_ID) },
        select: { sl_total: true },
      });

      if (!sale) {
        throw new Error("Sale not found");
      }

      const { sl_total } = sale;

      if (D_TYPE === "INSURANCE") {
        // Update sales insurance amount
        await tx.sales.update({
          where: { sl_id: parseInt(SL_ID) },
          data: { sl_inamount: -D_AMOUNT },
        });

        // Update debt
        await tx.debts.updateMany({
          where: {
            d_id: parseInt(debtId),
            d_type: "INSURANCE",
          },
          data: {
            d_amount: D_AMOUNT,
            d_date: new Date(D_DATE),
          },
        });
      } else {
        // Update debt type based on amount
        const newType = D_AMOUNT < 0 ? "DEBT_IN" : "DEBT_OUT";

        await tx.debts.update({
          where: { d_id: parseInt(debtId) },
          data: {
            d_amount: D_AMOUNT,
            d_date: new Date(D_DATE),
            d_type: newType,
          },
        });

        // Update sales paid amount
        await tx.sales.update({
          where: { sl_id: parseInt(SL_ID) },
          data: { sl_payed: sl_total + D_AMOUNT },
        });
      }
    });

    return { success: true };
  }

  // Delete a debt
  static async deleteDebt(debtId) {
    return await prisma.debts.delete({
      where: { d_id: parseInt(debtId) },
    });
  }

  // Get debt by ID
  static async getDebtById(debtId) {
    return await prisma.debts.findUnique({
      where: { d_id: parseInt(debtId) },
    });
  }

  // Get debts by sale ID
  static async getDebtsBySlId(slId) {
    return await prisma.debts.findMany({
      where: { sl_id: parseInt(slId) },
    });
  }

  // Get total debts summary
  static async getTotalDebts() {
    const result = await prisma.debts.aggregate({
      _sum: {
        d_amount: true,
      },
    });
    return { total_amount: result._sum.d_amount };
  }

  // Get debts overview by type
  static async getDebtsOverview() {
    return await prisma.debts.groupBy({
      by: ["d_type"],
      _sum: {
        d_amount: true,
      },
      orderBy: {
        d_type: "asc",
      },
    });
  }
}

export default Debt;
