import prisma from "../config/db.js";

class Customer {
  // Get all customers
  static async getAll() {
    const customers = await prisma.customer.findMany();
    return customers;
  }

  // Delete customer
  static async delete(id) {
    await prisma.customer.delete({
      where: { c_id: parseInt(id) },
    });
  }

  // Create new customer
  static async create(customerData) {
    const result = await prisma.customer.create({
      data: {
        c_name: customerData.C_NAME,
        c_address: customerData.C_ADDRESS,
        c_city: customerData.C_CITY,
        c_country: customerData.C_COUNTRY,
        c_zipcode: customerData.C_ZIPCODE,
        c_fax: customerData.C_FAX,
        c_photo: customerData.C_PHOTO || null,
      },
      select: { c_id: true },
    });
    return { C_ID: result.c_id };
  }

  // Update customer
  static async update(id, updateData) {
    await prisma.customer.update({
      where: { c_id: parseInt(id) },
      data: {
        c_name: updateData.C_NAME,
        c_address: updateData.C_ADDRESS,
        c_city: updateData.C_CITY,
        c_country: updateData.C_COUNTRY,
        c_zipcode: updateData.C_ZIPCODE,
        c_fax: updateData.C_FAX,
      },
    });
  }

  // Update customer photo
  static async updatePhoto(id, filename) {
    console.log("filename", filename);
    console.log("id", id);
    await prisma.customer.update({
      where: { c_id: parseInt(id) },
      data: { c_photo: filename },
    });
  }

  // Get customer with sales
  static async getWithSales(id) {
    const customerResult = await prisma.customer.findUnique({
      where: { c_id: parseInt(id) },
      select: {
        c_id: true,
        c_name: true,
        c_address: true,
        c_city: true,
        c_country: true,
        c_zipcode: true,
        c_fax: true,
        c_photo: true,
      },
    });

    if (!customerResult) return null;

    const salesResult = await prisma.sales.findMany({
      where: { c_id: parseInt(id) },
      select: {
        sl_id: true,
        sl_date: true,
        sl_total: true,
        sl_discount: true,
        sl_tax: true,
        sl_status: true,
        sl_type: true,
        sl_inamount: true,
        sl_cost: true,
        sl_billnum: true,
        sl_payed: true,
        sl_currency: true,
      },
      orderBy: { sl_date: "desc" },
    });

    return {
      salesHistory: salesResult,
    };
  }
}

export default Customer;
