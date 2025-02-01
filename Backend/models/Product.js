import db from "../config/db.js";

class Product {
    // Get all products
    static async getAll() {
        const result = await db.query(
            "SELECT * FROM STOCK WHERE P_CATEGORY <> 'Device Under Maintenance'"
        );
        return result.rows;
    }

    // Delete product
    static async delete(id) {
        await db.query("DELETE FROM STOCK WHERE P_ID = $1", [id]);
    }

    // Create new product
    static async create(productData) {
        const result = await db.query(
            `INSERT INTO STOCK 
             (P_NAME, P_COSTPRICE, P_SELLPRICE, P_QUANTITY, P_PHOTO, 
              P_DESCRIPTION, P_CATEGORY, EXPIRE_DATE, MODEL_CODE) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING P_ID`,
            [
                productData.PNAME,
                productData.COSTPRICE,
                productData.SELLPRICE,
                productData.QUANTITY,
                productData.P_PHOTO || null,
                productData.DESCRIPTION,
                productData.CATEGORY,
                productData.EXPIRE_DATE,
                productData.MODEL_CODE
            ]
        );
        return result.rows[0];
    }

    // Update product
    static async update(id, updateData) {
        await db.query(
            `UPDATE STOCK SET 
             P_NAME = $1, P_COSTPRICE = $2, P_SELLPRICE = $3,
             P_QUANTITY = $4, P_DESCRIPTION = $5, 
             MODEL_CODE = $6, EXPIRE_DATE = $7 
             WHERE P_ID = $8`,
            [
                updateData.p_name,
                updateData.p_costprice,
                updateData.p_sellprice,
                updateData.p_quantity,
                updateData.p_discription,
                updateData.model_code,
                updateData.expire_date,
                id
            ]
        );
    }

    // Update product photo
    static async updatePhoto(id, filename) {
        console.log("filename", filename);
        await db.query(
            "UPDATE Stock SET P_PHOTO = $1 WHERE P_ID = $2",
            [filename, id]
        );
    }
}

export default Product;