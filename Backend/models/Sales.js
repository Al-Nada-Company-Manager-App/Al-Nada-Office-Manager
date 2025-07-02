import prisma from "../config/db.js";

class Sales {
  // Get all sales with customer info
  static async getAllSales() {
    return await prisma.sales.findMany({
      include: {
        customer: {
          select: {
            c_name: true,
            c_photo: true,
          },
        },
      },
    });
  }

  // Create a new sale with all related data
  static async createSale(SALE_DATA) {
    console.log(SALE_DATA);
    try {
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

      // Use Prisma transaction
      const result = await prisma.$transaction(async (tx) => {
        // Insert into SALES
        const saleResult = await tx.sales.create({
          data: {
            c_id: CUSTOMER.C_ID,
            sl_date: formattedDate,
            sl_total: SL_TOTAL,
            sl_discount: SL_DISCOUNT,
            sl_tax: SL_TAX,
            sl_status: SL_STATUS,
            sl_type: SL_TYPE,
            sl_inamount: SL_INAMOUNT,
            sl_cost: SL_COST,
            sl_billnum: SL_BILLNUM,
            sl_payed: SL_PAYED,
            sl_currency: SL_CURRENCY,
          },
        });

        const SL_ID = saleResult.sl_id;

        if (SL_TYPE === "REPAIR" && ADDDUM) {
          const DUMS = Object.values(ADDDUM);
          for (const DUM of DUMS) {
            await tx.adddum.create({
              data: {
                p_id: DUM,
                sl_id: SL_ID,
              },
            });
          }
        }

        if (PRODUCTS && PRODUCTS.length > 0) {
          for (const P of PRODUCTS) {
            await tx.sell_items.create({
              data: {
                p_id: P.P_ID,
                sl_id: SL_ID,
                si_quantity: P.SI_QUANTITY,
                si_total: P.SI_TOTAL,
              },
            });

            // Update stock quantity
            await tx.stock.updateMany({
              where: {
                p_id: P.P_ID,
                p_quantity: {
                  gte: P.SI_QUANTITY,
                },
              },
              data: {
                p_quantity: {
                  decrement: P.SI_QUANTITY,
                },
              },
            });
          }
        }

        if (SL_PAYED < SL_TOTAL) {
          const DEBT_IN = -1 * (SL_TOTAL - SL_PAYED);
          await tx.debts.create({
            data: {
              d_date: new Date(DUE_DATE),
              d_type: "DEBT_IN",
              d_amount: DEBT_IN,
              d_currency: SL_CURRENCY,
              sl_id: SL_ID,
            },
          });
        } else if (SL_PAYED > SL_TOTAL) {
          const DEBT_OUT = SL_PAYED - SL_TOTAL;
          await tx.debts.create({
            data: {
              d_date: new Date(DUE_DATE),
              d_type: "DEBT_OUT",
              d_amount: DEBT_OUT,
              d_currency: SL_CURRENCY,
              sl_id: SL_ID,
            },
          });
        }

        if (SL_INAMOUNT > 0) {
          const INSURANCE_DEBT = -1 * SL_INAMOUNT;
          await tx.debts.create({
            data: {
              d_date: new Date(IN_DUE_DATE),
              d_type: "INSURANCE",
              d_amount: INSURANCE_DEBT,
              d_currency: SL_CURRENCY,
              sl_id: SL_ID,
            },
          });
        }

        return SL_ID;
      });

      return result;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }

  // Get products in sale by type
  static async getProductsInSale(saleId, saleType) {
    if (saleType === "SELLITEMS") {
      return await prisma.sell_items.findMany({
        where: { sl_id: parseInt(saleId) },
        include: {
          stock: {
            select: {
              p_name: true,
              p_costprice: true,
            },
          },
        },
      });
    } else if (saleType === "REPAIR") {
      return await prisma.adddum.findMany({
        where: { sl_id: parseInt(saleId) },
        include: {
          stock: {
            select: {
              p_name: true,
              serial_number: true,
            },
          },
        },
      });
    } else {
      throw new Error("Invalid Sale Type");
    }
  }

  // Update sale and debts
  static async updateSale(saleId, updateData) {
    try {
      const { SL_ID, SL_PAYED, SL_INAMOUNT, SL_STATUS } = updateData;

      await prisma.$transaction(async (tx) => {
        // Fetch the current sale details
        const sale = await tx.sales.findUnique({
          where: { sl_id: parseInt(SL_ID) },
          select: {
            sl_total: true,
            sl_currency: true,
          },
        });

        if (!sale) {
          throw new Error(`Sale with ID ${SL_ID} not found`);
        }

        const { sl_total: SL_TOTAL, sl_currency: SL_CURRENCY } = sale;

        // Update the SALES table
        await tx.sales.update({
          where: { sl_id: parseInt(SL_ID) },
          data: {
            sl_payed: SL_PAYED,
            sl_inamount: SL_INAMOUNT,
            sl_status: SL_STATUS,
          },
        });

        // Handle debts updates
        // Retrieve existing debts for the sale
        const existingDebts = await tx.debts.findMany({
          where: { sl_id: parseInt(SL_ID) },
          select: {
            d_date: true,
            d_type: true,
            d_amount: true,
            d_currency: true,
          },
        });

        // Clear existing debts for the sale
        await tx.debts.deleteMany({
          where: { sl_id: parseInt(SL_ID) },
        });

        // Recalculate debts based on the new payment amounts
        const remainingAmount = SL_TOTAL - SL_PAYED;

        // Insert new debts with preserved D_DATE or current date
        if (remainingAmount > 0) {
          const debtDate =
            existingDebts.find((debt) => debt.d_type === "DEBT_IN")?.d_date ||
            new Date();
          await tx.debts.create({
            data: {
              d_date: debtDate,
              d_type: "DEBT_IN",
              d_amount: -remainingAmount,
              d_currency: SL_CURRENCY,
              sl_id: parseInt(SL_ID),
            },
          });
        } else if (remainingAmount < 0) {
          // If there is overpayment
          const debtDate =
            existingDebts.find((debt) => debt.d_type === "DEBT_OUT")?.d_date ||
            new Date();
          await tx.debts.create({
            data: {
              d_date: debtDate,
              d_type: "DEBT_OUT",
              d_amount: Math.abs(remainingAmount),
              d_currency: SL_CURRENCY,
              sl_id: parseInt(SL_ID),
            },
          });
        }

        if (SL_INAMOUNT > 0) {
          // Handle insurance debts
          const insuranceDebtDate =
            existingDebts.find((debt) => debt.d_type === "INSURANCE")?.d_date ||
            new Date();
          await tx.debts.create({
            data: {
              d_date: insuranceDebtDate,
              d_type: "INSURANCE",
              d_amount: -SL_INAMOUNT,
              d_currency: SL_CURRENCY,
              sl_id: parseInt(SL_ID),
            },
          });
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete sale
  static async deleteSale(saleId) {
    await prisma.sales.delete({
      where: { sl_id: parseInt(saleId) },
    });
  }
}

export default Sales;
