import prisma from "../config/db.js";

class Supplier {
  // Get all suppliers
  static async getAll() {
    return await prisma.supplier.findMany();
  }

  // Delete supplier
  static async delete(id) {
    await prisma.supplier.delete({
      where: { s_id: parseInt(id) },
    });
  }

  // Create new supplier
  static async create(supplierData) {
    const result = await prisma.supplier.create({
      data: {
        s_name: supplierData.S_NAME,
        s_address: supplierData.S_ADDRESS,
        s_city: supplierData.S_CITY,
        s_country: supplierData.S_COUNTRY,
        s_zipcode: supplierData.S_ZIPCODE,
        s_fax: supplierData.S_FAX,
        s_photo: supplierData.S_PHOTO || null,
      },
      select: { s_id: true },
    });
    return { S_ID: result.s_id };
  }

  // Update supplier
  static async update(id, updateData) {
    await prisma.supplier.update({
      where: { s_id: parseInt(id) },
      data: {
        s_name: updateData.S_NAME,
        s_address: updateData.S_ADDRESS,
        s_city: updateData.S_CITY,
        s_country: updateData.S_COUNTRY,
        s_zipcode: updateData.S_ZIPCODE,
        s_fax: updateData.S_FAX,
      },
    });
  }

  // Update supplier photo
  static async updatePhoto(id, filename) {
    console.log("filename", filename);
    console.log("id", id);
    await prisma.supplier.update({
      where: { s_id: parseInt(id) },
      data: { s_photo: filename },
    });
  }

  // Get supplier with purchases
  static async getWithPurchases(id) {
    const purchasesResult = await prisma.purchase.findMany({
      where: { s_id: parseInt(id) },
      orderBy: { pch_date: "desc" },
    });
    return {
      purchasesHistory: purchasesResult,
    };
  }
}

export default Supplier;
