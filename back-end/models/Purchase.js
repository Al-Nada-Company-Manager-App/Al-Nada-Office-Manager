import prisma from "../config/db.js";

class Purchase {
  // Get all purchases with supplier info
  static async getAllPurchases() {
    return await prisma.purchase.findMany({
      include: {
        supplier: {
          select: {
            s_name: true,
            s_photo: true,
          },
        },
      },
    });
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

      const result = await prisma.$transaction(async (tx) => {
        const purchaseResult = await tx.purchase.create({
          data: {
            s_id: supplier.s_id,
            pch_date: new Date(purchasedate),
            pch_total: total,
            pch_tax: tax,
            pch_cost: cost,
            pch_billnum: billNumber,
            pch_currency: currency,
            pch_expense: expense,
            pch_customscost: customscost,
            pch_customsnum: customsnum,
          },
        });

        const purchaseId = purchaseResult.pch_id;

        for (const product of products) {
          await tx.purchase_items.create({
            data: {
              p_id: product.p_id,
              pch_id: purchaseId,
              pi_quantity: product.quantity,
              pi_total: product.quantity * product.costprice,
            },
          });

          await tx.stock.update({
            where: { p_id: product.p_id },
            data: {
              p_quantity: {
                increment: product.quantity,
              },
              p_costprice: product.costprice,
            },
          });
        }

        return purchaseId;
      });

      return result;
    } catch (error) {
      console.error("Error creating Purchase:", error);
      throw error;
    }
  }

  // Get products in a specific purchase
  static async getProductsInPurchase(PCH_ID) {
    try {
      return await prisma.purchase_items.findMany({
        where: { pch_id: parseInt(PCH_ID) },
        include: {
          stock: {
            select: {
              p_name: true,
              p_sellprice: true,
              p_quantity: true,
              p_photo: true,
              p_description: true,
              model_code: true,
              expire_date: true,
              p_status: true,
              serial_number: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching products in purchase:", error);
      throw error;
    }
  }

  // Update an existing purchase
  static async updatePurchase(PCH_ID, updateData) {
    try {
      const { cost, tax, customscost, expense, total, products } = updateData;

      await prisma.$transaction(async (tx) => {
        await tx.purchase.update({
          where: { pch_id: parseInt(PCH_ID) },
          data: {
            pch_total: total,
            pch_tax: tax,
            pch_cost: cost,
            pch_expense: expense,
            pch_customscost: customscost,
          },
        });

        // Get current products to reverse their quantities
        const currentProducts = await tx.purchase_items.findMany({
          where: { pch_id: parseInt(PCH_ID) },
          select: {
            p_id: true,
            pi_quantity: true,
          },
        });

        // Reverse the stock quantities
        for (const item of currentProducts) {
          await tx.stock.update({
            where: { p_id: item.p_id },
            data: {
              p_quantity: {
                decrement: item.pi_quantity,
              },
            },
          });
        }

        // Delete existing purchase items
        await tx.purchase_items.deleteMany({
          where: { pch_id: parseInt(PCH_ID) },
        });

        // Add new purchase items
        for (const product of products) {
          await tx.purchase_items.create({
            data: {
              p_id: product.p_id,
              pch_id: parseInt(PCH_ID),
              pi_quantity: product.quantity,
              p_costprice: product.costprice,
              pi_total: product.quantity * product.costprice,
            },
          });

          await tx.stock.update({
            where: { p_id: product.p_id },
            data: {
              p_quantity: {
                increment: product.quantity,
              },
              p_costprice: product.costprice,
            },
          });
        }
      });
    } catch (error) {
      console.error("Error updating Purchase:", error);
      throw error;
    }
  }

  // Delete a purchase
  static async deletePurchase(PCH_ID) {
    await prisma.purchase.delete({
      where: { pch_id: parseInt(PCH_ID) },
    });
  }
}

export default Purchase;
