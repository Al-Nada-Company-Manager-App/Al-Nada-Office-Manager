import prisma from "../config/db.js";
import bcrypt from "bcrypt";

class Employee {
  static async getAll() {
    return await prisma.employee.findMany();
  }

  static async getById(id) {
    return await prisma.employee.findUnique({
      where: { e_id: parseInt(id) },
    });
  }

  static async checkUsernameExists(username) {
    const user = await prisma.employee.findUnique({
      where: { e_username: username },
      select: { e_id: true },
    });
    return !!user;
  }

  static async findByUsername(username) {
    return await prisma.employee.findUnique({
      where: { e_username: username },
    });
  }

  static async findByIdForAuth(id) {
    return await prisma.employee.findUnique({
      where: { e_id: parseInt(id) },
    });
  }

  static async create(employeeData) {
    const {
      fName,
      lName,
      gender,
      birth_date,
      salary,
      role,
      address,
      city,
      country,
      zipcode,
      username,
      password,
    } = employeeData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.employee.create({
      data: {
        f_name: fName,
        l_name: lName,
        birth_date: birth_date ? new Date(birth_date) : null,
        salary: salary,
        e_role: role,
        e_address: address,
        e_city: city,
        e_country: country,
        e_zipcode: zipcode,
        e_username: username,
        e_password: hashedPassword,
        e_gender: gender,
      },
    });

    // Create access permissions based on role
    let accessData = { e_id: result.e_id };

    if (role === "Manager") {
      accessData = {
        ...accessData,
        users_page: true,
        users_add: true,
        users_edit: true,
        users_delete: true,
        users_view: true,
        products_page: true,
        products_add: true,
        products_edit: true,
        products_delete: true,
        products_view: true,
        repaire_page: true,
        repaire_add: true,
        repaire_edit: true,
        repaire_delete: true,
        repaire_view: true,
        repaire_adddum: true,
        sales_page: true,
        sales_add: true,
        sales_edit: true,
        sales_delete: true,
        sales_view: true,
        price_page: true,
        price_add: true,
        price_edit: true,
        price_delete: true,
        price_view: true,
        debts_page: true,
        debts_add: true,
        debts_edit: true,
        debts_delete: true,
        debts_view: true,
        purchase_page: true,
        purchase_add: true,
        purchase_edit: true,
        purchase_delete: true,
        purchase_view: true,
        customer_page: true,
        customer_add: true,
        customer_edit: true,
        customer_delete: true,
        customer_view: true,
        supplier_page: true,
        supplier_add: true,
        supplier_edit: true,
        supplier_delete: true,
        supplier_view: true,
      };
    } else if (role === "Technical Support") {
      accessData = {
        ...accessData,
        products_page: true,
        products_add: true,
        products_edit: true,
        products_view: true,
        repaire_page: true,
        repaire_add: true,
        repaire_edit: true,
        repaire_view: true,
        repaire_adddum: true,
      };
    } else if (role === "SalesMan") {
      accessData = {
        ...accessData,
        sales_page: true,
        sales_add: true,
        sales_edit: true,
        sales_view: true,
        price_page: true,
        price_add: true,
        price_edit: true,
        price_view: true,
        debts_page: true,
        debts_add: true,
        debts_edit: true,
        debts_view: true,
        customer_page: true,
        customer_add: true,
        customer_edit: true,
        customer_view: true,
      };
    } else if (role === "Accountant") {
      accessData = {
        ...accessData,
        sales_page: true,
        sales_edit: true,
        sales_view: true,
        price_page: true,
        price_add: true,
        price_edit: true,
        price_view: true,
        debts_page: true,
        debts_add: true,
        debts_edit: true,
        debts_view: true,
        purchase_page: true,
        purchase_add: true,
        purchase_edit: true,
        purchase_view: true,
        supplier_page: true,
        supplier_add: true,
        supplier_edit: true,
        supplier_view: true,
      };
    } else if (role === "Secretary") {
      accessData = {
        ...accessData,
        users_page: true,
        users_view: true,
        products_page: true,
        products_view: true,
        repaire_page: true,
        repaire_view: true,
        sales_page: true,
        sales_view: true,
        price_page: true,
        price_view: true,
        debts_page: true,
        debts_view: true,
        purchase_page: true,
        purchase_view: true,
        customer_page: true,
        customer_view: true,
        supplier_page: true,
        supplier_view: true,
      };
    }

    await prisma.access_actions.create({
      data: accessData,
    });

    return {
      id: result.e_id,
      fName: result.f_name,
      lName: result.l_name,
    };
  }

  static async getAccess(e_id) {
    const result = await prisma.access_actions.findUnique({
      where: { e_id: parseInt(e_id) },
    });
    if (!result) {
      throw new Error("Access data not found for user");
    }
    return result;
  }

  static async update(id, employeeData) {
    const result = await prisma.employee.update({
      where: { e_id: parseInt(employeeData.e_id) },
      data: {
        f_name: employeeData.f_name,
        l_name: employeeData.l_name,
        birth_date: employeeData.BirthDate
          ? new Date(employeeData.BirthDate)
          : null,
        salary: employeeData.salary,
        e_address: employeeData.e_address,
        e_email: employeeData.e_email,
        e_phone: employeeData.e_phone,
        e_city: employeeData.e_city,
        e_country: employeeData.e_country,
        e_zipcode: employeeData.e_zipcode,
        e_username: employeeData.e_username,
      },
    });
    return result;
  }

  static async updateAccess(id, access) {
    try {
      await prisma.access_actions.update({
        where: { e_id: parseInt(id) },
        data: access,
      });
    } catch (error) {
      console.error("Error updating access:", error);
      throw new Error("Failed to update access");
    }
  }

  static async delete(id) {
    await prisma.employee.delete({
      where: { e_id: parseInt(id) },
    });
  }

  static async deactivate(id) {
    await prisma.employee.update({
      where: { e_id: parseInt(id) },
      data: { e_active: false },
    });
  }

  static async activate(id) {
    await prisma.employee.update({
      where: { e_id: parseInt(id) },
      data: { e_active: true },
    });
  }

  static async updatePhoto(id, photo) {
    await prisma.employee.update({
      where: { e_id: parseInt(id) },
      data: { e_photo: photo },
    });
  }
}

export default Employee;
