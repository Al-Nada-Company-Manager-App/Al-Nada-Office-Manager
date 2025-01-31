import db from "../config/db.js";
import bcrypt from "bcrypt";

class User {
  static async findByUsername(username) {
    const result = await db.query("SELECT * FROM EMPLOYEE WHERE E_USERNAME = $1", [username]);
    return result.rows[0];
  }

  static async updatePassword(username, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE EMPLOYEE SET E_PASSWORD = $1 WHERE E_USERNAME = $2", [hashedPassword, username]);
  }

  static async deactivateUser(username) {
    await db.query("UPDATE EMPLOYEE SET E_ACTIVE = FALSE WHERE E_USERNAME = $1", [username]);
  }
}

export default User;