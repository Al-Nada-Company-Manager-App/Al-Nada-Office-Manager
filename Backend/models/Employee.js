import db from "../config/db.js";
import bcrypt from "bcrypt";

class Employee {
  static async getAll() {
    const result = await db.query("SELECT * FROM EMPLOYEE");
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query("SELECT * FROM EMPLOYEE WHERE E_ID = $1", [
      id,
    ]);
    return result.rows[0];
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
    const result = await db.query(
      `INSERT INTO EMPLOYEE 
       (F_NAME, L_NAME, Birth_Date, SALARY, E_ROLE, E_ADDRESS, E_CITY, E_COUNTRY, E_ZIPCODE, E_USERNAME, E_PASSWORD, E_GENDER) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        fName,
        lName,
        birth_date,
        salary,
        role,
        address,
        city,
        country,
        zipcode,
        username,
        hashedPassword,
        gender,
      ]
    );

    if (role == "Manager") {
      await db.query(
        `INSERT INTO ACCESS_Actions (
            E_ID, 
            users_page, users_add, users_edit, users_delete, users_view,
            products_page, products_add, products_edit, products_delete, products_view,
            repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
            sales_page, sales_add, sales_edit, sales_delete, sales_view,
            price_page, price_add, price_edit, price_delete, price_view,
            debts_page, debts_add, debts_edit, debts_delete, debts_view,
            purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
            customer_page, customer_add, customer_edit, customer_delete, customer_view,
            supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
        ) VALUES (
            $1, 
            True, True, True, True, True, 
            True, True, True, True, True, 
            True, True, True, True, True, True, 
            True, True, True, True, True, 
            True, True, True, True, True, 
            True, True, True, True, True, 
            True, True, True, True, True, 
            True, True, True, True, True, 
            True, True, True, True, True  
        )`,
        [result.rows[0].e_id]
      );
    }
    if (role == "Technical Support") {
      await db.query(
        `INSERT INTO ACCESS_Actions (
            E_ID, 
            users_page, users_add, users_edit, users_delete, users_view,
            products_page, products_add, products_edit, products_delete, products_view,
            repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
            sales_page, sales_add, sales_edit, sales_delete, sales_view,
            price_page, price_add, price_edit, price_delete, price_view,
            debts_page, debts_add, debts_edit, debts_delete, debts_view,
            purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
            customer_page, customer_add, customer_edit, customer_delete, customer_view,
            supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
        ) VALUES (
            $1, 
            False, False, False, False, False, 
            True, True, True, False, True, 
            True, True, True, False, True, True,
            False, False, False, False, False, 
            False, False, False, False, False, 
            False, False, False, False, False,
            False, False, False, False, False,
            False, False, False, False, False, 
            False, False, False, False, False  
        )`,
        [result.rows[0].e_id]
      );
    }
    if (role == "SalesMan") {
      await db.query(
        `INSERT INTO ACCESS_Actions (
            E_ID, 
            users_page, users_add, users_edit, users_delete, users_view,
            products_page, products_add, products_edit, products_delete, products_view,
            repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
            sales_page, sales_add, sales_edit, sales_delete, sales_view,
            price_page, price_add, price_edit, price_delete, price_view,
            debts_page, debts_add, debts_edit, debts_delete, debts_view,
            purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
            customer_page, customer_add, customer_edit, customer_delete, customer_view,
            supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
        ) VALUES (
            $1, 
            False, False, False, False, False, 
            False, False, False, False, False, 
            False, False, False, False, False, False, 
            True, True, True, False, True, 
            True, True, True, False, True, 
            True, True, True, False, True, 
            False, False, False, False, False, 
            True, True, True, False, True, 
            False, False, False, False, False   
        )`,
        [result.rows[0].e_id]
      );
    }
    if (role == "Accountant") {
      await db.query(
        `INSERT INTO ACCESS_Actions (
            E_ID, 
            users_page, users_add, users_edit, users_delete, users_view,
            products_page, products_add, products_edit, products_delete, products_view,
            repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
            sales_page, sales_add, sales_edit, sales_delete, sales_view,
            price_page, price_add, price_edit, price_delete, price_view,
            debts_page, debts_add, debts_edit, debts_delete, debts_view,
            purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
            customer_page, customer_add, customer_edit, customer_delete, customer_view,
            supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
        ) VALUES (
            $1, 
            False, False, False, False, False,
            False, False, False, False, False,
            False, False, False, False, False, False,
            True, False, True, False, True, 
            True, True, True, False, True,
            True, True, True, False, True, 
            True, True, True, False, True, 
            False, False, False, False, False, 
            True, True, True, False, True   
        )`,
        [result.rows[0].e_id]
      );
    }
    if (role == "Secretary") {
      await db.query(
        `INSERT INTO ACCESS_Actions (
            E_ID, 
            users_page, users_add, users_edit, users_delete, users_view,
            products_page, products_add, products_edit, products_delete, products_view,
            repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
            sales_page, sales_add, sales_edit, sales_delete, sales_view,
            price_page, price_add, price_edit, price_delete, price_view,
            debts_page, debts_add, debts_edit, debts_delete, debts_view,
            purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
            customer_page, customer_add, customer_edit, customer_delete, customer_view,
            supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
        ) VALUES (
            $1, 
            True, False, False, False, True, 
            True, False, False, False, True, 
            True, False, False, False, True, False,
            True, False, False, False, True, 
            True, False, False, False, True, 
            True, False, False, False, True, 
            True, False, False, False, True, 
            True, False, False, False, True, 
            True, False, False, False, True 
        )`,
        [result.rows[0].e_id]
      );
    }

    return {
      id: result.rows[0].e_id,
      fName: result.rows[0].f_name,
      lName: result.rows[0].l_name,
    }
  }

  static async getAccess(e_id) {
    const result = await db.query(
      "SELECT * FROM ACCESS_Actions WHERE E_ID = $1",
      [e_id]
    );
    if (result.rows.length === 0) {
      throw new Error("Access data not found for user");
    }
    return result.rows[0];
  }

  static async update(id, employeeData) {

    const result = await db.query(
      `UPDATE EMPLOYEE SET 
        F_NAME = $1,
        L_NAME = $2,
        Birth_Date = $3,
        SALARY = $4,
        E_ADDRESS = $5,
        E_EMAIL = $6,
        E_PHONE = $7,
        E_CITY = $8,
        E_COUNTRY = $9,
        E_ZIPCODE = $10,
        E_USERNAME = $11
      WHERE E_ID = $12
      RETURNING *
      `,
      [
        employeeData.f_name,
        employeeData.l_name,
        employeeData.BirthDate,
        employeeData.salary,
        employeeData.e_address,
        employeeData.e_email,
        employeeData.e_phone,
        employeeData.e_city,
        employeeData.e_country,
        employeeData.e_zipcode,
        employeeData.e_username,
        employeeData.e_id
      ]
    );
    return result.rows[0];

  }

  static async updateAccess(id, access) {
    const keys = Object.keys(access);
    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = Object.values(access).map((value) =>
      value !== undefined ? value : false
    );
    values.push(id);

    const query = `UPDATE ACCESS_Actions SET ${setClause} WHERE E_ID = $${values.length}`;
    console.log(query, values);
    try {
      await db.query(query, values);
    }
    catch (error) {
      console.error("Error updating access:", error);
      throw new Error("Failed to update access");
    }

  }

  static async delete(id) {
    await db.query("DELETE FROM EMPLOYEE WHERE E_ID = $1", [id]);
  }

  static async deactivate(id) {
    await db.query("UPDATE EMPLOYEE SET E_ACTIVE = FALSE WHERE E_ID = $1", [
      id,
    ]);
  }

  static async activate(id) {
    await db.query("UPDATE EMPLOYEE SET E_ACTIVE = TRUE WHERE E_ID = $1", [id]);
  }

  static async updatePhoto(id, photo) {
    await db.query("UPDATE EMPLOYEE SET E_PHOTO = $1 WHERE E_ID = $2", [
      photo,
      id,
    ]);
  }
}

export default Employee;
