import prisma from "../config/db.js";

class Product {
  // Get all products
  static async getAll() {
    return await prisma.stock.findMany({
      where: {
        p_category: {
          not: "Device Under Maintenance",
        },
      },
    });
  }

  // Delete product
  static async delete(id) {
    await prisma.stock.delete({
      where: { p_id: parseInt(id) },
    });
  }

  // Create new product
  static async create(productData) {
    const result = await prisma.stock.create({
      data: {
        p_name: productData.PNAME,
        p_costprice: productData.COSTPRICE,
        p_sellprice: productData.SELLPRICE,
        p_quantity: productData.QUANTITY,
        p_photo: productData.P_PHOTO || null,
        p_description: productData.DESCRIPTION,
        p_category: productData.CATEGORY,
        expire_date: productData.EXPIRE_DATE
          ? new Date(productData.EXPIRE_DATE)
          : null,
        model_code: productData.MODEL_CODE,
      },
      select: { p_id: true },
    });
    return { P_ID: result.p_id };
  }

  // Update product
  static async update(id, updateData) {
    await prisma.stock.update({
      where: { p_id: parseInt(id) },
      data: {
        p_name: updateData.p_name,
        p_costprice: updateData.p_costprice,
        p_sellprice: updateData.p_sellprice,
        p_quantity: updateData.p_quantity,
        p_description: updateData.p_discription,
        model_code: updateData.model_code,
        expire_date: updateData.expire_date
          ? new Date(updateData.expire_date)
          : null,
      },
    });
  }

  // Update product photo
  static async updatePhoto(id, filename) {
    console.log("filename", filename);
    await prisma.stock.update({
      where: { p_id: parseInt(id) },
      data: { p_photo: filename },
    });
  }
}

export default Product;
